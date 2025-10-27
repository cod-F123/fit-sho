from django.shortcuts import render , get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Package , Meal , Product , ProductCategory
from .serializers import PackageSerializer , ProductSerializer , CategoryProductSerializer
from .filters import ProductFilter

# Create your views here.

class GetPackages(APIView):
    def get(self, request, format= None):
        data = Package.objects.all()
        serializer = PackageSerializer(data,many=True)
        
        return Response(serializer.data)
    

class GetPackage(APIView):
    def get(self, reqeust, slug, format = None):
        data = get_object_or_404(Package, slug= slug)
        
        serializer = PackageSerializer(data)
        
        return Response(serializer.data)
    

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