from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, viewsets

from ..models import ReviewRecord
from ..serializers import (
    ReviewRecordSerializer,
)


@extend_schema_view(
    list=extend_schema(tags=["Moderation"]), retrieve=extend_schema(tags=["Moderation"])
)
class ReviewHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ReviewRecord.objects.none()
    serializer_class = ReviewRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ("article__slug", "proposal", "stage", "decision")

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return ReviewRecord.objects.none()
        queryset = ReviewRecord.objects.select_related(
            "article", "proposal", "reviewer__guest_session"
        )
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(proposal__submitter=self.request.user)
