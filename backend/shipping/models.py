from django.db import models
from payment.models import PackageOrderItem

# Create your models here.

class ShipmentOrder(models.Model):
    package_items = models.OneToOneField(
        PackageOrderItem,
        on_delete=models.CASCADE,
        related_name="shipment"
                                         )
    
    total_days = models.PositiveBigIntegerField(verbose_name="تعداد روز")
    start_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Shipment for Package #{self.package_items.id}"

class ShipmentDay(models.Model):
    STATUS_CHOICES = [
        ("pending", "در انتظار ارسال"),
        ("delivering", "در حال ارسال"),
        ("delivered", "تحویل شده"),
        ("failed", "ناموفق"),
    ]

    shipment = models.ForeignKey(
        ShipmentOrder,
        on_delete=models.CASCADE,
        related_name="days"
    )
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    tracking_code = models.CharField(max_length=100, null=True, blank=True)
    
    def __str__(self):
        return f"{self.date} → {self.status}"
