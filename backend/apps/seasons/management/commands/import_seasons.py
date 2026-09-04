from __future__ import annotations

from collections import Counter
from pathlib import Path
from typing import Any

from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.text import slugify

from apps.seasons.importing.content import DEFAULT_DATA_PATH, SeasonContentReader
from apps.seasons.models import (
    Event,
    EventEdge,
    EventResource,
    EventRoute,
    EventSource,
    Participant,
    ParticipantAlias,
    ParticipantPlatformAccount,
    PublicationStatus,
    ResultEntry,
    Route,
    Season,
    Team,
    TeamMember,
    VerificationStatus,
)


class Command(SeasonContentReader, BaseCommand):
    help = (
        "Olimpiada mavsumlari, eventlar, ishtirokchilar va natijalarni canonical JSON "
        "katalogidan import qiladi."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--path",
            type=Path,
            default=DEFAULT_DATA_PATH,
            help=f"Season content katalogi yoki legacy seed JSON (default: {DEFAULT_DATA_PATH})",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Validatsiya va importni bajarib, tranzaksiyani saqlamasdan ortga qaytaradi.",
        )
        parser.add_argument(
            "--prune",
            action="store_true",
            help="Canonical content ichida yo‘q eski season bolalarini o‘chiradi.",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Import qilinayotgan sluglardagi mavsumlarni oldin tozalab qayta yaratadi.",
        )

    def handle(self, *args, **options):
        path: Path = options["path"].expanduser().resolve()
        if not path.exists():
            raise CommandError(f"Season content topilmadi: {path}")
        payload = self.load_payload(path)

        self.validate_payload_schema(payload)
        self.validate_payload(payload)
        seasons_data = payload.get("seasons")

        self.stats: Counter[str] = Counter()
        try:
            with transaction.atomic():
                if options["clear"]:
                    slugs = [self.required(item, "slug", "season") for item in seasons_data]
                    deleted, _ = Season.objects.filter(slug__in=slugs).delete()
                    self.stats["cleared"] += deleted
                for season_data in seasons_data:
                    self.import_season(season_data, prune=options["prune"])
                if options["dry_run"]:
                    transaction.set_rollback(True)
        except (ValidationError, ValueError, TypeError, KeyError) as exc:
            raise CommandError(f"Seed validatsiyadan o‘tmadi: {exc}") from exc

        summary = ", ".join(f"{key}={value}" for key, value in sorted(self.stats.items()))
        prefix = "DRY RUN — " if options["dry_run"] else ""
        self.stdout.write(self.style.SUCCESS(f"{prefix}mavsum importi tugadi: {summary}"))

    def upsert(self, model, lookup: dict[str, Any], defaults: dict[str, Any], stat: str):
        instance = model.objects.filter(**lookup).first()
        created = instance is None
        if created:
            instance = model(**lookup)
        for key, value in defaults.items():
            setattr(instance, key, value)
        try:
            instance.full_clean()
        except ValidationError as exc:
            lookup_label = ", ".join(
                f"{key}={getattr(value, 'slug', getattr(value, 'code', value))}"
                for key, value in lookup.items()
            )
            details = exc.message_dict if hasattr(exc, "message_dict") else exc.messages
            raise ValueError(f"{stat}[{lookup_label}]: {details}") from exc
        instance.save()
        self.stats[f"{stat}_{'created' if created else 'updated'}"] += 1
        return instance

    def import_season(self, data: dict[str, Any], *, prune: bool):
        slug = self.required(data, "slug", "season")
        season = self.upsert(
            Season,
            {"slug": slug},
            {
                "title": self.required(data, "title", f"season[{slug}]"),
                "summary": data.get("summary", ""),
                "start_date": self.parsed_date(
                    self.required(data, "start_date", f"season[{slug}]"),
                    f"season[{slug}].start_date",
                ),
                "end_date": self.parsed_date(
                    self.required(data, "end_date", f"season[{slug}]"),
                    f"season[{slug}].end_date",
                ),
                "publication_status": data.get("publication_status", PublicationStatus.DRAFT),
                "verification_status": data.get(
                    "verification_status", VerificationStatus.UNVERIFIED
                ),
                "is_featured": data.get("is_featured", False),
                "order": data.get("order", 0),
            },
            "seasons",
        )

        route_codes: set[str] = set()
        routes: dict[str, Route] = {}
        for route_data in data.get("routes", []):
            route = self.import_route(season, route_data)
            routes[route.code] = route
            route_codes.add(route.code)

        participants: dict[str, Participant] = {}
        for participant_data in data.get("participants", []):
            participant = self.import_participant(
                participant_data,
                prune=prune,
                authoritative=True,
            )
            participants[participant_data["slug"]] = participant

        event_codes: set[str] = set()
        events: dict[str, Event] = {}
        for event_data in data.get("events", []):
            event = self.import_event(season, event_data)
            events[event.code] = event
            event_codes.add(event.code)

        for event_data in data.get("events", []):
            event = events[event_data["code"]]
            self.import_event_children(
                event,
                event_data,
                routes,
                participants,
                prune=prune,
            )

        edge_keys: set[tuple[str, str, str, str | None]] = set()
        for edge_data in data.get("edges", data.get("relations", [])):
            edge = self.import_edge(season, edge_data, events, routes)
            edge_keys.add(
                (
                    edge.from_event.code,
                    edge.to_event.code,
                    edge.relation_type,
                    edge.route.code if edge.route_id else None,
                )
            )

        if prune:
            for edge in season.edges.select_related("from_event", "to_event", "route"):
                key = (
                    edge.from_event.code,
                    edge.to_event.code,
                    edge.relation_type,
                    edge.route.code if edge.route_id else None,
                )
                if key not in edge_keys:
                    edge.delete()
                    self.stats["edges_deleted"] += 1
            deleted, _ = season.events.exclude(code__in=event_codes).delete()
            self.stats["events_deleted"] += deleted
            deleted, _ = season.routes.exclude(code__in=route_codes).delete()
            self.stats["routes_deleted"] += deleted

    def import_route(self, season: Season, data: dict[str, Any]) -> Route:
        code = self.required(data, "code", f"season[{season.slug}].route")
        return self.upsert(
            Route,
            {"season": season, "code": code},
            {
                "title": self.required(data, "title", f"route[{code}]"),
                "description": data.get("description", ""),
                "kind": self.required(data, "kind", f"route[{code}]"),
                "color": data.get("color", Route.Color.NEUTRAL),
                "line_style": data.get("line_style", "solid"),
                "icon": data.get("icon", ""),
                "order": data.get("order", 0),
                "is_visible": data.get("is_visible", True),
            },
            "routes",
        )

    def import_event(self, season: Season, data: dict[str, Any]) -> Event:
        code = self.required(data, "code", f"season[{season.slug}].event")
        title = self.required(data, "title", f"event[{code}]")
        mode = data.get("mode", Event.Mode.TBA)
        mode = {"in_person": Event.Mode.ONSITE, "offline": Event.Mode.ONSITE}.get(mode, mode)
        date_precision = data.get("date_precision", Event.DatePrecision.TBA)
        date_precision = {"exact": Event.DatePrecision.DAY}.get(date_precision, date_precision)
        return self.upsert(
            Event,
            {"season": season, "code": code},
            {
                "slug": data.get("slug") or slugify(title),
                "title": title,
                "short_title": data.get("short_title", ""),
                "summary": data.get("summary", ""),
                "description": data.get("description", ""),
                "type": self.required(data, "type", f"event[{code}]"),
                "publication_status": data.get("publication_status", PublicationStatus.DRAFT),
                "event_status": data.get("event_status", data.get("status", Event.Status.TBA)),
                "verification_status": data.get(
                    "verification_status", VerificationStatus.UNVERIFIED
                ),
                "date_precision": date_precision,
                "start_date": self.parsed_date(data.get("start_date"), f"event[{code}].start_date"),
                "end_date": self.parsed_date(data.get("end_date"), f"event[{code}].end_date"),
                "date_label": data.get("date_label", ""),
                "timezone": data.get("timezone", "Asia/Tashkent"),
                "location": data.get("location", ""),
                "venue": data.get("venue", ""),
                "mode": mode,
                "platform": data.get("platform", ""),
                "organizer": data.get("organizer", ""),
                "eligibility": data.get("eligibility", ""),
                "grade_min": data.get("grade_min"),
                "grade_max": data.get("grade_max"),
                "is_featured": data.get("is_featured", False),
                "order": data.get("order", 0),
            },
            "events",
        )

    def import_event_children(
        self,
        event: Event,
        data: dict[str, Any],
        routes: dict[str, Route],
        participants: dict[str, Participant],
        *,
        prune: bool,
    ):
        membership_keys: set[str] = set()
        memberships = data.get("route_memberships")
        if memberships is None:
            memberships = [{"route_code": code} for code in data.get("route_codes", [])]
        for membership_data in memberships:
            route_code = self.required(
                membership_data, "route_code", f"event[{event.code}].route_membership"
            )
            route = routes.get(route_code)
            if route is None:
                raise ValueError(f"event[{event.code}] noma’lum route_code: {route_code}")
            self.upsert(
                EventRoute,
                {"event": event, "route": route},
                {
                    "order": membership_data.get("order", event.order),
                    "node_style": membership_data.get("node_style", EventRoute.NodeStyle.DEFAULT),
                    "label": membership_data.get("label", ""),
                },
                "memberships",
            )
            membership_keys.add(route_code)
        if prune and ("route_memberships" in data or "route_codes" in data):
            deleted, _ = event.route_memberships.exclude(route__code__in=membership_keys).delete()
            self.stats["memberships_deleted"] += deleted

        resource_urls: set[str] = set()
        for resource_data in data.get("resources", []):
            url = self.required(resource_data, "url", f"event[{event.code}].resource")
            self.upsert(
                EventResource,
                {"event": event, "url": url},
                {
                    "type": self.required(resource_data, "type", f"event[{event.code}].resource"),
                    "title": self.required(resource_data, "title", f"event[{event.code}].resource"),
                    "is_official": resource_data.get("is_official", False),
                    "order": resource_data.get("order", 0),
                },
                "resources",
            )
            resource_urls.add(url)
        if prune and "resources" in data:
            deleted, _ = event.resources.exclude(url__in=resource_urls).delete()
            self.stats["resources_deleted"] += deleted

        source_urls: set[str] = set()
        for source_data in data.get("sources", []):
            url = self.required(source_data, "url", f"event[{event.code}].source")
            self.upsert(
                EventSource,
                {"event": event, "url": url},
                {
                    "type": self.required(source_data, "type", f"event[{event.code}].source"),
                    "title": self.required(source_data, "title", f"event[{event.code}].source"),
                    "publisher": source_data.get("publisher", ""),
                    "accessed_on": self.parsed_date(
                        source_data.get("accessed_on"),
                        f"event[{event.code}].source[{url}].accessed_on",
                    ),
                    "is_primary": source_data.get("is_primary", False),
                    "notes": source_data.get("notes", ""),
                },
                "sources",
            )
            source_urls.add(url)
        if prune and "sources" in data:
            deleted, _ = event.sources.exclude(url__in=source_urls).delete()
            self.stats["sources_deleted"] += deleted

        result_keys: set[str] = set()
        team_names: set[str] = set()
        for index, result_data in enumerate(data.get("results", [])):
            source_key, team_name = self.import_result(
                event,
                result_data,
                participants=participants,
                index=index,
                prune=prune,
            )
            result_keys.add(source_key)
            if team_name:
                team_names.add(team_name)
        if prune and "results" in data:
            deleted, _ = event.results.exclude(source_key__in=result_keys).delete()
            self.stats["results_deleted"] += deleted
            deleted, _ = event.teams.exclude(name__in=team_names).delete()
            self.stats["teams_deleted"] += deleted

    def import_edge(
        self,
        season: Season,
        data: dict[str, Any],
        events: dict[str, Event],
        routes: dict[str, Route],
    ) -> EventEdge:
        from_code = self.required(data, "from_event_code", f"season[{season.slug}].edge")
        to_code = self.required(data, "to_event_code", f"season[{season.slug}].edge")
        if from_code not in events or to_code not in events:
            raise ValueError(f"Noma’lum edge: {from_code} → {to_code}")
        route_code = data.get("route_code")
        if route_code and route_code not in routes:
            raise ValueError(f"edge[{from_code}→{to_code}] noma’lum route_code: {route_code}")
        relation_type = data.get("relation_type", data.get("type"))
        if not relation_type:
            raise ValueError(f"edge[{from_code}→{to_code}].type majburiy.")
        return self.upsert(
            EventEdge,
            {
                "season": season,
                "from_event": events[from_code],
                "to_event": events[to_code],
                "relation_type": relation_type,
                "route": routes.get(route_code),
            },
            {
                "line_style": data.get("line_style", "solid"),
                "label": data.get("label", ""),
                "order": data.get("order", 0),
            },
            "edges",
        )

    def unique_participant_slug(self, base: str) -> str:
        candidate = base or "ishtirokchi"
        suffix = 2
        while Participant.objects.filter(slug=candidate).exists():
            candidate = f"{base}-{suffix}"
            suffix += 1
        return candidate

    def import_participant(
        self,
        raw: dict[str, Any] | str,
        *,
        prune: bool = False,
        authoritative: bool = False,
    ) -> Participant:
        data = {"full_name": raw} if isinstance(raw, str) else raw
        full_name = self.required(data, "full_name", "participant")
        normalized = ParticipantAlias.normalize(full_name)
        alias = (
            ParticipantAlias.objects.select_related("participant")
            .filter(normalized_name=normalized)
            .first()
        )
        participant = alias.participant if alias else None
        supplied_slug = data.get("slug") or slugify(full_name)
        if participant is None and supplied_slug:
            participant = Participant.objects.filter(slug=supplied_slug).first()
        if participant is None:
            participant = Participant.objects.filter(full_name__iexact=full_name).first()
        if participant is None:
            participant = Participant(slug=self.unique_participant_slug(supplied_slug))
            created = True
        else:
            created = False
        participant.full_name = full_name
        if authoritative:
            participant.country_code = data.get("country_code", "UZB")
            participant.region = data.get("region", "")
            participant.school = data.get("school", "")
            participant.handle = data.get("handle", "")
            participant.bio = data.get("bio", "")
            participant.photo_url = data.get("photo_url", "")
        else:
            participant.country_code = data.get("country_code", participant.country_code or "UZB")
            participant.region = data.get("region", participant.region)
            participant.school = data.get("school", participant.school)
            participant.handle = data.get("handle", participant.handle)
            participant.bio = data.get("bio", participant.bio)
            participant.photo_url = data.get("photo_url", participant.photo_url)
        participant.full_clean()
        participant.save()
        self.stats[f"participants_{'created' if created else 'updated'}"] += 1

        alias_names = {full_name, *data.get("aliases", [])}
        for alias_name in alias_names:
            normalized_alias = ParticipantAlias.normalize(alias_name)
            existing = ParticipantAlias.objects.filter(normalized_name=normalized_alias).first()
            if existing and existing.participant_id != participant.id:
                raise ValueError(f"Alias boshqa ishtirokchiga tegishli: {alias_name}")
            if existing is None:
                alias_object = ParticipantAlias(
                    participant=participant,
                    name=alias_name,
                    normalized_name=normalized_alias,
                )
                alias_object.full_clean()
                alias_object.save()
                self.stats["aliases_created"] += 1

        if authoritative and prune:
            deleted, _ = participant.aliases.exclude(
                normalized_name__in={
                    ParticipantAlias.normalize(alias_name) for alias_name in alias_names
                }
            ).delete()
            self.stats["aliases_deleted"] += deleted

        account_keys: set[tuple[str, str]] = set()
        for index, account_data in enumerate(data.get("platform_accounts", [])):
            platform = self.required(account_data, "platform", "participant.platform_account")
            handle = self.required(account_data, "handle", "participant.platform_account")
            self.upsert(
                ParticipantPlatformAccount,
                {"participant": participant, "platform": platform, "handle": handle},
                {
                    "url": self.required(account_data, "url", "participant.platform_account"),
                    "title": account_data.get("title", ""),
                    "is_verified": account_data.get("is_verified", False),
                    "is_public": account_data.get("is_public", True),
                    "order": account_data.get("order", index),
                },
                "participant_accounts",
            )
            account_keys.add((platform, handle))
        if authoritative and prune:
            for account in participant.platform_accounts.all():
                if (account.platform, account.handle) not in account_keys:
                    account.delete()
                    self.stats["participant_accounts_deleted"] += 1
        return participant

    def resolve_participant(
        self,
        raw: dict[str, Any] | str,
        participants: dict[str, Participant],
        *,
        prune: bool,
    ) -> Participant:
        if isinstance(raw, str) and raw in participants:
            return participants[raw]
        return self.import_participant(raw, prune=prune)

    def import_team(
        self,
        event: Event,
        data: dict[str, Any],
        participants: dict[str, Participant],
        *,
        prune: bool,
    ) -> Team:
        name = self.required(data, "name", f"event[{event.code}].team")
        team = self.upsert(
            Team,
            {"event": event, "name": name},
            {
                "code": data.get("code", ""),
                "country_code": data.get("country_code", "UZB"),
                "school": data.get("school", ""),
                "notes": data.get("notes", ""),
            },
            "teams",
        )
        member_keys: set[tuple[str, str]] = set()
        for index, member_data in enumerate(data.get("members", [])):
            participant = self.resolve_participant(
                member_data["participant"], participants, prune=prune
            )
            role = member_data.get("role", TeamMember.Role.CONTESTANT)
            self.upsert(
                TeamMember,
                {"team": team, "participant": participant, "role": role},
                {"order": member_data.get("order", index)},
                "team_members",
            )
            member_keys.add((str(participant.id), role))
        if prune and "members" in data:
            for member in team.members.all():
                if (str(member.participant_id), member.role) not in member_keys:
                    member.delete()
                    self.stats["team_members_deleted"] += 1
        return team

    def import_result(
        self,
        event: Event,
        data: dict[str, Any],
        *,
        participants: dict[str, Participant],
        index: int,
        prune: bool,
    ) -> tuple[str, str | None]:
        participant = None
        team = None
        team_name = None
        if data.get("participant"):
            participant = self.resolve_participant(data["participant"], participants, prune=prune)
            subject_key = f"participant:{participant.slug}"
        elif data.get("team"):
            team = self.import_team(event, data["team"], participants, prune=prune)
            team_name = team.name
            subject_key = f"team:{team.name.casefold()}"
        else:
            raise ValueError(
                f"event[{event.code}].results[{index}] participant yoki team talab qiladi."
            )
        source_key = data.get("key") or ":".join(
            (
                subject_key,
                str(data.get("category", "")),
                str(data.get("order", index)),
            )
        )
        medal = data.get("medal", ResultEntry.Medal.NONE)
        if medal == "honorable_mention":
            medal = ResultEntry.Medal.HONOURABLE_MENTION
        self.upsert(
            ResultEntry,
            {"event": event, "source_key": source_key},
            {
                "participant": participant,
                "team": team,
                "rank": data.get("rank"),
                "score": self.parsed_decimal(
                    data.get("score"), f"event[{event.code}].results[{index}].score"
                ),
                "score_label": data.get("score_label", ""),
                "medal": medal,
                "award_title": data.get("award_title", ""),
                "category": data.get("category", ""),
                "is_local": data.get("is_local", True),
                "result_url": data.get("result_url", ""),
                "notes": data.get("notes", ""),
                "order": data.get("order", index),
            },
            "results",
        )
        return source_key, team_name
