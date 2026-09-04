from __future__ import annotations

from django.conf import settings
from django.db import models

from common.models import TimeStampedModel

from .content import Article


class GlossaryTerm(TimeStampedModel):
    term = models.CharField(max_length=160, unique=True)
    slug = models.SlugField(max_length=180, unique=True)
    short_definition = models.CharField(max_length=400)
    definition = models.TextField()
    aliases = models.JSONField(default=list, blank=True)
    related_articles = models.ManyToManyField(Article, related_name="glossary_terms", blank=True)
    is_published = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="glossary_terms_created",
    )

    class Meta:
        ordering = ("term",)

    def __str__(self) -> str:
        return self.term
