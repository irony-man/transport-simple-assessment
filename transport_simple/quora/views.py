from django.contrib.auth import authenticate, login, logout
from django.db.models import Count
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views.generic import FormView, TemplateView
from django_filters.rest_framework import DjangoFilterBackend
from quora.filters import AnswerFilter, QuestionFilter
from quora.forms import LoginForm, SignupForm
from quora.mixins import AuthMixin
from quora.models import Answer, Question
from quora.serializers import (
    AnswerReactionSerializer,
    AnswerSerializer,
    ListQuestionSerializer,
    QuestionSerializer,
)
from quora.taxonomies import AnswerReactionType
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet


class HomePageView(AuthMixin, TemplateView):
    template_name = "quora/home.html"


class LoginPageView(FormView):
    """
    Form View to log in the user, this uses django template
    """

    form_class = LoginForm
    template_name = "quora/login.html"
    success_url = reverse_lazy("quora:home")

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(self.success_url)
        return super(LoginPageView, self).dispatch(request, *args, **kwargs)

    def form_valid(self, form: LoginForm):
        user = authenticate(
            self.request,
            username=form.cleaned_data.get("username"),
            password=form.cleaned_data.get("password"),
        )
        if not user:
            form.errors.password = ("Invalid login credentials!!",)
            return super(LoginPageView, self).form_invalid(form)
        login(self.request, user)
        self.request.session["uid"] = None
        return redirect(self.success_url)


class SignupPageView(FormView):
    """
    Form View to sign up the user
    """

    form_class = SignupForm
    template_name = "quora/signup.html"
    success_url = reverse_lazy("quora:home")

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(self.success_url)
        return super(SignupPageView, self).dispatch(request, *args, **kwargs)

    def form_valid(self, form: SignupForm):
        login(self.request, form.cleaned_data["user"])
        self.request.session["uid"] = None
        return redirect(self.success_url)


class LogoutView(AuthMixin, TemplateView):
    """
    View to logout the user if logged in
    """

    def get(self, request, *args, **kwargs):
        logout(request)
        return redirect(reverse_lazy("quora:home"))


class QuestionViewSet(AuthMixin, ModelViewSet):
    serializer_class = QuestionSerializer
    filterset_class = QuestionFilter

    def get_serializer_class(self):
        if self.request.method.upper() == "GET" and not self.kwargs.get("pk"):
            return ListQuestionSerializer
        return super(QuestionViewSet, self).get_serializer_class()

    def get_queryset(self):
        return Question.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AnswerViewSet(AuthMixin, ModelViewSet):
    serializer_class = AnswerSerializer
    filterset_class = AnswerFilter
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ["created", "interaction"]

    def get_queryset(self):
        return Answer.objects.all().annotate(
            interaction=Count("answerreaction")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(methods=["POST"], detail=True)
    def upvote(self, request, *args, **kwargs):
        instance: Answer = self.get_object()

        data = dict(
            user=request.user.pk,
            answer=instance.pk,
            reaction_type=AnswerReactionType.DOWNVOTE,
        )
        reaction_serializer = AnswerReactionSerializer(
            data=data, context=self.get_serializer_context()
        )
        reaction_serializer.is_valid(raise_exception=True)

        instance.upvote(request.user)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(methods=["POST"], detail=True)
    def downvote(self, request, *args, **kwargs):
        instance: Answer = self.get_object()

        data = dict(
            user=request.user.pk,
            answer=instance.pk,
            reaction_type=AnswerReactionType.DOWNVOTE,
        )
        reaction_serializer = AnswerReactionSerializer(
            data=data, context=self.get_serializer_context()
        )
        reaction_serializer.is_valid(raise_exception=True)

        instance.downvote(request.user)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(methods=["DELETE"], detail=True)
    def remove_reaction(self, request, *args, **kwargs):
        instance: Answer = self.get_object()
        instance.answerreaction_set.filter(user=request.user).delete()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
