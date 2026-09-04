from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from ..models import ReadingProgress


@transaction.atomic
def save_reading_progress(*, user, changes, instance_id=None):
    """Apply all progress writes against fresh state, including simultaneous first writes."""
    get_user_model().objects.select_for_update().get(pk=user.pk)
    changes = dict(changes)
    article = changes.pop("article", None)
    rows = ReadingProgress.objects.select_for_update().filter(user=user)
    if instance_id is not None:
        progress = rows.get(pk=instance_id)
        if article is not None and article.pk != progress.article_id:
            raise ValidationError({"article_slug": "Progress maqolasini almashtirib bo‘lmaydi."})
    else:
        progress, _ = rows.get_or_create(user=user, article=article)

    incoming_percent = changes.get("percent", progress.percent)
    incoming_status = changes.get("status", progress.status)
    if incoming_percent >= progress.percent:
        progress.percent = (
            100 if incoming_status == ReadingProgress.Status.COMPLETED else incoming_percent
        )
        if "last_heading" in changes:
            progress.last_heading = changes["last_heading"]
    progress.status = (
        ReadingProgress.Status.COMPLETED
        if progress.percent >= 100
        else ReadingProgress.Status.IN_PROGRESS
        if progress.percent > 0
        else ReadingProgress.Status.NOT_STARTED
    )
    progress.last_read_at = timezone.now()
    progress.save(update_fields=("percent", "status", "last_heading", "last_read_at", "updated_at"))
    return progress
