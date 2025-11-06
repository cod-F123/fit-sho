from django.contrib import admin
from .models import (Category , Package , Meal , ExtraOptionPackage , MealPriceWeek,
                     Product, ProductCategory , ExtraOptionProduct, Comment) 

# Register your models here.


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name"]


class MealAdminInline(admin.StackedInline):
    model = Meal
    extra = 1
    

class ExtraOptionAdminInline(admin.StackedInline):
    model = ExtraOptionPackage
    extra = 1


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ['name',]
    inlines = [MealAdminInline, ExtraOptionAdminInline]
    

class MealPricingWeekAdminInline(admin.StackedInline):
    model = MealPriceWeek
    extra = 1
    
@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ["package__name","meal_type"]
    
    inlines = [MealPricingWeekAdminInline,]
    

@admin.register(ProductCategory)
class ProductCategory(admin.ModelAdmin):
    search_fields = ["name"]


class ExtraOptionProductAdminInline(admin.StackedInline):
    verbose_name = "آپشن اضافه"
    verbose_name_plural = "آپشن های اضافه"
    model = ExtraOptionProduct
    extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "calories","category__name","price","is_exist"]
    search_fields = ["name","category__name"]
    list_filter = ["category__name","is_exist"]
    
    inlines = [ExtraOptionProductAdminInline]

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ["object_id","author__phone","content_type"]
    search_fields = ["object_id","author__phone",]