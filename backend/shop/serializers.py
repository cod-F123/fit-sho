from rest_framework import serializers
from .models import (Package , Meal , ExtraOptionPackage , MealPriceWeek,
                     Product , ProductCategory, ExtraOptionProduct)

class MealPriceWeekSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPriceWeek
        fields = "__all__"

class MealSerializer(serializers.ModelSerializer):
    pricing_week = MealPriceWeekSerializer(many=True, read_only=True)
    class Meta:
        model = Meal
        fields = '__all__' 


class ExtraOptionPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraOptionPackage
        fields = "__all__"

class PackageSerializer(serializers.ModelSerializer):
    meals = MealSerializer(many=True, read_only=True)
    extra_options = ExtraOptionPackageSerializer(many=True, read_only=True)
    class Meta:
        model = Package
        fields = "__all__"


class CategoryProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = "__all__"

class ExtraOptionProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraOptionProduct
        fields = "__all__"

class ProductSerializer(serializers.ModelSerializer):
    extra_options = ExtraOptionProductSerializer(many=True, read_only=True)
    category = CategoryProductSerializer(read_only=True)
    
    class Meta:
        model = Product
        fields = "__all__"