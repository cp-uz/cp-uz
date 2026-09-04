from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions

from ..selectors.catalog import public_problem_queryset, public_sets_for_event
from ..serializers import (
    ProblemDetailSerializer,
)


class ProblemDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ProblemDetailSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "problem_slug"

    def get_object(self):
        if not hasattr(self, "_problem_object"):
            self._problem_object = super().get_object()
        return self._problem_object

    @extend_schema(
        tags=["Problems"], operation_id="problem_detail", responses=ProblemDetailSerializer
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return (
            public_problem_queryset()
            .filter(
                problem_set__event__season__slug=self.kwargs["season_slug"],
                problem_set__event__slug=self.kwargs["event_slug"],
            )
            .select_related("problem_set", "event__season")
            .prefetch_related("links", "attachments")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        obj = self.get_object()
        context["event_sets"] = list(public_sets_for_event(obj.event))
        return context
