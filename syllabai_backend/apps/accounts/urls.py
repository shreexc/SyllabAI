from django.urls import path

from .views import (
    CsrfTokenView,
    LogoutView,
    RefreshView,
    StudentCurrentUserView,
    StudentDashboardView,
    StudentLoginView,
    StudentProfileView,
    StudentRegistrationView,
    TeacherCurrentUserView,
    TeacherDashboardView,
    TeacherLoginView,
    TeacherProfileView,
    TeacherRegistrationView,
    CurrentUserView,
)

app_name = "accounts"

urlpatterns = [
    path("auth/csrf/", CsrfTokenView.as_view(), name="csrf"),
    path("auth/teacher/register/", TeacherRegistrationView.as_view(), name="teacher-register"),
    path("auth/student/register/", StudentRegistrationView.as_view(), name="student-register"),
    path("auth/teacher/login/", TeacherLoginView.as_view(), name="teacher-login"),
    path("auth/student/login/", StudentLoginView.as_view(), name="student-login"),
    path("auth/logout/", LogoutView.as_view(), name="logout"),
    path("auth/token/refresh/", RefreshView.as_view(), name="token-refresh"),
    path("auth/me/", CurrentUserView.as_view(), name="me"),
    path("auth/teacher/me/", TeacherCurrentUserView.as_view(), name="teacher-me"),
    path("auth/student/me/", StudentCurrentUserView.as_view(), name="student-me"),
    path("teacher/dashboard/", TeacherDashboardView.as_view(), name="teacher-dashboard"),
    path("teacher/profile/", TeacherProfileView.as_view(), name="teacher-profile"),
    path("student/dashboard/", StudentDashboardView.as_view(), name="student-dashboard"),
    path("student/profile/", StudentProfileView.as_view(), name="student-profile"),
]
