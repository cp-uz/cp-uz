import hashlib

from rest_framework.throttling import SimpleRateThrottle


def _normalized_username(request) -> str:
    value = request.data.get("username", "")
    return str(value).strip().casefold() or "<missing>"


class LoginIdentityRateThrottle(SimpleRateThrottle):
    """Limit repeated login attempts for one username from one client."""

    scope = "login"

    def get_cache_key(self, request, view):
        identity = f"{self.get_ident(request)}\0{_normalized_username(request)}"
        digest = hashlib.sha256(identity.encode("utf-8")).hexdigest()
        return self.cache_format % {"scope": self.scope, "ident": digest}


class LoginIpRateThrottle(SimpleRateThrottle):
    """Keep username rotation from bypassing the login throttle."""

    scope = "login_ip"

    def get_cache_key(self, request, view):
        return self.cache_format % {
            "scope": self.scope,
            "ident": self.get_ident(request),
        }
