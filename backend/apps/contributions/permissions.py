from rest_framework import permissions

from .models import EditProposal


class IsProposalOwnerOrStaff(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.submitter_id == request.user.id


class ProposalEditable(permissions.BasePermission):
    editable_statuses = {EditProposal.Status.DRAFT, EditProposal.Status.CHANGES_REQUESTED}

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_staff or obj.submitter_id == request.user.id
        return (
            request.user.is_staff
            or obj.submitter_id == request.user.id
            and obj.status in self.editable_statuses
        )
