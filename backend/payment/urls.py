from django.urls import path 
from . import views 

urlpatterns = [
    path("cart/", views.CartToOrderView.as_view()),
    path("orders/", views.OrdersView.as_view()),
    path("orders/<str:order_id>/", views.DetailOrderView.as_view()),
    path("makeSalad/", views.MakeSaladOrder.as_view()),
    path("startPayment/", views.StartPay.as_view()),
    path("callback/", views.CallbackPayment.as_view()),
    path("startChargeWallet/", views.StartPayWalletTransaction.as_view()),
    path("WalletChargecallback/", views.CallbackPayWallet.as_view()),
    path("payWithWallet/", views.PayWithWallet.as_view()),
]
