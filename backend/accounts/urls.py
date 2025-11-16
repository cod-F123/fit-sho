from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView , TokenRefreshView , TokenVerifyView
from . import views

urlpatterns = [
    path("", views.CurrentUserView.as_view()),
    path("token/", TokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("register/", views.RegisterUserView.as_view()),
    path("validate/", views.ValidateUser.as_view()),
    path("profile/", views.UserProfileView.as_view()),
    path("addresses/", views.UserAddressesView.as_view()),
]
