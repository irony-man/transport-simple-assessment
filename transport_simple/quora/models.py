import uuid

from django.contrib.auth.models import User
from django.db.models import (
    CASCADE,
    CharField,
    DateTimeField,
    ForeignKey,
    Model,
    TextField,
    UUIDField,
)
from quora.taxonomies import AnswerReactionType


class CreateUpdate(Model):
    uid = UUIDField(primary_key=True, default=uuid.uuid4)
    created = DateTimeField(auto_now_add=True)
    updated = DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Question(CreateUpdate):
    title = CharField(max_length=255)
    description = TextField(blank=True)
    user = ForeignKey(User, on_delete=CASCADE)

    @property
    def answer_count(self):
        return self.answer_set.count()

    @property
    def short_description(self):
        return (
            self.description[:300] + "..."
            if len(self.description) > 300
            else self.description
        )

    def __str__(self):
        return self.title


class Answer(CreateUpdate):
    question = ForeignKey(Question, on_delete=CASCADE)
    user = ForeignKey(User, on_delete=CASCADE)
    title = CharField(max_length=255, blank=True)
    description = TextField()

    @property
    def upvote_count(self):
        return self.answerreaction_set.filter(
            reaction_type=AnswerReactionType.UPVOAT
        ).count()

    @property
    def downvote_count(self):
        return self.answerreaction_set.filter(
            reaction_type=AnswerReactionType.DOWNVOAT
        ).count()

    def upvote(self, user):
        reaction, created = AnswerReaction.objects.get_or_create(
            answer=self,
            user=user,
            defaults={"reaction_type": AnswerReactionType.UPVOAT},
        )
        if not created:
            reaction.reaction_type = AnswerReactionType.UPVOAT
            reaction.save()
        return reaction

    def downvote(self, user):
        reaction, created = AnswerReaction.objects.get_or_create(
            answer=self,
            user=user,
            defaults={"reaction_type": AnswerReactionType.DOWNVOAT},
        )
        if not created:
            reaction.reaction_type = AnswerReactionType.DOWNVOAT
            reaction.save()
        return reaction

    def __str__(self):
        return f"{self.description} / {self.question.title}"


class AnswerReaction(CreateUpdate):
    answer = ForeignKey(Answer, on_delete=CASCADE)
    user = ForeignKey(User, on_delete=CASCADE)
    reaction_type = CharField(
        max_length=255,
        choices=AnswerReactionType.choices,
        default=AnswerReactionType.UPVOAT,
    )

    class Meta:
        unique_together = ("answer", "user")

    @property
    def reaction_type_display(self):
        return self.get_reaction_type_display()

    def __str__(self):
        return f"{self.user} / {self.answer} / {self.reaction_type}"
