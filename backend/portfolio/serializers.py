from rest_framework import serializers

from .models import ContactMessage, Course, Experience, Project, SiteSettings, Skill


class TagListField(serializers.Field):
    """Accepts a list, or a comma-separated string (multipart forms)."""

    def to_representation(self, value):
        return value or []

    def to_internal_value(self, data):
        if isinstance(data, str):
            data = data.split(",")
        if not isinstance(data, list):
            raise serializers.ValidationError("Expected a list or comma-separated string.")
        return [str(t).strip() for t in data if str(t).strip()]


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        exclude = ["id"]


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = "__all__"


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["name", "email", "message"]


class ProjectSerializer(serializers.ModelSerializer):
    techs = TagListField(required=False)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Project
        fields = "__all__"
