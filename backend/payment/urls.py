from django.urls import path 
from . import views 

urlpatterns = [
    path("cart/", views.CartToOrderView.as_view()),
    path("orders/", views.OrdersView.as_view()),
    path("orders/<str:order_id>/", views.DetailOrderView.as_view()),
]
