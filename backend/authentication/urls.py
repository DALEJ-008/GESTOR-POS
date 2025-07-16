from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from . import views

router = DefaultRouter()

urlpatterns = [
    path('login/', views.UserLoginView.as_view(), name='user_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', views.UserRegistrationView.as_view(), name='user_register'),
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('change-password/', views.change_password, name='change_password'),
    path('users/', views.UserListView.as_view(), name='user_list'),
    path('logout/', views.user_logout, name='user_logout'),
    path('permissions/', views.user_permissions, name='user_permissions'),
]
