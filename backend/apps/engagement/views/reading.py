from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import (
    Bookmark,
    PersonalNote,
    ReadingProgress,
)
from ..serializers import (
    BookmarkSerializer,
    PersonalNoteSerializer,
    ReadingProgressSerializer,
)


class OwnedModelViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ("get", "post", "put", "patch", "delete", "head", "options")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=("get",), url_path="all", pagination_class=None)
    def all_items(self, request):
        """Return this user's small learning collection without oversized page parameters."""

        queryset = self.filter_queryset(self.get_queryset())
        return Response(self.get_serializer(queryset, many=True).data)


@extend_schema_view(
    list=extend_schema(tags=["My learning"]),
    all_items=extend_schema(responses=BookmarkSerializer(many=True)),
    create=extend_schema(tags=["My learning"]),
    destroy=extend_schema(tags=["My learning"]),
)
class BookmarkViewSet(OwnedModelViewSet):
    queryset = Bookmark.objects.none()
    serializer_class = BookmarkSerializer
    http_method_names = ("get", "post", "delete", "head", "options")

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Bookmark.objects.none()
        return (
            Bookmark.objects.filter(user=self.request.user)
            .select_related("article__category")
            .prefetch_related("article__tags")
        )


@extend_schema_view(
    list=extend_schema(tags=["My learning"]),
    all_items=extend_schema(responses=ReadingProgressSerializer(many=True)),
    create=extend_schema(tags=["My learning"]),
    update=extend_schema(tags=["My learning"]),
    partial_update=extend_schema(tags=["My learning"]),
)
class ReadingProgressViewSet(OwnedModelViewSet):
    queryset = ReadingProgress.objects.none()
    serializer_class = ReadingProgressSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return ReadingProgress.objects.none()
        return (
            ReadingProgress.objects.filter(user=self.request.user)
            .select_related("article__category")
            .prefetch_related("article__tags")
        )


@extend_schema_view(
    list=extend_schema(tags=["My learning"]),
    all_items=extend_schema(responses=PersonalNoteSerializer(many=True)),
    create=extend_schema(tags=["My learning"]),
    update=extend_schema(tags=["My learning"]),
    partial_update=extend_schema(tags=["My learning"]),
)
class PersonalNoteViewSet(OwnedModelViewSet):
    queryset = PersonalNote.objects.none()
    serializer_class = PersonalNoteSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return PersonalNote.objects.none()
        return (
            PersonalNote.objects.filter(user=self.request.user)
            .select_related("article__category")
            .prefetch_related("article__tags")
        )
