from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User
from .services import register_user


class EmptySerializer(serializers.Serializer):
    pass


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "role", "date_joined", "updated_at")
        read_only_fields = fields


class RegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    first_name = serializers.CharField(max_length=150, trim_whitespace=True)
    last_name = serializers.CharField(max_length=150, trim_whitespace=True)

    def validate(self, attrs: dict) -> dict:
        user = User(email=attrs["email"], first_name=attrs["first_name"], last_name=attrs["last_name"])
        validate_password(attrs["password"], user=user)
        return attrs

    def create(self, validated_data: dict):
        return register_user(role=self.context["role"], **validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "role", "date_joined", "updated_at")
        read_only_fields = ("id", "email", "role", "date_joined", "updated_at")
