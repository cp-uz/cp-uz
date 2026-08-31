from rest_framework.routers import DefaultRouter

from .views import EditProposalViewSet, ReviewHistoryViewSet

app_name = "contributions"

router = DefaultRouter()
router.register("proposals", EditProposalViewSet, basename="proposal")
router.register("reviews", ReviewHistoryViewSet, basename="review")

urlpatterns = router.urls
