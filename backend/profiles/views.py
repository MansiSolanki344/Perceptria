from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from .models import UserProfile, UploadedReport, GeneratedReport
from .serializers import UserProfileSerializer, UploadedReportSerializer, GeneratedReportSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

class UploadedReportsView(generics.ListAPIView):
    serializer_class = UploadedReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UploadedReport.objects.filter(user=self.request.user)

class GeneratedReportsView(generics.ListAPIView):
    serializer_class = GeneratedReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return GeneratedReport.objects.filter(user=self.request.user)
