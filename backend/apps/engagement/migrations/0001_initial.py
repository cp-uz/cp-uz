import django.core.validators
import django.db.models.deletion
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
            name="Bookmark",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("article", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="bookmarked_by", to="articles.article")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="bookmarks", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ("-created_at",), "constraints": [models.UniqueConstraint(fields=("user", "article"), name="unique_user_bookmark")]},
        ),
        migrations.CreateModel(
            name="PersonalNote",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("body", models.TextField()),
                ("anchor", models.CharField(blank=True, help_text="Maqoladagi sarlavha identifikatori yoki boshqa stabil belgi.", max_length=300)),
                ("quote", models.CharField(blank=True, max_length=500)),
                ("article", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="personal_notes", to="articles.article")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="personal_notes", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ("-updated_at",), "indexes": [models.Index(fields=["user", "article"], name="note_user_article_idx")]},
        ),
        migrations.CreateModel(
            name="ReadingProgress",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("status", models.CharField(choices=[("not_started", "Boshlanmagan"), ("in_progress", "O‘qilmoqda"), ("completed", "Tugallangan")], default="not_started", max_length=20)),
                ("percent", models.PositiveSmallIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ("last_heading", models.CharField(blank=True, max_length=300)),
                ("last_read_at", models.DateTimeField(auto_now=True)),
                ("article", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="reader_progress", to="articles.article")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="reading_progress", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "ordering": ("-last_read_at",),
                "constraints": [
                    models.UniqueConstraint(fields=("user", "article"), name="unique_user_reading_progress"),
                    models.CheckConstraint(condition=models.Q(("percent__gte", 0), ("percent__lte", 100)), name="reading_progress_valid_percent"),
                ],
            },
        ),
    ]
