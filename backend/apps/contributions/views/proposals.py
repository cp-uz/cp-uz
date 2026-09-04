from django.db.models import Prefetch
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import EditProposal, ProposalStatusEvent, ReviewRecord
from ..permissions import IsProposalOwnerOrStaff, ProposalEditable
from ..serializers import (
    EditProposalSerializer,
    ProposalReviewInputSerializer,
    ProposalTransitionInputSerializer,
    ReviewRecordSerializer,
)
from ..services import review_proposal, transition_proposal


@extend_schema_view(
    list=extend_schema(tags=["Contributions"]),
    create=extend_schema(tags=["Contributions"]),
    retrieve=extend_schema(tags=["Contributions"]),
)
class EditProposalViewSet(viewsets.ModelViewSet):
    queryset = EditProposal.objects.none()
    serializer_class = EditProposalSerializer
    permission_classes = [permissions.IsAuthenticated, IsProposalOwnerOrStaff, ProposalEditable]
    http_method_names = ("get", "post", "put", "patch", "delete", "head", "options")

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return EditProposal.objects.none()
        queryset = EditProposal.objects.select_related(
            "article__category", "submitter__guest_session"
        ).prefetch_related(
            Prefetch(
                "reviews",
                queryset=ReviewRecord.objects.select_related(
                    "reviewer__guest_session", "proposal", "article"
                ),
            ),
            Prefetch(
                "status_events",
                queryset=ProposalStatusEvent.objects.select_related("actor__guest_session"),
            ),
        )
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(submitter=self.request.user)

    def perform_create(self, serializer):
        article = serializer.validated_data["article"]
        serializer.save(
            submitter=self.request.user,
            base_content_hash=article.content_hash,
            proposed_title=serializer.validated_data.get("proposed_title", article.title),
            proposed_summary=serializer.validated_data.get("proposed_summary", article.summary),
            proposed_content=serializer.validated_data.get("proposed_content", article.content),
        )

    def perform_destroy(self, instance):
        if instance.status != EditProposal.Status.DRAFT:
            from rest_framework.exceptions import ValidationError

            raise ValidationError("Faqat qoralama taklifni o‘chirish mumkin.")
        instance.delete()

    @extend_schema(
        tags=["Contributions"],
        request=ProposalTransitionInputSerializer,
        responses=EditProposalSerializer,
    )
    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):
        proposal = self.get_object()
        serializer = ProposalTransitionInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        proposal = transition_proposal(
            proposal,
            EditProposal.Status.SUBMITTED,
            request.user,
            serializer.validated_data.get("note", ""),
        )
        return Response(self.get_serializer(proposal).data)

    @extend_schema(
        tags=["Moderation"], request=ProposalReviewInputSerializer, responses=ReviewRecordSerializer
    )
    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser])
    def review(self, request, pk=None):
        proposal = self.get_object()
        serializer = ProposalReviewInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review = review_proposal(proposal, request.user, **serializer.validated_data)
        return Response(ReviewRecordSerializer(review).data, status=status.HTTP_201_CREATED)

    @extend_schema(
        tags=["Contributions"],
        request=ProposalTransitionInputSerializer,
        responses=EditProposalSerializer,
    )
    @action(
        detail=True,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated, IsProposalOwnerOrStaff],
    )
    def withdraw(self, request, pk=None):
        proposal = self.get_object()
        serializer = ProposalTransitionInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        proposal = transition_proposal(
            proposal,
            EditProposal.Status.WITHDRAWN,
            request.user,
            serializer.validated_data.get("note", ""),
        )
        return Response(self.get_serializer(proposal).data)
