from django.core.management.base import BaseCommand, CommandError

from apps.feedback.telegram import (
    TelegramAPIError,
    TelegramConfigurationError,
    configure_webhook,
)


class Command(BaseCommand):
    help = "Configure Telegram to send bot updates to the cp.uz backend webhook."

    def add_arguments(self, parser):
        parser.add_argument("--drop-pending-updates", action="store_true")

    def handle(self, *args, **options):
        try:
            configure_webhook(drop_pending_updates=options["drop_pending_updates"])
        except (TelegramAPIError, TelegramConfigurationError) as error:
            raise CommandError(str(error)) from error
        self.stdout.write(self.style.SUCCESS("Telegram webhook configured."))
