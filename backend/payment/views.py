from django.shortcuts import render , get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import CartSerializer, Orderserializer
from shop.models import Package ,Product , MealPriceWeek , ExtraOptionPackage , ExtraOptionProduct
from .models import (Order , PackageOrderItem , PackageOrderItemExtra , ProductOrderItem , ProductOrderItemExtra)
from .permissions import IsOwnerOrder
from .filters import OrderFilter


# Create your views here.


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
            
            return Response({"order_id":order.order_id},status=status.HTTP_201_CREATED)
        
        else:
            return Response(cart_items_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

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
    
        


