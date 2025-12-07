from django.shortcuts import render , get_object_or_404 , redirect
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import CartSerializer, Orderserializer, SaladSerializer, StartPaySerializer, TransactionAmountSerializer
from shop.models import Package ,Product , MealPriceWeek , ExtraOptionPackage , ExtraOptionProduct, SaladItem
from .models import (Order, WalletOrder, SaladOrder, SaladItemOrderItem, PackageOrderItem , PackageOrderItemExtra , ProductOrderItem , ProductOrderItemExtra, Transaction)
from .permissions import IsOwnerOrder
from wallet.models import Wallet , WalletTransaction
from shipping.models import ShipmentDay, ShipmentOrder
from .filters import OrderFilter
from accounts.utils import send_message
from datetime import timedelta
from django.utils import timezone
import requests
import json

# Create your views here.

# Payment url and config
ZP_API_REQUEST = settings.ZP_API_REQUEST
ZP_API_VERIFY = settings.ZP_API_VERIFY
ZP_API_STARTPAY = settings.ZP_API_STARTPAY
MERCHANT_ID = settings.MERCHANT_ID
CALLBACK_URL = settings.CALLBACK_URL
REDIRECT_URL = settings.REDIRECT_URL_PAY
SECONDARY_CALLBACK_URL = settings.SECONDARY_CALLBACK_URL



def create_shipping_schedule(order):
    for package_item in order.order_items.all():

        weeks = package_item.meal_pricing.week_duration
        total_days = weeks * 7
        
        shipment = ShipmentOrder.objects.create(
            package_items=package_item,
            total_days=total_days,
            start_date=timezone.now().date()
        )

        # ساخت روزهای ارسال
        for i in range(total_days):
            ShipmentDay.objects.create(
                shipment=shipment,
                date=timezone.now().date() + timedelta(days=i)
            )

# Get Cart from client and create a order
class CartToOrderView(APIView):
    permission_classes = [IsAuthenticated]
    
    
    def post(self, request, format = None):
        cart_items_serializer = CartSerializer(data=request.data)
        
        if cart_items_serializer.is_valid():
            cart_items = cart_items_serializer.validated_data
            
            order = Order.objects.create(user = request.user)
            order.status = "pending"
            
            for cart_item in cart_items["cart"]:
                if cart_item["isPackage"]:
                    package = Package.objects.filter(id = int(cart_item["id"])).first()
                    
                    if package is not None :
             
                        selected_meal = MealPriceWeek.objects.filter(meal__id = int(cart_item["selectedMeal"]),meal__package__id = package.id,id = int(cart_item["weeks"])).first()

                        
                        try:
                            order_item_package = PackageOrderItem.objects.create(package = package, order = order, meal_pricing = selected_meal)
                            
                            order_item_package.amount = order_item_package.amount + selected_meal.price
                            
                            alergies = " ,".join(cart_item["allergies"])
                            
                            order_item_package.alergies = alergies
                            
                            for option in cart_item["extra_options"]:
                                opt = ExtraOptionPackage.objects.filter(package=package, id=int(option)).first()
                                if not opt:
                                    continue

                                extra_option = PackageOrderItemExtra.objects.create(item=order_item_package, option=opt)
                                
                                order_item_package.amount = order_item_package.amount + (selected_meal.week_duration * extra_option.option.price)
                                
                            
                            order_item_package.save()
                            
                            order.amount = order.amount + order_item_package.amount
                            
                            
                        
                        except Exception as e:
                            print(e)
                        
                        
                
                else:
                    product = Product.objects.filter(id = cart_item["id"],is_exist=True).first()
                    
                    try:
                        order_item_product = ProductOrderItem.objects.create(order = order, product= product)
                        order_item_product.quantity = int(int(cart_item["qty"]))
                        order_item_product.amount = order_item_product.amount + (int(cart_item["qty"]) * product.price)
                        for option in cart_item["extra_options"]:
                            
                            product_opt = ExtraOptionProduct.objects.filter(product = product, id = int(option)).first()
                            
                            if not product_opt:
                                continue
                            
                            extra_option_product = ProductOrderItemExtra.objects.create(item = order_item_product, option = product_opt)
                            order_item_product.amount = order_item_product.amount + (int(cart_item["qty"]) * extra_option_product.option.price)
                            
                        order_item_product.save()
                        
                        order.amount = order.amount + order_item_product.amount
                        
                    
                    except Exception as e:
                        print(e)
                
            order.save()
            
            try:
                send_message(order.user.phone,f"سفارش جدید شما با شماره {order.order_number} ثبت شد \n fit-bama \n لغو11 ")
                
            except:
                pass
            
            return Response({"order_id":order.order_id},status=status.HTTP_201_CREATED)
        
        else:
            return Response(cart_items_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
class MakeSaladOrder(APIView):
    permission_classes = [IsAuthenticated,]
    
    def post(self, request, format=None):
        salad_items_serializer = SaladSerializer(data = request.data)
        
        if salad_items_serializer.is_valid():
            salad_items = salad_items_serializer.validated_data
            
            if len(salad_items["salad_items"]) == 0:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            
            order = Order.objects.create(user = request.user, status= "pending")
            
            salad_order = SaladOrder.objects.create(order = order)
            
            for item in salad_items["salad_items"]:
                salad_item = SaladItem.objects.filter(id = item).first()
                
                if salad_item is not None:
                    SaladItemOrderItem.objects.create(salad = salad_order, item = salad_item)
                    salad_order.amount = salad_order.amount + salad_item.price
            
            salad_order.save()
            
            order.amount = salad_order.amount
            order.save()
            
            try:
                send_message(order.user.phone,f"سفارش جدید شما با شماره {order.order_number} ثبت شد \n fit-bama \n لغو11 ")
                
            except:
                pass
            
            return Response(status=status.HTTP_200_OK)
                
            
        else:
            return Response(salad_items_serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)
        
        

class OrdersView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        user_orders = Order.objects.filter(user = request.user)
        
        filtered_orders = OrderFilter(request.GET,queryset=user_orders,request=request)
        
        serializer = Orderserializer(filtered_orders.qs, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class DetailOrderView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrder]
    def get(self, request, order_id, format=None):
        order = get_object_or_404(Order, order_id = order_id, user = request.user)
        
        serializer = Orderserializer(order)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
        
class StartPay(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        start_pay_serializer = StartPaySerializer(data=request.data)
        
        if start_pay_serializer.is_valid():
            order = Order.objects.filter(order_id = start_pay_serializer.validated_data["order_id"]).first()
            
            # Check order
            if order is None:
                return Response({"error":"order not found"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check owner order
            if order.user.phone != request.user.phone:
                return Response({"error":"Access Denied"} , status=status.HTTP_403_FORBIDDEN)
            
            # Set address
            order.address = start_pay_serializer.validated_data["address"]
            order.save()
            
            # Make transaction or get
            transaction, created = Transaction.objects.get_or_create(order = order, user = request.user, amount = order.amount, status="pending")
            
            data = {
                "merchant_id" : MERCHANT_ID,
                "amount" : order.amount,
                "callback_url" : CALLBACK_URL,
                "currency" : "IRT",
                "description" : "پرداخت سفارش",
                "metadata" :{
                    "order_id" : order.order_id
                }
            }
            
            headers = {
                "content-type" : "applicatpion/json",
                "accept" : "application/json"
            }
            
            try:
                res = requests.post(ZP_API_REQUEST,data = json.dumps(data), headers=headers)
                
                if res.status_code == 200:
                    response = res.json()
                    
                    if response["data"]["code"] == 100:
                        transaction.transaction_token = response["data"]["authority"]
                        transaction.save()
                        
                        pay_url = f"{ZP_API_STARTPAY}{response['data']['authority']}"
                        return Response({"pay_url":pay_url}, status=status.HTTP_200_OK)
                    
                    else:
                        return Response({"error":"payment problem"}, status=status.HTTP_400_BAD_REQUEST)
                
                else:
                    return Response({"error":"payment problem"}, status=status.HTTP_400_BAD_REQUEST)   
            
            except Exception as e:
                return Response({"error":"payment problem"}, status=status.HTTP_400_BAD_REQUEST)           
        
        else:
            return Response(start_pay_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CallbackPayment(APIView):
    
    def get(self, request, format=None):
        authority = request.GET.get("Authority")
        payment_status = request.GET.get("Status")
        
        if payment_status and authority:
            
            try:
                # get transaction
                transaction = Transaction.objects.get(transaction_token = authority)
                
                if payment_status != "OK" :
                    return redirect(f"{REDIRECT_URL}/accounts/orders/")
                
                data = {
                    "merchant_id" : MERCHANT_ID,
                    "amount" : transaction.amount,
                    "authority": authority
                }
                
                headers = {
                    "content-type" : "applicatpion/json",
                    "accept" : "application/json"
                }
                
                res = requests.post(ZP_API_VERIFY,data=json.dumps(data), headers=headers)
                
                if res.status_code == 200 :
                    response = res.json()
                    
                    if response["data"]["code"] == 100:
                        transaction.status = "payed"
                        transaction.order.status = "processing"
                        transaction.order.save()
                        transaction.ref_id = response["data"]["ref_id"]
                        
                        transaction.save()
                        
                        create_shipping_schedule(transaction.order)
                        
                        try:
                            send_message(transaction.user.phone,f"پرداخت سفارش شماره {transaction.order.order_number} با موفقیت انجام شد و وضعیت آن به جاری آپدیت شد \n fit-bama")
                        except:
                            pass
                        return redirect(f"{REDIRECT_URL}/accounts/")
                    
                    else:
                        return redirect(f"{REDIRECT_URL}/accounts/")
                
                else:
                    return redirect(f"{REDIRECT_URL}/accounts/")
                
                
                
            
            except Transaction.DoesNotExist:
                return Response({"error":"transaction not found"}, status= status.HTTP_400_BAD_REQUEST)
        
        return Response(status= status.HTTP_403_FORBIDDEN)

class StartPayWalletTransaction(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        transaction_amount_serializer = TransactionAmountSerializer(data = request.data)
        
        if transaction_amount_serializer.is_valid():
            wallet = Wallet.objects.get(user = request.user)
            transaction_wallet_order = WalletOrder.objects.create(wallet = wallet, amount = transaction_amount_serializer.validated_data.get("amount"))
            
            
            data = {
                "merchant_id" : MERCHANT_ID,
                "amount" : transaction_wallet_order.amount,
                "callback_url" : SECONDARY_CALLBACK_URL,
                "currency" : "IRT",
                "description" : "پرداخت سفارش",
                
            }
            
            headers = {
                "content-type" : "applicatpion/json",
                "accept" : "application/json"
            }
            
            try:
                res = requests.post(ZP_API_REQUEST,data = json.dumps(data), headers=headers)
                
                if res.status_code == 200:
                    response = res.json()
                    
                    if response["data"]["code"] == 100:
                        transaction_wallet_order.transaction_token = response["data"]["authority"]
                        transaction_wallet_order.save()
                        
                        pay_url = f"{ZP_API_STARTPAY}{response['data']['authority']}"
                        return Response({"pay_url":pay_url}, status=status.HTTP_200_OK)
                    
                    else:
                        return Response({"error":"payment problem"}, status=status.HTTP_400_BAD_REQUEST)
                
                else:
                    return Response({"error":"payment problem"}, status=status.HTTP_400_BAD_REQUEST)   
            
            except Exception as e:
                return Response({"error":"payment problem"}, status=status.HTTP_400_BAD_REQUEST) 
            
        
        else:
            return Response(transaction_amount_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class CallbackPayWallet(APIView):
    def get(self, request, format= None):
        authority = request.GET.get("Authority")
        payment_status = request.GET.get("Status")
        
        if payment_status and authority:
            
            try:
                # get transaction
                transaction = WalletOrder.objects.get(transaction_token = authority)
                
                if payment_status != "OK" :
                    return redirect(f"{REDIRECT_URL}/accounts/myWallet")
                
                data = {
                    "merchant_id" : MERCHANT_ID,
                    "amount" : transaction.amount,
                    "authority": authority
                }
                
                headers = {
                    "content-type" : "applicatpion/json",
                    "accept" : "application/json"
                }
                
                res = requests.post(ZP_API_VERIFY,data=json.dumps(data), headers=headers)
                
                if res.status_code == 200 :
                    response = res.json()
                    
                    if response["data"]["code"] == 100:
                        transaction.status = "payed"                        
                        transaction.save()
                        WalletTransaction.objects.create(wallet = transaction.wallet, amount = transaction.amount, ref_id = response["data"]["ref_id"], transaction_type = "deposit")
                        
                        try:
                            send_message(transaction.wallet.user.phone,f"کیف پول شما به مبلغ {transaction.amount} تومان شارژ شد \n fit-bama")
                        except:
                            pass
                        return redirect(f"{REDIRECT_URL}/accounts/myWallet")
                    
                    else:
                        return redirect(f"{REDIRECT_URL}/accounts/myWallet")
                
                else:
                    return redirect(f"{REDIRECT_URL}/accounts/myWallet")
                
                
                
            
            except Transaction.DoesNotExist:
                return Response({"error":"transaction not found"}, status= status.HTTP_400_BAD_REQUEST)
        
        return Response(status= status.HTTP_403_FORBIDDEN)
    

class PayWithWallet(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        start_pay_serializer = StartPaySerializer(data=request.data)
        
        if start_pay_serializer.is_valid():
            order = Order.objects.filter(order_id = start_pay_serializer.validated_data["order_id"]).first()
            
            # Check order
            if order is None:
                return Response({"error":"order not found"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check owner order
            if order.user.phone != request.user.phone:
                return Response({"error":"Access Denied"} , status=status.HTTP_403_FORBIDDEN)
            
            # Check Wallet 
            user_wallet = Wallet.objects.get(user = request.user)
            
            if user_wallet.amount < order.amount:
                return Response({"error":"Invalid transaction"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Set address
            order.address = start_pay_serializer.validated_data["address"]
            
            WalletTransaction.objects.create(wallet = user_wallet, amount = order.amount, transaction_type = "withdraw")
            
            order.status = "processing"
            order.save()
            
            create_shipping_schedule(order)
            
            try:
                send_message(order.user.phone,f"پرداخت سفارش شماره {order.order_number} با موفقیت انجام شد و وضعیت آن به جاری آپدیت شد \n fit-bama")
            except:
                pass
            
            
            order_serialiser = Orderserializer(order)
            
            return Response({"order":order_serialiser.data},status=status.HTTP_200_OK)
        
        return Response(start_pay_serializer.errors, status=status.HTTP_400_BAD_REQUEST)