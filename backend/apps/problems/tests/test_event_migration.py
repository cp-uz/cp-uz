from django.db import connection
from django.db.migrations.executor import MigrationExecutor
from django.test import TransactionTestCase


class ProblemEventMigrationTests(TransactionTestCase):
    migrate_from = ("problems", "0002_problem_statement_pdf")
    migrate_to = ("problems", "0003_problem_event_unique_slug")

    def setUp(self):
        executor = MigrationExecutor(connection)
        executor.migrate([self.migrate_from])
        self.old_apps = executor.loader.project_state([self.migrate_from]).apps
        Season = self.old_apps.get_model("seasons", "Season")
        Event = self.old_apps.get_model("seasons", "Event")
        ProblemSet = self.old_apps.get_model("problems", "ProblemSet")
        self.OldProblem = self.old_apps.get_model("problems", "Problem")
        season = Season.objects.create(
            title="Migration", slug="migration", start_date="2026-01-01", end_date="2026-12-31"
        )
        self.event = Event.objects.create(
            season=season, title="Event", code="E", slug="event", type="stage"
        )
        self.first_set = ProblemSet.objects.create(event=self.event, slug="one", title="One")
        self.second_set = ProblemSet.objects.create(event=self.event, slug="two", title="Two")
        self.original = self.OldProblem.objects.create(
            problem_set=self.first_set,
            slug="preserved",
            code="A",
            title="Original",
            statement_markdown="Original statement",
        )

    def tearDown(self):
        executor = MigrationExecutor(connection)
        executor.migrate(executor.loader.graph.leaf_nodes())
        super().tearDown()

    def test_existing_statement_identity_is_preserved_and_event_is_backfilled(self):
        executor = MigrationExecutor(connection)
        executor.migrate([self.migrate_to])
        Problem = executor.loader.project_state([self.migrate_to]).apps.get_model(
            "problems", "Problem"
        )
        problem = Problem.objects.get(pk=self.original.pk)
        self.assertEqual(problem.event_id, self.event.pk)
        self.assertEqual(problem.problem_set_id, self.first_set.pk)
        self.assertEqual(
            (problem.slug, problem.statement_markdown), ("preserved", "Original statement")
        )

    def test_ambiguous_legacy_urls_abort_migration_without_renaming_or_deleting(self):
        duplicate = self.OldProblem.objects.create(
            problem_set=self.second_set,
            slug="preserved",
            code="A",
            title="Other",
            statement_markdown="Other statement",
        )
        with self.assertRaisesMessage(RuntimeError, "Problem slugs must be unique within an event"):
            MigrationExecutor(connection).migrate([self.migrate_to])
        self.assertEqual(self.OldProblem.objects.filter(slug="preserved").count(), 2)
        duplicate.delete()
