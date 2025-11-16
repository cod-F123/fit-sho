from django.contrib import admin
from .models import User , UserOtpCode , Profile, AddressUser
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _

# Register your models here.


class ProfileUserAdminInline(admin.StackedInline):
    model = Profile
    extra = 1
    
class UserAddressAdminInline(admin.StackedInline):
    model = AddressUser
    extra = 1

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (None, {"fields": ("phone", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_validate",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("phone","usable_password", "password1", "password2"),
            },
        ),
    )
    
    list_display = ("phone", "first_name", "last_name", "is_staff","id")
    list_filter = ("is_staff", "is_superuser", "is_active", "groups")
    search_fields = ("first_name", "last_name", "phone")
    ordering = ("phone",)
    filter_horizontal = (
        "groups",
        "user_permissions",
    )
    inlines = [ProfileUserAdminInline,UserAddressAdminInline]
    
admin.site.register(UserOtpCode)

@admin.register(Profile)
class ProfileUserAdmin(admin.ModelAdmin):
    list_display = ["user__phone","is_male"]
    list_filter = ["is_male"]
    
    search_fields = ["user__phone","user__first_name","user__last_name"]
    
@admin.register(AddressUser)
class AddressUserAdmin(admin.ModelAdmin):
    list_display = ["user__phone","title","zip_code"]
    search_fields = ["user__phone","zip_code"]
    
    