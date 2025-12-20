from django.shortcuts import render , get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import ShipmentOrderSerialzier
from .models import ShipmentOrder

# Create your views here.

class ShipmentOrderView(APIView):
    permission_classes = [IsAuthenticated,]
    
    def get(self, request, orderItemId , format= None):
        shipment_order = get_object_or_404(ShipmentOrder, package_items__id = orderItemId, package_items__order__user = request.user)
        
        serializer = ShipmentOrderSerialzier(shipment_order)
        
        return Response(serializer.data, status=status.HTTP_200_OK)