from django.contrib import admin
from .models import Product, Size, Color

class SizeAdmin(admin.ModelAdmin):
    list_display = ['size']

class ColorAdmin(admin.ModelAdmin):
    list_display = ['color']

class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'price']
    filter_horizontal = ['available_sizes', 'available_colors']

admin.site.register(Size, SizeAdmin)
admin.site.register(Color, ColorAdmin)
admin.site.register(Product, ProductAdmin)

