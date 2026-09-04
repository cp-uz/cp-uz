import logging
from urllib.error import HTTPError, URLError

from django.http import HttpResponse, HttpResponseNotModified
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from ..selectors.catalog import public_problem_for_path
from ..services.statement_pdf import STATEMENT_PDF_CACHE_SECONDS, fetch_statement_pdf

logger = logging.getLogger(__name__)


class ProblemStatementPdfView(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        tags=["Problems"],
        operation_id="problem_statement_pdf",
        responses={(200, "application/pdf"): OpenApiTypes.BINARY},
    )
    def get(self, request, season_slug: str, event_slug: str, problem_slug: str):
        problem = public_problem_for_path(season_slug, event_slug, problem_slug)
        if not problem.statement_pdf_url:
            return Response({"detail": "Bu masala uchun PDF mavjud emas."}, status=404)

        etag = f'"{problem.statement_pdf_sha256}"' if problem.statement_pdf_sha256 else ""
        if etag and request.headers.get("If-None-Match") == etag:
            response = HttpResponseNotModified()
        else:
            try:
                payload = fetch_statement_pdf(problem)
            except (HTTPError, URLError, TimeoutError, ValueError, OSError):
                logger.exception("Could not load statement PDF for problem %s", problem.pk)
                return Response({"detail": "Masala PDF’ini yuklab bo‘lmadi."}, status=502)

            response = HttpResponse(payload, content_type="application/pdf")
            response["Content-Length"] = str(len(payload))
            response["Content-Disposition"] = f'inline; filename="{problem.slug}.pdf"'

        response["Cache-Control"] = f"public, max-age={STATEMENT_PDF_CACHE_SECONDS}"
        response["X-Content-Type-Options"] = "nosniff"
        if etag:
            response["ETag"] = etag
        return response
