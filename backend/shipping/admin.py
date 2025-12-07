from django.contrib import admin
from .models import ShipmentDay , ShipmentOrder

# Register your models here.

class ShipmentDayInlineAdmin(admin.StackedInline):
    model = ShipmentDay
    extra = 0

@admin.register(ShipmentOrder)
class ShipmentOrderAdmin(admin.ModelAdmin):
    list_display = ["total_days","start_date"]
    inlines = [ShipmentDayInlineAdmin,]

@admin.register(ShipmentDay)
class ShipmentDayAdmin(admin.ModelAdmin):
    list_display = ["status","date"]
    list_filter = ["status"]
