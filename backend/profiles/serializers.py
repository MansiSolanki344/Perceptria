from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, UploadedReport, GeneratedReport

class UserProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="user.first_name", required=False)
    email = serializers.EmailField(source="user.email", required=False)

    class Meta:
        model = UserProfile
        fields = ["name", "email", "mobile", "allow_alerts"]

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        instance.user.first_name = user_data.get("first_name", instance.user.first_name)
        instance.user.email = user_data.get("email", instance.user.email)
        instance.user.save()
        return super().update(instance, validated_data)

class UploadedReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedReport
        fields = ["id", "file", "filename", "uploaded_at"]

class GeneratedReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedReport
        fields = ["id", "file", "filename", "generated_at"]
