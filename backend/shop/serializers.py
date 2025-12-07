from rest_framework import serializers
from .models import (Package , Meal , ExtraOptionPackage , MealPriceWeek,
                     Product , ProductCategory, ExtraOptionProduct, Comment,
                     SaladItem, SaladItemCategory)

from accounts.models import User

class UserViewSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User 
        fields = ["first_name","last_name"]

class CommentSerializer(serializers.ModelSerializer):
    author = UserViewSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = "__all__"

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
    comments = CommentSerializer(many=True, read_only=True)
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
    comments = CommentSerializer(many=True, read_only=True)

    
    class Meta:
        model = Product
        fields = "__all__"
        
class SaladItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = SaladItem
        fields = "__all__"
        
    
class SaladItemCategorySerializer(serializers.ModelSerializer):    
    class Meta:
        model = SaladItemCategory
        fields = "__all__"