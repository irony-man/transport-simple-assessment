from django.contrib.auth import authenticate, login
from django.views.generic import TemplateView
from django_filters.rest_framework import DjangoFilterBackend
from quora.models import Answer, Question
from quora.serializers import (
    AnswerSerializer,
    LiteQuestionSerializer,
    LiteUserSerializer,
    LoginSerializer,
    QuestionSerializer,
)
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet


class HomePageView(TemplateView):
    template_name = "quora/home.html"


class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]

            user = authenticate(request, username=username, password=password)
            if not user:
                return Response(
                    {"detail": "Invalid login credentials!!"},
                    status=HTTP_400_BAD_REQUEST,
                )
            login(request, user)
            return Response(
                LiteUserSerializer(instance=user).data,
                status=HTTP_200_OK,
            )

        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class QuestionViewSet(ModelViewSet):
    serializer_class = QuestionSerializer

    def get_serializer_class(self):
        print(self.kwargs)
        if self.request.method.upper() == "GET" and not self.kwargs.get("pk"):
            return LiteQuestionSerializer
        return super(QuestionViewSet, self).get_serializer_class()

    def get_queryset(self):
        return Question.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AnswerViewSet(ModelViewSet):
    serializer_class = AnswerSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["question"]
    ordering_fields = ["created"]

    def get_queryset(self):
        return Answer.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_permission_classes(self):
        if self.request.method in ["POST", "PUT", "PATCH", "DELETE"]:
            return [IsAuthenticated]
        return super(AnswerViewSet, self).get_permission_classes()

    @action(
        methods=["POST"], detail=True, permission_classes=[IsAuthenticated]
    )
    def upvote(self, request, *args, **kwargs):
        instance: Answer = self.get_object()
        instance.upvote(request.user)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(
        methods=["POST"], detail=True, permission_classes=[IsAuthenticated]
    )
    def downvote(self, request, *args, **kwargs):
        instance: Answer = self.get_object()
        instance.downvote(request.user)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(
        methods=["DELETE"], detail=True, permission_classes=[IsAuthenticated]
    )
    def remove_reaction(self, request, *args, **kwargs):
        instance: Answer = self.get_object()
        instance.answerreaction_set.filter(user=request.user).delete()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
