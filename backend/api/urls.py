# from django.urls import path
# from .views import UploadReportView, CSRFTokenView

# urlpatterns = [
#     path("upload/", UploadReportView.as_view(), name="upload"),
#     path("csrf/", CSRFTokenView.as_view(), name="csrf"),
# ]

# from django.urls import path
# from .views import get_csrf_token, upload_file

# urlpatterns = [
#     # path("csrf/", get_csrf_token, name="get_csrf_token"),  # CSRF token API
#     path("upload/", upload_file, name="upload_file"),  # File upload API
# ]

from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import UploadReportView
from .views import CSRFTokenView
from .views import send_sms


urlpatterns = [
   
    path("upload/", UploadReportView.as_view(), name="upload-report"),
    path("csrf/", CSRFTokenView.as_view(), name="csrf-token"),
    path('send-sms/',send_sms, name='send_sms'),
] 