import django_filters
from django.db.models import Q
from .models import Product, SaladItem


class ProductFilter(django_filters.FilterSet):
    
    
    category = django_filters.CharFilter(
        label="",
        method="filter_by_category"
    )
    
    
    def filter_by_category(self,queryset,name,value):
        if value == "همه محصولات" : 
            return queryset.all()
        return queryset.filter(Q(category__name = value))
    
    
    class Meta:
        model = Product
        fields = []
        
class ItemFilter(django_filters.FilterSet):
    
    
    category = django_filters.CharFilter(
        label="",
        method="filter_by_category"
    )
    
    
    def filter_by_category(self,queryset,name,value):
        if value == "همه آیتم ها" : 
            return queryset.all()
        return queryset.filter(Q(category__name = value))
    
    
    class Meta:
        model = SaladItem
        fields = []