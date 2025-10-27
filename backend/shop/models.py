from django.db import models
from django.utils import timezone
import random
from ckeditor_uploader.fields import RichTextUploadingField


# Create your models here.

class Category(models.Model):
    name= models.CharField(max_length=110)
    
    def __str__(self):
        return self.name



def generate_char(length=10):
    
    char = "ABSDEFGHIJKLMNOPQRSTUVWXYZ"
    result = ""
    
    for i in range(0,length):
        result += char[random.randint(0, len(char)-1)]
    
    return result

class Package(models.Model):
    
    name = models.CharField(verbose_name="اسم بسته",max_length=100)
    category = models.ForeignKey(to=Category,verbose_name="دسته بندی" , on_delete= models.CASCADE)
    image = models.ImageField(upload_to="uploads/packages")
    
    add_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True , verbose_name="آخرین آپدیت")
    slug = models.CharField(max_length=255,blank=True , null= True, unique=True)
    
    feature = RichTextUploadingField(verbose_name="ویژگی های بسته")
    
    important_note = models.TextField(verbose_name="توضیحات مهم قبل از خرید",blank=True)
    package_info = models.TextField(verbose_name="اطلاعات بسته",blank=True)
    composition = models.TextField(
        verbose_name="ترکیبات و جزئیات بسته",
        blank=True,
        help_text="توضیح درباره‌ی مواد تشکیل‌دهنده، نوع غذاها، و اهداف سلامتی بسته")
    
    
    def save(self, *args, **kwargs):
        
        if self.slug is None:
            ran_num = timezone.now().microsecond
            self.slug = f"{generate_char()}{ran_num}"
            
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.category.name} - {self.name}"
    
    
    

class Meal(models.Model):
    
    MEAL_TYPE = (
        ("تک وعده (نهار)","تک وعده (نهار)"),
        ("دو وعده (نهار و شام)","دو وعده (نهار و شام)")
    )
    
    package = models.ForeignKey(Package, on_delete=models.CASCADE, verbose_name="بسته مورد نظر",related_name='meals')
    meal_type = models.CharField(max_length=23, choices=MEAL_TYPE, default="تک وعده (نهار)", verbose_name="نوع وعده")
    
    calories = models.CharField(max_length=10,verbose_name="کالری (kcal)", null=True, blank=True)
    carbs = models.CharField(max_length=10, verbose_name="کربوهیدرات (گرم)", null=True, blank=True)
    protein = models.CharField(max_length=10, verbose_name="پروتئین (گرم)", null=True, blank=True)
    fat = models.CharField(max_length=10, verbose_name="چربی (گرم)", null=True, blank=True)
    fiber = models.CharField(max_length=10, verbose_name="فیبر (گرم)", null=True, blank=True)
    
    
    def __str__(self):
        return self.package.name


class ExtraOptionPackage(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name="extra_options",verbose_name="بسته مورد نظر")
    
    option = models.CharField(max_length=100 , verbose_name="آپشن")
    
    description = models.CharField(max_length=150 , blank=True, verbose_name="توضیحات")
    
    exist_in_package = models.BooleanField(default=False,verbose_name="آپشن در بسته وجود دارد")
    price = models.DecimalField(verbose_name="قیمت", decimal_places=0, max_digits=12)
    
    def __str__(self):
        return self.option
    

class MealPriceWeek(models.Model):
    meal = models.ForeignKey(Meal,on_delete=models.CASCADE, related_name="pricing_week")
    week_duration = models.IntegerField(default=1,verbose_name="تعداد هفته")
    price = models.DecimalField(verbose_name="قیمت", decimal_places=0, max_digits=12)
    
    def __str__(self):
        return self.meal.meal_type
    


class ProductCategory(models.Model):
    name = models.CharField(max_length=200)
    
    def __str__(self):
        return self.name

    
class Product(models.Model):
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=255)
    
    image = models.ImageField(upload_to="uploads/products")
    
    
    
    
    ingredients = models.TextField(verbose_name="محتویات")
    contraindications = models.TextField(verbose_name="موارد منع مصرف", blank=True, null=True)
    indications = models.TextField(verbose_name="موارد مصرف", blank=True, null=True)
    
    calories = models.CharField(max_length=10,verbose_name="کالری (kcal)", null=True, blank=True)
    carbs = models.CharField(max_length=10, verbose_name="کربوهیدرات (گرم)", null=True, blank=True)
    protein = models.CharField(max_length=10, verbose_name="پروتئین (گرم)", null=True, blank=True)
    fat = models.CharField(max_length=10, verbose_name="چربی (گرم)", null=True, blank=True)
    fiber = models.CharField(max_length=10, verbose_name="فیبر (گرم)", null=True, blank=True)
    
    is_exist = models.BooleanField(default=True)
    slug = models.CharField(max_length=255, blank=True, null=True , unique=True)
    
    price = models.DecimalField(verbose_name="قیمت", decimal_places=0, max_digits=12)
    
    
    def save(self, *args, **kwargs):
        
        if self.slug is None:
            ran_num = timezone.now().microsecond
            self.slug = f"{generate_char(10)}{ran_num}"
        
        
        super().save(*args , **kwargs)
    
    def __str__(self):
        return f"{self.name} - {self.calories} - {self.category.name}"
    


class ExtraOptionProduct(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE , related_name="extra_options")
    option = models.CharField(max_length=100 , verbose_name="آپشن")
    
    description = models.CharField(max_length=150 , blank=True, verbose_name="توضیحات")
    
    exist_in_package = models.BooleanField(default=False,verbose_name="آپشن در محصول وجود دارد")
    price = models.DecimalField(verbose_name="قیمت", decimal_places=0, max_digits=12)
    
    def __str__(self):
        return self.option
    

    