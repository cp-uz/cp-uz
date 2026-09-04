import hashlib
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from django.core.cache import cache

from ..models import Problem

STATEMENT_PDF_CACHE_SECONDS = 60 * 60 * 24


STATEMENT_PDF_MAX_BYTES = 10 * 1024 * 1024


STATEMENT_PDF_SOURCE_HOST = "raw.githubusercontent.com"


STATEMENT_PDF_SOURCE_PATH_PREFIX = "/cp-uz/problem-statements/"


def fetch_statement_pdf(problem: Problem) -> bytes:
    source_url = problem.statement_pdf_url
    parsed = urlparse(source_url)
    if not (
        parsed.scheme == "https"
        and parsed.hostname == STATEMENT_PDF_SOURCE_HOST
        and parsed.path.startswith(STATEMENT_PDF_SOURCE_PATH_PREFIX)
    ):
        raise ValueError("Unsupported statement PDF source")

    cache_key = f"problem-statement-pdf:{problem.statement_pdf_sha256 or problem.pk}"
    cached = cache.get(cache_key)
    if isinstance(cached, bytes):
        return cached

    upstream_request = Request(
        source_url,
        headers={"Accept": "application/pdf", "User-Agent": "cp.uz statement proxy"},
    )
    with urlopen(upstream_request, timeout=15) as upstream:  # noqa: S310
        payload = upstream.read(STATEMENT_PDF_MAX_BYTES + 1)

    if len(payload) > STATEMENT_PDF_MAX_BYTES:
        raise ValueError("Statement PDF is too large")
    if not payload.startswith(b"%PDF-"):
        raise ValueError("Statement source is not a PDF")
    if problem.statement_pdf_size_bytes and len(payload) != problem.statement_pdf_size_bytes:
        raise ValueError("Statement PDF size does not match its metadata")
    if problem.statement_pdf_sha256:
        checksum = hashlib.sha256(payload).hexdigest()
        if checksum != problem.statement_pdf_sha256:
            raise ValueError("Statement PDF checksum does not match its metadata")

    cache.set(cache_key, payload, timeout=STATEMENT_PDF_CACHE_SECONDS)
    return payload
