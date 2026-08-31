from rest_framework import serializers


class SearchQuerySerializer(serializers.Serializer):
    q = serializers.CharField(min_length=2, max_length=120, trim_whitespace=True)
    scope = serializers.ChoiceField(
        choices=("all", "articles", "glossary", "categories"), default="all"
    )
    limit = serializers.IntegerField(min_value=1, max_value=30, default=10)
