import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = [
        ("articles", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]
    operations = [
        migrations.CreateModel(
            name="EditProposal",
            fields=[
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("base_content_hash", models.CharField(max_length=64)),
                ("proposed_title", models.CharField(max_length=240)),
                ("proposed_summary", models.TextField()),
                ("proposed_content", models.TextField()),
                ("proposal_hash", models.CharField(db_index=True, editable=False, max_length=64)),
                ("change_summary", models.TextField()),
                ("status", models.CharField(choices=[("draft", "Qoralama"), ("submitted", "Yuborilgan"), ("in_review", "Ko‘rib chiqilmoqda"), ("changes_requested", "O‘zgartirish so‘ralgan"), ("approved", "Tasdiqlangan"), ("rejected", "Rad etilgan"), ("merged", "Qo‘shilgan"), ("withdrawn", "Qaytarib olingan")], default="draft", max_length=30)),
                ("github_pr_url", models.URLField(blank=True)),
                ("submitted_at", models.DateTimeField(blank=True, null=True)),
                ("resolved_at", models.DateTimeField(blank=True, null=True)),
                ("article", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="edit_proposals", to="articles.article")),
                ("submitter", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="edit_proposals", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ("-updated_at",)},
        ),
        migrations.CreateModel(
            name="ProposalStatusEvent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("from_status", models.CharField(choices=[("draft", "Qoralama"), ("submitted", "Yuborilgan"), ("in_review", "Ko‘rib chiqilmoqda"), ("changes_requested", "O‘zgartirish so‘ralgan"), ("approved", "Tasdiqlangan"), ("rejected", "Rad etilgan"), ("merged", "Qo‘shilgan"), ("withdrawn", "Qaytarib olingan")], max_length=30)),
                ("to_status", models.CharField(choices=[("draft", "Qoralama"), ("submitted", "Yuborilgan"), ("in_review", "Ko‘rib chiqilmoqda"), ("changes_requested", "O‘zgartirish so‘ralgan"), ("approved", "Tasdiqlangan"), ("rejected", "Rad etilgan"), ("merged", "Qo‘shilgan"), ("withdrawn", "Qaytarib olingan")], max_length=30)),
                ("note", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("actor", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name="proposal_status_events", to=settings.AUTH_USER_MODEL)),
                ("proposal", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="status_events", to="contributions.editproposal")),
            ],
            options={"ordering": ("created_at",)},
        ),
        migrations.CreateModel(
            name="ReviewRecord",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("stage", models.CharField(choices=[("technical", "Texnik review"), ("language", "Til reviewi"), ("editorial", "Tahririy review")], max_length=20)),
                ("decision", models.CharField(choices=[("approved", "Tasdiqlandi"), ("changes_requested", "O‘zgartirish so‘raldi"), ("rejected", "Rad etildi")], max_length=30)),
                ("content_hash", models.CharField(db_index=True, max_length=64)),
                ("notes", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("article", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="review_records", to="articles.article")),
                ("proposal", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name="reviews", to="contributions.editproposal")),
                ("reviewer", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="review_records", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ("-created_at",)},
        ),
        migrations.AddIndex(model_name="editproposal", index=models.Index(fields=["status", "created_at"], name="proposal_status_idx")),
        migrations.AddIndex(model_name="editproposal", index=models.Index(fields=["article", "status"], name="proposal_article_idx")),
        migrations.AddIndex(model_name="reviewrecord", index=models.Index(fields=["article", "content_hash", "stage", "decision"], name="review_current_state_idx")),
    ]
