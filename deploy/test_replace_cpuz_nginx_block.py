from __future__ import annotations

import unittest

from replace_cpuz_nginx_block import replace_cpuz_block


OLD = """
server {
    listen 80;
    server_name unrelated.example;
    location / { return 200 "{"; }
}

server {
    listen 80;
    server_name all.example cp.uz www.cp.uz;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name cp.uz www.cp.uz;
    root /home/cpuz-frontend;
    location /algo/ { proxy_pass https://example.test; }
}
"""

NEW = """
server {
    listen 443 ssl http2;
    server_name cp.uz www.cp.uz;
    location / { proxy_pass http://127.0.0.1:18181; }
}
"""


class ReplaceCpuzBlockTests(unittest.TestCase):
    def test_only_exact_cpuz_block_is_replaced(self) -> None:
        rendered = replace_cpuz_block(OLD, NEW)
        self.assertIn("server_name unrelated.example;", rendered)
        self.assertIn("server_name all.example cp.uz www.cp.uz;", rendered)
        self.assertIn("proxy_pass http://127.0.0.1:18181;", rendered)
        self.assertNotIn("/home/cpuz-frontend", rendered)
        self.assertNotIn("https://example.test", rendered)

    def test_fails_closed_when_target_is_missing(self) -> None:
        with self.assertRaisesRegex(ValueError, "found 0"):
            replace_cpuz_block("server { server_name other.test; }", NEW)

    def test_fails_closed_when_target_is_ambiguous(self) -> None:
        with self.assertRaisesRegex(ValueError, "found 2"):
            replace_cpuz_block(OLD + OLD, NEW)

    def test_fails_closed_when_exact_target_is_not_tls(self) -> None:
        source = """
server {
    listen 80;
    server_name cp.uz www.cp.uz;
}
"""
        with self.assertRaisesRegex(ValueError, "not a TLS"):
            replace_cpuz_block(source, NEW)

    def test_rejects_non_tls_replacement(self) -> None:
        replacement = """
server {
    listen 80;
    server_name cp.uz www.cp.uz;
}
"""
        with self.assertRaisesRegex(ValueError, "Replacement is not a TLS"):
            replace_cpuz_block(OLD, replacement)


if __name__ == "__main__":
    unittest.main()
