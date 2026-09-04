import logging

from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .. import telegram
from ..models import FeedbackSubmission
from ..serializers import FeedbackSubmissionSerializer

logger = logging.getLogger(__name__)


class FeedbackCreateView(APIView):
    authentication_classes = ()
    permission_classes = (permissions.AllowAny,)
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = "feedback"

    @extend_schema(tags=["Feedback"], responses={200: dict})
    def get(self, request):
        return Response(
            {
                "max_attachment_bytes": 5 * 1024 * 1024,
                "attachment_optional": True,
            }
        )

    @extend_schema(
        tags=["Feedback"],
        request=FeedbackSubmissionSerializer,
        responses={201: FeedbackSubmissionSerializer},
    )
    def post(self, request):
        serializer = FeedbackSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attachment = serializer.validated_data.get("attachment")
        submission = serializer.save()

        try:
            message_id = telegram.send_feedback(submission, attachment)
        except (telegram.TelegramAPIError, telegram.TelegramConfigurationError) as error:
            submission.delivery_status = FeedbackSubmission.DeliveryStatus.FAILED
            submission.delivery_error = str(error)[:255]
            submission.save(update_fields=("delivery_status", "delivery_error"))
            logger.warning("Feedback %s could not be delivered to Telegram", submission.pk)
            return Response(
                {
                    "error": {
                        "status": 502,
                        "detail": "Murojaat saqlandi, ammo Telegram’ga yuborilmadi.",
                    }
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        submission.delivery_status = FeedbackSubmission.DeliveryStatus.SENT
        submission.telegram_message_id = message_id
        submission.delivery_error = ""
        submission.save(update_fields=("delivery_status", "telegram_message_id", "delivery_error"))
        return Response(
            FeedbackSubmissionSerializer(submission).data,
            status=status.HTTP_201_CREATED,
        )
