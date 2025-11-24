from django.shortcuts import render ,get_object_or_404
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User ,UserOtpCode , Profile, AddressUser , ResetPasswordOtp
from .serializers import (UserViewSerializer , RegisterUserSerializer ,OtpSerializer , 
                          ProfileSeializer , UserProfileUpdate,
                          AddressUserSerializer,
                          AddAddressUserSerializer,
                          SendResetOtpSerializer, VerifyResetOtpSerializer, ResetPasswordSerializer
                          )
from django.utils import timezone
from rest_framework import status
from django.contrib.auth.hashers import make_password

from rest_framework_simplejwt.tokens import RefreshToken
from .utils import send_message

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
            otp = UserOtpCode.objects.create(user= user)
            
            refresh = RefreshToken.for_user(user)
             
            res = send_message(user.phone,f'کد تائید : {otp.otp_code} \n fit-bama \n لغو11 ')
            
            if res.get("status") == "ارسال موفق بود":
                
            
            
                return Response({
                    "user":UserViewSerializer(instance=user).data,
                    "token" : {
                        "access" : str(refresh.access_token),
                        "refresh" : str(refresh)
                    }
                },status=status.HTTP_201_CREATED)
            else:
                User.objects.get(phone = user.phone).delete()
                return Response(status=status.HTTP_400_BAD_REQUEST)
            
        
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
            new_otp = UserOtpCode.objects.create(user=request.user)
            try:
                send_message(otp_obj.user.phone,f'کد تائید : {new_otp.otp_code} \n fit-bama \n لغو11 ')
            except:
                pass
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
            {"user":UserViewSerializer(instance=user).data,"message": "شماره شما با موفقیت تأیید شد."},
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
        

class UserAddressesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        user_address = AddressUser.objects.filter(user__phone = request.user.phone)
        
        addresses_serializer = AddressUserSerializer(user_address, many=True)
        
        return Response(addresses_serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, format=None):
        user_address_serializer = AddAddressUserSerializer(data=request.data,context={"user":request.user})
        
        if user_address_serializer.is_valid():
            user_address = user_address_serializer.save()
            
            return Response(AddressUserSerializer(user_address).data,status=status.HTTP_200_OK)
        
        else:
            return Response(user_address_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, format=None):
        try:
            address = get_object_or_404(AddressUser, id=request.data["address_id"], user = request.user)
            
            
            address.delete()
            
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
            
            
            
class SendResetOtpView(APIView):
    
    def post(self, request, format = None):
        
        serializer = SendResetOtpSerializer(data=request.data)
        
        if serializer.is_valid():
            
            last_reset_otp = ResetPasswordOtp.objects.filter(phone = serializer.validated_data["phone"], is_used=False).first()
            
            if last_reset_otp and last_reset_otp.expired_at > timezone.now():
                return Response({"message":"کد ارسال شد"}, status=status.HTTP_200_OK)
            
            if last_reset_otp:
                last_reset_otp.delete()
            
            new_reset_otp = ResetPasswordOtp.objects.create(phone = serializer.validated_data["phone"])
            
            try:
                send_message(new_reset_otp.phone,f'کد تائید : {new_reset_otp.code} \n fit-bama \n لغو11 ')
            except:
                pass
            
            return Response({"message":"کد ارسال شد"},status=status.HTTP_200_OK)
        
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class VerifyResetOtpView(APIView):
    def post(self, request, format=None):
        
        serializer = VerifyResetOtpSerializer(data= request.data)
        
        if serializer.is_valid():
            
            phone = serializer.validated_data["phone"]
            
            reset_otp = ResetPasswordOtp.objects.filter(phone = phone, code = serializer.validated_data["code"], is_used = False).first()
            
            if reset_otp is None:
                return Response({"message":"کد اشتباه است"}, status=status.HTTP_400_BAD_REQUEST)
            
            if reset_otp.expired_at < timezone.now():
                return Response({"message":"کد منقضی شده"}, status=400)
            
            reset_otp.is_used = True
            reset_otp.save()

            return Response({"message":"کد تایید شد"}, status=200)
            
            
        
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
                
class ResetPasswordView(APIView):
    def post(self, request, format=None):
        
        serializer = ResetPasswordSerializer(data = request.data)
        
        if serializer.is_valid():
            phone = serializer.validated_data["phone"]
            new_password = serializer.validated_data["new_password"]
            
            reset_otp = ResetPasswordOtp.objects.filter(phone = phone, is_used = True).order_by("-created_at").first()
            
            if reset_otp is None or reset_otp.expired_at < timezone.now():
                return Response({"message": "کد تایید معتبر نیست"}, status=400)
            
            user = User.objects.get(phone = phone)
            user.password = make_password(new_password)
            user.save()
            
            reset_otp.delete()
            
            return Response({"message":"رمز تغییر کرد"}, status=status.HTTP_200_OK)
            
               
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)          
        