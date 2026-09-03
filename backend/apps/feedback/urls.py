from django.urls import path

from .views import FeedbackCreateView, TelegramWebhookView

app_name = "feedback"

urlpatterns = [
    path("feedback/", FeedbackCreateView.as_view(), name="create"),
    path("telegram/webhook/", TelegramWebhookView.as_view(), name="telegram-webhook"),
]
