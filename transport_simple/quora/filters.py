from django_filters import filters, filterset
from quora.models import Answer, Question


class QuestionFilter(filterset.FilterSet):
    user_designs = filters.BooleanFilter(method="filter_user_designs")

    class Meta:
        model = Question
        fields = (
            "user",
            "user_designs",
        )

    def filter_user_designs(self, queryset, name, value):
        print(value)
        if value and self.request.user.is_authenticated:
            return queryset.filter(user=self.request.user)
        return queryset


class AnswerFilter(filterset.FilterSet):
    user_designs = filters.BooleanFilter(method="filter_user_designs")

    class Meta:
        model = Answer
        fields = (
            "user",
            "question",
            "user_designs",
        )

    def filter_user_designs(self, queryset, name, value):
        print(value)
        if value and self.request.user.is_authenticated:
            return queryset.filter(user=self.request.user)
        return queryset
