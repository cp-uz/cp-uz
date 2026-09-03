import logging

from django.conf import settings
from django.http import Http404, HttpRequest, HttpResponse, HttpResponseRedirect
from django.views.decorators.http import require_GET

from .crypto import CommunityLinkConfigurationError, decrypt_discord_invite_url

logger = logging.getLogger(__name__)


@require_GET
def discord_redirect(request: HttpRequest) -> HttpResponse:
    try:
        target = decrypt_discord_invite_url(settings.DISCORD_INVITE_URL_ENCRYPTED)
    except CommunityLinkConfigurationError:
        logger.error("Discord community redirect is not configured correctly")
        raise Http404 from None

    response = HttpResponseRedirect(target)
    response.headers["Cache-Control"] = "no-store"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["X-Robots-Tag"] = "noindex, nofollow"
    return response
