from rest_framework import serializers

class CartSerializer(serializers.Serializer):
    cart = serializers.ListField()