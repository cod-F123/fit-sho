from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import WalletSerializer
from .models import Wallet
from rest_framework import status
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class WalletUserView(APIView):
    permission_classes = [IsAuthenticated,]
    
    def get(self, request:Request, format = None):
        user_wallet = Wallet.objects.get(user = request.user)
        
        wallet_serializer = WalletSerializer(user_wallet)
        
        return Response(wallet_serializer.data, status=status.HTTP_200_OK)