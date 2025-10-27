from django.urls import path
from . import views

urlpatterns = [
    path("getPackages/", views.GetPackages.as_view()),
    path("getPackage/<str:slug>/", views.GetPackage.as_view()),
    path("getProducts/", views.GetProductsAndCategories.as_view()),
    path("getProduct/<str:slug>/", views.GetProduct.as_view()),
]
