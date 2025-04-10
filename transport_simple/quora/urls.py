from quora.views import AnswerViewSet, QuestionViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register("question", QuestionViewSet, basename="question")
router.register("answer", AnswerViewSet, basename="answer")
