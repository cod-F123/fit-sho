from rest_framework import serializers
from . models import Wallet , WalletTransaction

class TransactionWalletSrializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y/%m/%d %H:%M:%S")
    class Meta:
        model = WalletTransaction
        fields = "__all__"

class WalletSerializer(serializers.ModelSerializer):
    
    transactions = TransactionWalletSrializer(many=True, read_only=True)
    
    class Meta:
        model = Wallet
        fields = "__all__"