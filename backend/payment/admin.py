from django.contrib import admin
from .models import (Order, SaladOrder, SaladItemOrderItem, PackageOrderItem , PackageOrderItemExtra, ProductOrderItem, ProductOrderItemExtra,Transaction)

# Register your models here.

class SaladItemOrderItemAdmin(admin.TabularInline):
    model = SaladItemOrderItem
    extra = 0
    
class SaladOrderInline(admin.TabularInline):
    model = SaladOrder
    extra = 0
    readonly_fields = ("amount",)
    show_change_link = True

class PackageOrderItemExtraInline(admin.TabularInline):
    model = PackageOrderItemExtra
    extra = 0
    
class PackageOrderItemInline(admin.TabularInline):
    model = PackageOrderItem
    extra = 0
    readonly_fields = ("amount",)
    show_change_link = True


class ProductOrderItemExtraInline(admin.TabularInline):
    model = ProductOrderItemExtra
    extra = 0

class ProsuctOrderItemInline(admin.TabularInline):
    model = ProductOrderItem
    extra = 0
    readonly_fields = ("amount",)
    show_change_link = True
    
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("order_id", "user", "amount", "status", "create_at","order_number")
    list_filter = ("status", "create_at")
    search_fields = ("order_id", "user__phone","order_number")
    readonly_fields = ("order_id", "create_at", "payed_at", "completed_at")

    inlines = [
        PackageOrderItemInline,
        ProsuctOrderItemInline,
        SaladOrderInline
    ]
    
@admin.register(SaladOrder)
class SaladOrderAdmoin(admin.ModelAdmin):
    list_display = ("id","order","amount")  
    inlines = [SaladItemOrderItemAdmin]

@admin.register(PackageOrderItem)
class PackageOrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "package", "meal_pricing", "amount")
    inlines = [PackageOrderItemExtraInline]
    
@admin.register(ProductOrderItem)
class ProductOrderItemAdmin(admin.ModelAdmin):
    list_display = (("id", "order", "product", "amount"))
    inlines = [ProductOrderItemExtraInline]

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "user", "amount", "status", "create_at")
    search_fields = ("order__order_id", "user__phone", "ref_id")
    list_filter = ("status",)
    readonly_fields = ("create_at", "payed_at")

