from django.contrib import admin
from .models import Wallet, WalletTransaction

# Register your models here.

class WalletTransactionInlineAdmin(admin.StackedInline):
    model = WalletTransaction
    extra = 1

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ["user__phone","amount","is_active","last_updated"]
    search_fields = ["user__phone",]
    list_filter = ["is_active"]
    
    inlines = [WalletTransactionInlineAdmin,]
