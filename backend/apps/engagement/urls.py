from rest_framework.routers import DefaultRouter

from .views import BookmarkViewSet, PersonalNoteViewSet, ReadingProgressViewSet

app_name = "engagement"

router = DefaultRouter()
router.register("bookmarks", BookmarkViewSet, basename="bookmark")
router.register("progress", ReadingProgressViewSet, basename="progress")
router.register("notes", PersonalNoteViewSet, basename="note")

urlpatterns = router.urls
