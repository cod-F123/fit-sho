from django.db import models
from django.contrib.auth.models import AbstractUser , BaseUserManager , PermissionsMixin

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
    
    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = []
    
    objects = UserManager()
    
    def __str__(self):
        return self.phone