from rest_framework import serializers
from .models import (Transaction ,Order, PackageOrderItem, PackageOrderItemExtra, ProductOrderItem, ProductOrderItemExtra, SaladOrder, SaladItemOrderItem)
from shop.serializers import (ExtraOptionPackageSerializer , PackageSerializer , MealPriceWeekSerializer , ExtraOptionProductSerializer, ProductSerializer,SaladItemSerializer)

class CartSerializer(serializers.Serializer):
    cart = serializers.ListField()

class SaladSerializer(serializers.Serializer):
    salad_items = serializers.ListField()
    
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

class SaladItemOrderItemSerializer(serializers.ModelSerializer):
    item = SaladItemSerializer(read_only=True)
    
    class Meta:
        model = SaladItemOrderItem
        fields = "__all__"

class SaladOrderSerializer(serializers.ModelSerializer):
    salad_items = SaladItemOrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = SaladOrder
        fields = "__all__"
        

class Orderserializer(serializers.ModelSerializer):
    
    order_items = PackageOrderItemSerializer(many=True, read_only=True)
    product_order_items = ProductOrderItemSerializer(many=True, read_only=True)
    salads_order = SaladOrderSerializer(read_only=True)
    create_at = serializers.DateTimeField(format="%Y/%m/%d %H:%M:%S")
    payed_at = serializers.DateTimeField(format="%Y/%m/%d %H:%M:%S")
    completed_at = serializers.DateTimeField(format="%Y/%m/%d %H:%M:%S")
    
    class Meta:
        model = Order
        fields = "__all__"
        
        
class StartPaySerializer(serializers.Serializer):
    
    order_id = serializers.CharField()
    
    address = serializers.CharField()

class TransactionAmountSerializer(serializers.Serializer):
    amount = serializers.IntegerField()
    
    
class TransactionSerializer(serializers.ModelSerializer):
    order = Orderserializer(read_only=True)
    create_at = serializers.DateTimeField(format="%Y/%m/%d %H:%M:%S")
    payed_at = serializers.DateTimeField(format="%Y/%m/%d %H:%M:%S")
    
    class Meta:
        model = Transaction
        fields = ["order","amount","status","create_at","payed_at","ref_id","id"]
        
    