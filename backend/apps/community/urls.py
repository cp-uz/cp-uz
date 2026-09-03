from django.urls import path

from .views import discord_redirect

app_name = "community"

urlpatterns = [
    path("community/discord/", discord_redirect, name="discord"),
]
