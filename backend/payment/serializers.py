from rest_framework import serializers
from .models import (Order, PackageOrderItem, PackageOrderItemExtra, ProductOrderItem, ProductOrderItemExtra)
from shop.serializers import (ExtraOptionPackageSerializer , PackageSerializer , MealPriceWeekSerializer , ExtraOptionProductSerializer, ProductSerializer)

class CartSerializer(serializers.Serializer):
    cart = serializers.ListField()
    
    
class PackageOrderItemExtraSerializer(serializers.ModelSerializer):
    
    option = ExtraOptionPackageSerializer(read_only=True)
    
    class Meta:
        model =PackageOrderItemExtra
        fields = ["id","option"]
        
class PackageOrderItemSerializer(serializers.ModelSerializer):
    
    package = PackageSerializer(read_only=True)
    meal_pricing = MealPriceWeekSerializer(read_only=True)
    
    extra_options = PackageOrderItemExtraSerializer(source = "extra_items",many=True, read_only=True)
    
    
    class Meta:
        model = PackageOrderItem
        fields = "__all__"
        

class ProductOrderItemExtraSerializer(serializers.ModelSerializer):
    option = ExtraOptionProductSerializer(read_only=True)
    
    class Meta:
        model = ProductOrderItemExtra
        fields = ["id","option"]
        
class ProductOrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    extra_options = ProductOrderItemExtraSerializer(source="extra_items", many=True,read_only=True)
    
    class Meta:
        model = ProductOrderItem
        fields = "__all__"
        

class Orderserializer(serializers.ModelSerializer):
    
    order_items = PackageOrderItemSerializer(many=True, read_only=True)
    product_order_items = ProductOrderItemSerializer(many=True, read_only=True)
    create_at = serializers.DateTimeField(format="%Y/%m/%d %H:%M:%S")
    payed_at = serializers.DateTimeField(format="%Y/%m/%d %H:%M:%S")
    completed_at = serializers.DateTimeField(format="%Y/%m/%d %H:%M:%S")
    
    class Meta:
        model = Order
        fields = "__all__"