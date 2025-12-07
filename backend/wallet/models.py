from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.db import transaction
import uuid


# Create your models here.

User = get_user_model()

class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="wallet", verbose_name="کاربر")
    amount = models.PositiveBigIntegerField(verbose_name="اعتبار(تومان)", default=0)
    is_active = models.BooleanField(default=True,verbose_name="فعال")
    last_updated = models.DateTimeField(auto_now=True, verbose_name="آخرین بروزرسانی")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ایجاد")
    
    def __str__(self):
        return f"کیف پول {self.user.phone} - {self.amount:,}"
    
    class Meta:
        verbose_name = "کیف پول"
        verbose_name_plural = "کیف پول ها"
        
        
def create_wallet(sender, instance, created, **kwargs):
    if created : 
        user_wallet = Wallet(user= instance)
        user_wallet.save()
        
post_save.connect(create_wallet, sender=User)
        
        
class WalletTransaction(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="transactions")
    amount = models.BigIntegerField(verbose_name="مبلغ تراکنش(تومان)")
    transaction_type = models.CharField(verbose_name="نوع تراکنش", max_length=10, choices=(("deposit", "واریز"), ("withdraw", "برداشت")))
    description = models.CharField(max_length=255, blank=True, null=True, verbose_name="توضیحات")
    ref_id = models.CharField(max_length=255,unique=True,blank=True,null=True,verbose_name="کد پیگیری تراکنش")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ تراکنش")
    
    def save(self, *args, **kwargs):
        
        if self.ref_id is None:
            
            self.ref_id = str(uuid.uuid4()).replace("-", "")

        super().save(*args, **kwargs)
        
        
    def __str__(self):
        return f"تراکنش {self.ref_id[:8]}... - {self.amount:,} تومان"
    
    
    class Meta:
        verbose_name = "تراکنش کیف پول"
        verbose_name_plural = "تراکنش های کیف پول"
        ordering = ["-created_at"]

    
def update_wallet(sender, instance, created, **kwargs):
    if created :
        
        with transaction.atomic():
                
            if instance.transaction_type == "deposit":
                instance.wallet.amount += instance.amount
                instance.wallet.save()

            
            elif instance.transaction_type == "withdraw":
                if instance.wallet.amount >= instance.amount:
                    instance.wallet.amount -= instance.amount
                    instance.wallet.save()
                else:
                    instance.description = (instance.description or "") + " (تراکنش ناموفق: موجودی کافی نیست)"
                    instance.amount = 0  
        
post_save.connect(update_wallet, sender=WalletTransaction)