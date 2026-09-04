from copy import copy

from django.db import transaction
from drf_spectacular.openapi import AutoSchema
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken

from ..serializers import (
    AccountDeleteSerializer,
    UserProfileSerializer,
)


class DeleteRequestBodySchema(AutoSchema):
    """Document the explicit confirmation payload accepted by a DELETE operation."""

    def _get_request_body(self, direction="request"):
        if self.method != "DELETE":
            return super()._get_request_body(direction)

        request_schema = copy(self)
        request_schema.method = "POST"
        return AutoSchema._get_request_body(request_schema, direction)


@extend_schema(tags=["Account"])
class CurrentUserView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


@extend_schema(
    tags=["Account"],
    request=AccountDeleteSerializer,
    responses={
        204: OpenApiResponse(
            description="Akkaunt va unga tegishli barcha shaxsiy ma’lumotlar o‘chirildi."
        )
    },
)
class AccountDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    schema = DeleteRequestBodySchema()

    def delete(self, request):
        serializer = AccountDeleteSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = request.user
        with transaction.atomic():
            OutstandingToken.objects.filter(user_id=user.pk).delete()
            user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
