from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User ,UserOtpCode , Profile
from .serializers import UserViewSerializer , RegisterUserSerializer ,OtpSerializer , ProfileSeializer , UserProfileUpdate
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
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if otp_obj.attemps > 5:
            
            return Response({"message": "تعداد تلاش شما بیش از حد مجاز بود. لطفاً دقایقی دیگر مجدد تلاش کنید"}, status=status.HTTP_403_FORBIDDEN)

        if otp_obj.otp_code != serializer.validated_data["otp_code"]:
            
            otp_obj.attemps = otp_obj.attemps + 1
            otp_obj.save()
            
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
    
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, reqeust, format=None):
        user_profile = Profile.objects.get(user=reqeust.user)
    
        profile_seializer = ProfileSeializer(user_profile)
        
        return Response(profile_seializer.data)
    
    def post(self, request, format=None):
        user_profile = Profile.objects.get(user=request.user)
        
        user_serializer = UserProfileUpdate(instance = user_profile, data=request.data)
        
        if user_serializer.is_valid():
            updated_profile = user_serializer.save()
            try:
                user_profile.bmi = round((user_profile.weight / (user_profile.height / 100)**2),2)
            except:
                user_profile.bmi = 0
                        
            profile_srializer = ProfileSeializer(updated_profile)
            
            return Response(profile_srializer.data,status=status.HTTP_200_OK)
        
        else:
            return Response(user_serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    