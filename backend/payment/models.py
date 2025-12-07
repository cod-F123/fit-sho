from django.db import models
from django.utils import timezone
from accounts.models import User
from wallet.models import Wallet
from shop.models import Package, Product, MealPriceWeek, Meal, ExtraOptionPackage , ExtraOptionProduct, SaladItem
import uuid

# Create your models here.


class Order(models.Model):
    ORDER_STATUS = (
        ("payed","پرداخت شده"),
        ("pending","در انتظار پرداخت"),
        ("completed","تکمیل شده"),
        ("processing","جاری")
    )
    
    amount = models.BigIntegerField(verbose_name="مبلغ پرداختی",default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    
    status = models.CharField(max_length=13, choices=ORDER_STATUS, verbose_name="وضعیت سفارش")
    
    create_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت سفارش")
    payed_at = models.DateTimeField(blank=True,null=True, verbose_name="تاریخ پرداخت سفارش")
    completed_at = models.DateTimeField(blank=True, null=True, verbose_name="تاریخ تکمیل سفارش")
    order_id = models.CharField(max_length=255, verbose_name="شناسه سفارش", blank=True, null=True, unique=True)
    order_number = models.CharField(max_length=6, verbose_name="شماره سفارش", blank=True, null=True)
    
    
    address = models.TextField(verbose_name="آدرس",blank=True,null=True)
    
    
    class Meta:
        verbose_name = "سفارش"
        verbose_name_plural = "سفارشات"
        
    
    def save(self, *args, **kwargs):
        
        if self.order_id is None:
            self.order_id = str(uuid.uuid4()).replace("-","")[:20]
        
        if self.order_number is None:
            self.order_number = str(timezone.now().microsecond)
            
        if (self.status == "payed" or self.status == "processing") and self.payed_at is None:
            self.payed_at = timezone.now()
        
        if self.status == "completed" and self.completed_at is None : 
            self.completed_at = timezone.now()
        
        super().save(*args, **kwargs)
        
        
    def __str__(self):
        return f"{self.user.phone} - {self.order_id} -{self.amount}"
    


class OrderItem(models.Model):
    amount = models.BigIntegerField(verbose_name="مبلغ", default=0)
    order = models.ForeignKey(Order, on_delete=models.CASCADE,verbose_name="سفارش", related_name="order_items")  
    
    
    class Meta:
        abstract = True
    

class PackageOrderItem(OrderItem):
    package = models.ForeignKey(Package, on_delete=models.CASCADE)
    meal_pricing = models.ForeignKey(MealPriceWeek, on_delete=models.CASCADE)
    alergies = models.CharField(max_length=255, null=True, blank=True) 

    extra_options = models.ManyToManyField(
        ExtraOptionPackage,
        through="PackageOrderItemExtra",
        related_name="package_items",
        verbose_name="آپشن های اضافه",
    )
    
    amount = models.BigIntegerField(default=0, verbose_name="مبلغ")
    


class PackageOrderItemExtra(models.Model):
    item = models.ForeignKey(PackageOrderItem, on_delete=models.CASCADE, related_name="extra_items")
    option = models.ForeignKey(ExtraOptionPackage, on_delete=models.CASCADE) 
    
    


class ProductOrderItem(OrderItem):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    order =models.ForeignKey(Order, on_delete=models.CASCADE,related_name="product_order_items")
    quantity = models.BigIntegerField(default=0, verbose_name="تعداد")
    amount = models.BigIntegerField(verbose_name="مبلغ", default=0)
    extra_options = models.ManyToManyField(ExtraOptionProduct, through="ProductOrderItemExtra", related_name="products_items", verbose_name="آپشن های اضافه")


class ProductOrderItemExtra(models.Model):
    item = models.ForeignKey(ProductOrderItem, on_delete=models.CASCADE , related_name="extra_items")
    option = models.ForeignKey(ExtraOptionProduct, on_delete=models.CASCADE)


class SaladOrder(OrderItem):
    order = models.OneToOneField(Order, related_name="salads_order", on_delete=models.CASCADE, verbose_name="سفارش")
    items = models.ManyToManyField(SaladItem, through="SaladItemOrderItem", related_name="salad_items", verbose_name="آیتم های سالاد")

class SaladItemOrderItem(models.Model):
    salad = models.ForeignKey(SaladOrder, related_name="salad_items", on_delete=models.CASCADE)
    item = models.ForeignKey(SaladItem, verbose_name="آیتم سالاد", on_delete=models.CASCADE)
    

class WalletOrder(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name="wallet_orders")
    amount = models.BigIntegerField(default=0)
    
    STATUS = (
        ("payed","پرداخت شده"),
        ("pending", "در انتظار پرداخت")
    )
    
    transaction_token = models.CharField(verbose_name="توکن تراکنش", max_length=255, blank=True, null=True)
    


    
    
    
class Transaction(models.Model):
    STATUS = (
        ("payed","پرداخت شده"),
        ("pending", "در انتظار پرداخت")
    )
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="transaction", verbose_name="سفارش")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="کاربر")
    amount = models.BigIntegerField(verbose_name="مبلغ",default=0)
    
    status = models.CharField(max_length=13, verbose_name="وضعیت تراکنش", default="pending")
    
    create_at = models.DateTimeField(auto_now_add=True, verbose_name="تاریخ ثبت تراکنش")
    payed_at = models.DateTimeField(blank=True, null=True, verbose_name="تاریخ تکمیل تراکنش")
    
    ref_id = models.CharField(verbose_name="کد پیگیری", max_length=255,blank=True, null=True)
    transaction_token = models.CharField(verbose_name="توکن تراکنش", max_length=255, blank=True, null=True)
    
    class Meta:
        verbose_name = "تراکنش"
        verbose_name_plural = "تراکنش ها"
    
    def __str__(self):
        return f"{self.user.phone} - {self.amount}"
        
    