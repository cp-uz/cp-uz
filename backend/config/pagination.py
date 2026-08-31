from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    # The complete learning corpus is intentionally small enough for the
    # client-side catalog filters (currently 163 articles).
    max_page_size = 250
