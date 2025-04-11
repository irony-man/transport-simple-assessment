from django.urls import path, re_path
from quora.views import (
    AnswerViewSet,
    HomePageView,
    LoginPageView,
    LogoutView,
    QuestionViewSet,
    SignupPageView,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register("question", QuestionViewSet, basename="question")
router.register("answer", AnswerViewSet, basename="answer")

urlpatterns = [
    path("login/", LoginPageView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path(
        "signup/",
        SignupPageView.as_view(),
        name="signup",
    ),
    re_path(r"^", HomePageView.as_view(), name="home"),
]
