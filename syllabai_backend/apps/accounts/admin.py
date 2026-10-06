from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import User


class AccountCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("email", "first_name", "last_name", "role")


class AccountChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = "__all__"


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    model = User
    add_form = AccountCreationForm
    form = AccountChangeForm
    ordering = ("email",)
    list_display = ("email", "first_name", "last_name", "role", "is_active", "is_staff", "date_joined")
    list_filter = ("role", "is_active", "is_staff", "date_joined")
    search_fields = ("email", "first_name", "last_name")
    readonly_fields = ("date_joined", "updated_at", "last_login")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal information", {"fields": ("first_name", "last_name", "role")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates", {"fields": ("date_joined", "updated_at", "last_login")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "first_name", "last_name", "role", "password1", "password2", "is_active", "is_staff")}),
    )
    filter_horizontal = ("groups", "user_permissions")
