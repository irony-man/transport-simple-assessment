# Standard Library
from typing import Any, Dict, List

from django.db.models import TextChoices


def serialize(klass) -> List[Dict[str, Any]]:
    return [
        {"name": x[1], "value": x[0]} for x in getattr(klass, "choices", [])
    ]


class AnswerReactionType(TextChoices):
    UPVOAT = "UPVOAT", "Upvote"
    DOWNVOAT = "DOWNVOAT", "Downvote"
