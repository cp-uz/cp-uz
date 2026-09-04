from django.db import migrations, models
import django.db.models.deletion


def backfill_events(apps, schema_editor):
    Problem = apps.get_model("problems", "Problem")
    problems = Problem.objects.using(schema_editor.connection.alias)
    duplicates = list(
        problems.values("problem_set__event_id", "slug")
        .annotate(total=models.Count("pk"))
        .filter(total__gt=1)
        .order_by("slug")[:10]
    )
    if duplicates:
        raise RuntimeError(
            "Problem slugs must be unique within an event before migration: "
            + ", ".join(item["slug"] for item in duplicates)
        )
    for problem in problems.select_related("problem_set").iterator():
        problems.filter(pk=problem.pk).update(event_id=problem.problem_set.event_id)


class Migration(migrations.Migration):
    dependencies = [
        ("problems", "0002_problem_statement_pdf"),
        ("seasons", "0003_participant_profile_asset_and_platform_choices"),
    ]

    operations = [
        migrations.AddField(
            model_name="problem",
            name="event",
            field=models.ForeignKey(
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="problems",
                to="seasons.event",
            ),
        ),
        migrations.RunPython(backfill_events, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="problem",
            name="event",
            field=models.ForeignKey(
                editable=False,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="problems",
                to="seasons.event",
            ),
        ),
        migrations.AddConstraint(
            model_name="problem",
            constraint=models.UniqueConstraint(
                fields=("event", "slug"), name="unique_event_problem_slug"
            ),
        ),
    ]
