from django.contrib import admin
from quora.models import Answer, AnswerReaction, Question


class CreateUpdateAdmin(admin.ModelAdmin):
    readonly_fields = ("uid", "created", "updated")


@admin.register(Question)
class QuestionAdmin(CreateUpdateAdmin):
    list_display = ("title", "user")
    list_filter = ("user",)


@admin.register(Answer)
class AnswerAdmin(CreateUpdateAdmin):
    list_display = (
        "question",
        "user",
        "title",
        "upvote_count",
        "downvote_count",
    )
    list_filter = ("question", "user")


@admin.register(AnswerReaction)
class AnswerReactionAdmin(CreateUpdateAdmin):
    list_display = ("answer", "user", "reaction_type")
    list_filter = ("answer", "answer__question", "user", "reaction_type")
