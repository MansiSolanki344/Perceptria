from django.urls import path
from .views import UserProfileView, UploadedReportsView, GeneratedReportsView

urlpatterns = [
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("reports/uploaded/", UploadedReportsView.as_view(), name="uploaded-reports"),
    path("reports/generated/", GeneratedReportsView.as_view(), name="generated-reports"),
]
