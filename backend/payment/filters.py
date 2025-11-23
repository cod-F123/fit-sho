import django_filters
from .models import Order
from django.db.models import Q

class OrderFilter(django_filters.FilterSet):
    f_status = django_filters.CharFilter(
        method="filter_by_status"
    )
    
    def filter_by_status(self,queryset,name,value):
        return queryset.filter(status = value , user = self.request.user)
    
    class Meta:
        model = Order
        fields = []