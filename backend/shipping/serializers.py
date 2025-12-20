from rest_framework import serializers
from .models import ShipmentDay , ShipmentOrder
from payment.serializers import PackageOrderItemSerializer


class ShipmentDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = ShipmentDay
        fields = "__all__"
    

class ShipmentOrderSerialzier(serializers.ModelSerializer):
    days = ShipmentDaySerializer(many=True, read_only=True)
    package_items = PackageOrderItemSerializer(read_only=True)
    
    class Meta:
        model = ShipmentOrder
        fields = "__all__"