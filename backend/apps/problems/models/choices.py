from __future__ import annotations

from django.db import models


class TranslationStatus(models.TextChoices):
    AI_TRANSLATION = "ai_translation", "AI-tarjima"
    REVIEWED_TRANSLATION = "reviewed_translation", "Tekshiruvdan o‘tgan tarjima"
    ORIGINAL_UZBEK = "original_uzbek", "O‘zbekcha original"


class ProblemType(models.TextChoices):
    STANDARD = "standard", "Standart"
    INTERACTIVE = "interactive", "Interaktiv"
    OUTPUT_ONLY = "output_only", "Faqat output"
    COMMUNICATION = "communication", "Kommunikatsion"
    TWO_STEP = "two_step", "Ikki bosqichli"


class StatementPdfProvenance(models.TextChoices):
    OFFICIAL = "official", "Rasmiy"
    GENERATED = "generated", "cp.uz tayyorlagan"
