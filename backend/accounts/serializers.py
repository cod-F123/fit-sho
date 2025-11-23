from rest_framework import serializers
from .models import User , Profile, AddressUser
from wallet.models import Wallet


class WalletUserVewSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Wallet
        fields = ["amount","is_active","last_updated"]

class UserViewSerializer(serializers.ModelSerializer):
    wallet = WalletUserVewSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ["phone","first_name","last_name","is_validate","get_full_name","wallet"]
        

class ProfileSeializer(serializers.ModelSerializer):
    user = UserViewSerializer(read_only = True)
    
    class Meta:
        model = Profile
        fields = "__all__"
        
        
        
class UserProfileUpdate(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["is_male","height","weight","bmi","body_category"]
        
        
class RegisterUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ["phone","first_name","last_name","password","is_validate"] 
        
    
    
    def create(self, validated_data):

        user = User.objects.create(phone = validated_data["phone"] , first_name = validated_data["first_name"] , last_name= validated_data["last_name"])
        user.set_password(validated_data["password"])
        user.is_validate = False
        user.save()
        
        return user
    

class OtpSerializer(serializers.Serializer):
    otp_code = serializers.CharField(
        max_length = 6
    )
    
    
class AddAddressUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddressUser
        fields = ["title","address","zip_code"]
        
    def create(self, validated_data):
        return AddressUser.objects.create(user = self.context["user"],**validated_data)
        
        
class AddressUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddressUser
        fields = "__all__"
        
class SendResetOtpSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length = 13, min_length = 11)
    
    def validate(self, attrs):
        user = User.objects.filter(phone = attrs.get("phone")).first()
        
        if not user:
            raise serializers.ValidationError("کاربر با این شماره پیدا نشد")
        
        attrs["user"] = user 
        
        return attrs
    

class VerifyResetOtpSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length = 13, min_length = 11)
    code = serializers.CharField(max_length = 6)
    
    def validate(self, attrs):
        user = User.objects.filter(phone = attrs.get("phone")).first()
        
        if not user :
            raise serializers.ValidationError("کاربری با این شماره پیدا نشد")
        
        attrs["user"] = user
        
        return attrs


class ResetPasswordSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length = 13, min_length = 11)
    new_password = serializers.CharField(max_length = 20)
    
    
    def validate(self, attrs):
        user = User.objects.filter(phone = attrs.get("phone")).first()
        
        if not user :
            raise serializers.ValidationError("کاربری با این شماره پیدا نشد")
        
        attrs["user"] = user
        
        return attrs    