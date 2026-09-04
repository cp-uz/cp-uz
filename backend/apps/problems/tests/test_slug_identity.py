from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.test import TestCase

from apps.problems.models import Problem, ProblemSet
from apps.seasons.tests.factories import build_public_graph


class ProblemIdentityTests(TestCase):
    def test_event_slug_is_unique_across_sets_and_set_cannot_move_events(self):
        build_public_graph()
        # The factory returns named domain objects used by the season API tests.
        from apps.seasons.models import Event

        events = list(Event.objects.order_by("order"))
        first_set = ProblemSet.objects.create(event=events[0], slug="first", title="First")
        second_set = ProblemSet.objects.create(event=events[0], slug="second", title="Second")
        Problem.objects.create(
            problem_set=first_set,
            slug="same",
            code="A",
            title="First",
            statement_markdown="Statement",
        )
        duplicate = Problem(
            problem_set=second_set,
            slug="same",
            code="A",
            title="Second",
            statement_markdown="Statement",
        )
        with self.assertRaises(ValidationError):
            duplicate.full_clean()
        with self.assertRaises(IntegrityError), transaction.atomic():
            duplicate.save()
        first_set.event = events[1]
        with self.assertRaises(ValidationError):
            first_set.save()
