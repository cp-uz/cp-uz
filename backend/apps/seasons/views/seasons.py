from django.db.models import Count, Q
from django.utils import timezone
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import (
    PublicationStatus,
    Season,
)
from ..selectors.graph import graph_queryset
from ..serializers import (
    SeasonGraphSerializer,
    SeasonListSerializer,
)


@extend_schema_view(
    list=extend_schema(tags=["Seasons"], responses=SeasonListSerializer(many=True)),
    retrieve=extend_schema(tags=["Seasons"], responses=SeasonGraphSerializer),
)
class SeasonViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (permissions.AllowAny,)
    lookup_field = "slug"
    pagination_class = None

    def get_queryset(self):
        if self.action in {"retrieve", "current"}:
            return graph_queryset()
        queryset = Season.objects.published().annotate(
            event_count=Count(
                "events",
                filter=Q(events__publication_status=PublicationStatus.PUBLISHED),
                distinct=True,
            )
        )
        if self.request.query_params.get("featured", "").lower() in {"1", "true", "yes"}:
            queryset = queryset.filter(is_featured=True)
        return queryset

    def get_serializer_class(self):
        return SeasonListSerializer if self.action == "list" else SeasonGraphSerializer

    @extend_schema(tags=["Seasons"], responses=SeasonGraphSerializer)
    @action(detail=False, methods=("get",), url_path="current")
    def current(self, request):
        queryset = self.get_queryset()
        today = timezone.localdate()
        season = queryset.filter(is_featured=True).first()
        if season is None:
            season = queryset.filter(start_date__lte=today, end_date__gte=today).first()
        if season is None:
            season = queryset.first()
        if season is None:
            return Response(
                {"detail": "Hozircha nashr qilingan mavsum yo‘q."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(self.get_serializer(season).data)
