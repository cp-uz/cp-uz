from getpass import getpass

from django.core.management.base import BaseCommand, CommandError

from apps.community.crypto import CommunityLinkConfigurationError, encrypt_discord_invite_url


class Command(BaseCommand):
    help = "Discord invite URL uchun server-side shifrlangan konfiguratsiya tokenini yaratadi."

    def handle(self, *args, **options):
        url = getpass("Discord invite URL: ")
        try:
            token = encrypt_discord_invite_url(url)
        except CommunityLinkConfigurationError as error:
            raise CommandError(str(error)) from error
        self.stdout.write(f"DISCORD_INVITE_URL_ENCRYPTED={token}")
