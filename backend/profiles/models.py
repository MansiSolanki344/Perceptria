from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    mobile = models.CharField(max_length=15, blank=True, null=True)
    allow_alerts = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

class UploadedReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to="uploaded_reports/")
    filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

class GeneratedReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to="generated_reports/")
    filename = models.CharField(max_length=255)
    generated_at = models.DateTimeField(auto_now_add=True)
