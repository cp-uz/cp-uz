from pathlib import Path

from rest_framework import serializers

from .models import FeedbackSubmission

MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024
ALLOWED_ATTACHMENT_TYPES = {
    "application/msword",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/webp",
    "text/plain",
}
ALLOWED_ATTACHMENT_EXTENSIONS = {".doc", ".docx", ".jpeg", ".jpg", ".pdf", ".png", ".txt", ".webp"}


class FeedbackSubmissionSerializer(serializers.ModelSerializer):
    contact = serializers.CharField(max_length=255, required=False, allow_blank=True)
    attachment = serializers.FileField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = FeedbackSubmission
        fields = (
            "id",
            "full_name",
            "contact",
            "note",
            "attachment",
            "delivery_status",
            "created_at",
        )
        read_only_fields = ("id", "delivery_status", "created_at")

    def validate_attachment(self, attachment):
        if attachment.size > MAX_ATTACHMENT_SIZE:
            raise serializers.ValidationError("Fayl hajmi 5 MB dan oshmasligi kerak.")

        content_type = (getattr(attachment, "content_type", "") or "").lower()
        extension = Path(attachment.name).suffix.lower()
        unsupported_type = content_type not in ALLOWED_ATTACHMENT_TYPES
        unsupported_extension = extension not in ALLOWED_ATTACHMENT_EXTENSIONS
        if unsupported_type or unsupported_extension:
            raise serializers.ValidationError(
                "Faqat JPG, PNG, WebP, PDF, DOC, DOCX yoki TXT fayl yuborish mumkin."
            )
        return attachment

    def create(self, validated_data):
        validated_data.pop("attachment", None)
        return super().create(validated_data)
