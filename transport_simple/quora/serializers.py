# Standard Library

# App Imports
from django.contrib.auth.models import User
from django.db.models import QuerySet
from quora.models import Answer, AnswerReaction, Question
from quora.taxonomies import AnswerReactionType
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import (
    CharField,
    Field,
    ModelSerializer,
    Serializer,
    SerializerMethodField,
)


class SerializedRelationField(Field):
    def __init__(
        self, lookup_key: str, queryset: QuerySet, repr_serializer, **kwargs
    ):
        self.lookup_key = lookup_key
        self.queryset = queryset
        self.repr_serializer = repr_serializer
        super(SerializedRelationField, self).__init__(**kwargs)

    def to_internal_value(self, data):
        try:
            value = data
            if isinstance(data, dict):
                key = self.lookup_key.split("__")[-1]
                value = data[key]
            if value:
                return self.queryset.get(**{self.lookup_key: value})
        except Exception as exc:
            raise ValidationError(exc)
        else:
            return None

    def to_representation(self, value):
        return self.repr_serializer(instance=value, context=self.context).data


class LoginSerializer(Serializer):
    username = CharField()
    password = CharField(write_only=True)


class LiteUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
        ]


class ListQuestionSerializer(ModelSerializer):
    username = CharField(source="user.username", read_only=True)

    class Meta:
        model = Question
        fields = [
            "uid",
            "title",
            "answer_count",
            "username",
            "created",
        ]
        read_only_fields = [
            "uid",
            "created",
        ]


class QuestionSerializer(ModelSerializer):
    username = CharField(source="user.username", read_only=True)
    is_yours = SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            "uid",
            "title",
            "description",
            "answer_count",
            "username",
            "is_yours",
            "created",
            "updated",
        ]
        read_only_fields = [
            "uid",
            "created",
            "updated",
        ]

    def get_is_yours(self, instance: Question):
        if user := self.context.get("request").user:
            if user.is_authenticated:
                return instance.user == user
        return False


class AnswerSerializer(ModelSerializer):
    username = CharField(source="user.username", read_only=True)
    user = LiteUserSerializer(read_only=True)
    is_upvoted = SerializerMethodField()
    is_downvoted = SerializerMethodField()
    is_yours = SerializerMethodField()
    question = SerializedRelationField(
        lookup_key="uid",
        queryset=Question.objects,
        repr_serializer=ListQuestionSerializer,
    )

    class Meta:
        model = Answer
        fields = [
            "uid",
            "title",
            "description",
            "question",
            "upvote_count",
            "downvote_count",
            "is_upvoted",
            "is_downvoted",
            "is_yours",
            "username",
            "user",
            "created",
            "updated",
        ]
        read_only_fields = [
            "uid",
            "created",
            "updated",
        ]

    def get_is_upvoted(self, instance: Answer):
        if user := self.context.get("request").user:
            return instance.answerreaction_set.filter(
                user=user, reaction_type=AnswerReactionType.UPVOTE
            ).exists()
        return False

    def get_is_downvoted(self, instance: Answer):
        if user := self.context.get("request").user:
            return instance.answerreaction_set.filter(
                user=user, reaction_type=AnswerReactionType.DOWNVOTE
            ).exists()
        return False

    def get_is_yours(self, instance: Answer):
        if user := self.context.get("request").user:
            return instance.user == user
        return False

    def validate(self, attrs):
        if "user" not in attrs and (user := self.context.get("request").user):
            attrs["user"] = user
        instance = Answer(**attrs)
        instance.clean()
        return super(AnswerSerializer, self).validate(attrs)


class AnswerReactionSerializer(ModelSerializer):
    user = LiteUserSerializer(read_only=True)
    answer = SerializedRelationField("uid", Answer.objects, AnswerReaction)

    class Meta:
        model = AnswerReaction
        fields = [
            "uid",
            "answer",
            "user",
            "reaction_type",
            "reaction_type_display",
            "created",
            "updated",
        ]
        read_only_fields = [
            "uid",
            "created",
            "updated",
        ]

    def validate(self, attrs):
        if "user" not in attrs and (user := self.context.get("request").user):
            attrs["user"] = user
        instance = AnswerReaction(**attrs)
        instance.clean()
        return super(AnswerReactionSerializer, self).validate(attrs)
