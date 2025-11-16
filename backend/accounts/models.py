from django.db import models
from django.contrib.auth.models import AbstractUser , BaseUserManager , PermissionsMixin
from django.db.models.signals import post_save
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal , InvalidOperation

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
    
    attemps = models.PositiveIntegerField(default=0)
    
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
        
        
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    is_male = models.BooleanField(default=True)
    height = models.DecimalField(verbose_name="قد (cm)", max_digits=3, decimal_places=0, default=0)
    weight = models.DecimalField(verbose_name="وزن (kg)", max_digits=5, decimal_places=2,default=0)
    bmi = models.DecimalField(verbose_name="BMI", max_digits=4, decimal_places=2, blank=True,null=True)
    body_category = models.CharField(verbose_name="دسته بدنی",max_length=100, blank=True, null=True , default="نامشخص")
    
    def __str__(self):
        return self.user.phone

    def save(self, *args, **kwargs):
        """محاسبه خودکار BMI قبل از ذخیره"""
        try:
            height_m = Decimal(str(self.height)) / Decimal("100")
            if height_m > 0:
                bmi = Decimal(str(self.weight)) / (height_m ** 2)
                self.bmi = bmi.quantize(Decimal("0.01"))
                self.body_category = self.get_body_category(self.bmi)
            else:
                self.bmi = Decimal("0.00")
                self.body_category = "نامشخص"
        except (InvalidOperation, ZeroDivisionError):
            self.bmi = Decimal("0.00")
            self.body_category = "نامشخص"

        super().save(*args, **kwargs)

    def get_body_category(self, bmi):
        """بر اساس مقدار BMI دسته بدنی تعیین می‌شود"""
        bmi = float(bmi)
        if bmi < 18.5:
            return "کم‌وزن"
        elif 18.5 <= bmi < 25:
            return "نرمال"
        elif 25 <= bmi < 30:
            return "اضافه وزن"
        elif 30 <= bmi < 35:
            return "چاقی درجه ۱"
        elif 35 <= bmi < 40:
            return "چاقی درجه ۲"
        else:
            return "چاقی مفرط"
    
    class Meta:
        verbose_name = "پروفایل"
        verbose_name_plural = "پروفایل ها"
    
    
def create_profile_user(sender, instance, created, **kwargs):
    if created :
        user_profile = Profile(user=instance)
        user_profile.save()
        
post_save.connect(create_profile_user, sender=User)



class AddressUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    
    title = models.CharField(max_length=255, verbose_name="عنوان")
    address = models.TextField(verbose_name="آدرس")
    zip_code = models.CharField(max_length=10 , verbose_name="کد پستی")
    
    class Meta:
        verbose_name = "آدرس"
        verbose_name_plural = "آدرس ها"
    
    def __str__(self):
        return f"{self.user} - {self.title}"
    