from django.shortcuts import render , get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework. permissions import IsAuthenticatedOrReadOnly
from .models import Package , Meal , Product , ProductCategory , Comment, SaladItemCategory , SaladItem
from .serializers import (PackageSerializer , ProductSerializer , CategoryProductSerializer , CommentSerializer,SaladItemCategorySerializer, SaladItemSerializer)
from .filters import ProductFilter , ItemFilter
from django.contrib.contenttypes.models import ContentType
from rest_framework import status
# Create your views here.

class GetPackages(APIView):
    def get(self, request, format= None):
        data = Package.objects.all()
        serializer = PackageSerializer(data,many=True)
        
        return Response(serializer.data)
    

class GetPackage(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly,]
    def get(self, reqeust, slug, format = None):
        data = get_object_or_404(Package, slug= slug)
        
        serializer = PackageSerializer(data)
        
        return Response(serializer.data)
    
    def post(self, request, slug, format=None):
        
        package = get_object_or_404(Package, slug=slug)
        content_comment = request.data.get("comment_content",None)
        
        if content_comment is not None:
            new_comment = Comment.objects.create(
                author = request.user,
                content = content_comment,
                content_type = ContentType.objects.get_for_model(Package),
                object_id = package.id
            )
            
            serializer = PackageSerializer(instance=package)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)
        
    

class GetProductsAndCategories(APIView):
    def get(self, request, format=None):

        category_data = ProductCategory.objects.all()
        category_serializer = CategoryProductSerializer(category_data, many=True)
                
        product_filter = ProductFilter(request.GET, queryset=Product.objects.all())
        filtered_products = product_filter.qs
        product_serializer = ProductSerializer(filtered_products, many=True)
        
        return Response(data={
            "products":product_serializer.data,
            "categories" : category_serializer.data
        })
        

class GetProduct(APIView):
    def get(self, request, slug, format=None):
        product = get_object_or_404(Product, slug=slug)
                
        serializer = ProductSerializer(product)
        
        return Response(serializer.data)
    
    def post(self, request, slug, format=None):

        product = get_object_or_404(Product, slug=slug)
        content_comment = request.data.get("comment_content",None)
    
        
        if content_comment is not None:
            new_comment = Comment.objects.create(
                author = request.user,
                content = content_comment,
                content_type = ContentType.objects.get_for_model(Product),
                object_id = product.id
            )
            
            serializer = ProductSerializer(instance = product)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response({"message":"comment content required"},status=status.HTTP_400_BAD_REQUEST)
    

class GetSaladItems(APIView):
    
    def get(self, request, format= None):
        salad_item_categories = SaladItemCategory.objects.all()
        
        category_serializer = SaladItemCategorySerializer(salad_item_categories, many=True)
        
        salad_items = SaladItem.objects.all()
        
        salad_item_filter = ItemFilter(request.GET,queryset=salad_items)
        
        items_serializer = SaladItemSerializer(salad_item_filter.qs, many=True)
        
        return Response({"categories":category_serializer.data,"items":items_serializer.data}, status = status.HTTP_200_OK)