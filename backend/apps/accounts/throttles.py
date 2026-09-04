from hashlib import sha256

from rest_framework.throttling import SimpleRateThrottle


class LoginIPThrottle(SimpleRateThrottle):
    scope = "login_ip"

    def get_cache_key(self, request, view):
        return self.cache_format % {"scope": self.scope, "ident": self.get_ident(request)}


class LoginUsernameThrottle(SimpleRateThrottle):
    scope = "login_username"

    def get_cache_key(self, request, view):
        username = request.data.get("username", "") if isinstance(request.data, dict) else ""
        if not isinstance(username, str) or not username.strip():
            return None
        identity = sha256(username.strip().casefold().encode()).hexdigest()
        return self.cache_format % {"scope": self.scope, "ident": identity}
