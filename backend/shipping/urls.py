from django.urls import path
from . import views

urlpatterns = [
    path("getShipments/<int:orderItemId>/", views.ShipmentOrderView.as_view()),
]
