from django.urls import path

from .views import CurrentUserView

app_name = "accounts"

urlpatterns = [
    path("me/", CurrentUserView.as_view(), name="me"),
]
