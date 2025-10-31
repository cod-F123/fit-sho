from django.db import models
from django.contrib.auth.models import AbstractUser , BaseUserManager , PermissionsMixin
from django.utils import timezone
from datetime import timedelta

# Create your models here.


class UserManager(BaseUserManager):
    
    def create_user(self,phone,password=None,**extra_fields):
        
        if phone is None:
            raise ValueError("شماره تلفن الزامی میباشد")
        
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        
        return user 
    
    def create_superuser(self,phone,password=None,**extra_fields):
        extra_fields.setdefault("is_staff",True)
        extra_fields.setdefault("is_superuser",True)
        
        if extra_fields.get("is_staff") is not True:
            raise ValueError("is_staff باید True شود")
        
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("is_superuser باید Trur شود")
        
        return self.create_user(phone=phone,password=password, **extra_fields)
        

class User(AbstractUser):
    username = ""
    phone = models.CharField(max_length=13 , unique= True, verbose_name="شماره تلفن")
    is_validate = models.BooleanField(default=False)
    
    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = []
    
    objects = UserManager()
    
    def __str__(self):
        return self.phone
    
    
class UserOtpCode(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6 , blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    expire_date = models.DateTimeField(blank=True,null=True)
    
    def save(self, *args, **kwargs):
        
        if self.otp_code is None:
            ran_num = timezone.now().microsecond
            expire_date = timezone.now() + timedelta(minutes=2)
            
            self.otp_code = ran_num
            self.expire_date = expire_date
            
        
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name_plural = "کد های تائید"
        verbose_name = "کد تائید"