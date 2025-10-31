from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User ,UserOtpCode
from .serializers import UserViewSerializer , RegisterUserSerializer ,OtpSerializer
from django.utils import timezone
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserViewSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    
class RegisterUserView(APIView):
    
    def post(self, request, format=None):
        user_serializer = RegisterUserSerializer(data =request.data)
        
        if user_serializer.is_valid():
            user = user_serializer.save()
            UserOtpCode.objects.create(user= user)
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "user":user_serializer.validated_data,
                "token" : {
                    "access" : str(refresh.access_token),
                    "refresh" : str(refresh)
                }
            },status=status.HTTP_201_CREATED)
            
        
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
class ValidateUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = OtpSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"message": "کد وارد شده معتبر نیست."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            otp_obj = UserOtpCode.objects.get(user=request.user)
        except UserOtpCode.DoesNotExist:
            return Response(
                {"message": "کد تأیید برای شما ارسال نشده است."},
                status=status.HTTP_404_NOT_FOUND
            )

        if otp_obj.expire_date < timezone.now():
            otp_obj.delete()
            UserOtpCode.objects.create(user=request.user)
            return Response(
                {"message": "کد منقضی شده بود، مجدداً ارسال شد."},
                status=status.HTTP_205_RESET_CONTENT
            )

        if otp_obj.otp_code != serializer.validated_data["otp_code"]:
            return Response(
                {"message": "کد وارد شده اشتباه است."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        user.is_validate = True
        user.is_active = True
        user.save()

        otp_obj.delete()

        return Response(
            {"message": "شماره شما با موفقیت تأیید شد."},
            status=status.HTTP_200_OK
        )
    
    