import secrets

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

UPGRADE_PASSWORD_ALPHABET = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%_-"


def _generate_one_time_password(user):
    random = secrets.SystemRandom()
    while True:
        characters = [
            secrets.choice("abcdefghijkmnopqrstuvwxyz"),
            secrets.choice("ABCDEFGHJKLMNPQRSTUVWXYZ"),
            secrets.choice("23456789"),
            secrets.choice("!@#$%_-"),
        ]
        characters.extend(secrets.choice(UPGRADE_PASSWORD_ALPHABET) for _ in range(16))
        random.shuffle(characters)
        password = "".join(characters)
        try:
            validate_password(password, user=user)
        except DjangoValidationError:
            continue
        return password
