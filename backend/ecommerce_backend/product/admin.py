from django.contrib import admin
from .models import Product, Size, Color, Article

class SizeAdmin(admin.ModelAdmin):
    list_display = ['size']

class ColorAdmin(admin.ModelAdmin):
    list_display = ['color']

class ArticleInline(admin.TabularInline):
    model = Article
    extra = 0

class ProductAdmin(admin.ModelAdmin):
    list_display = ['title']
    inlines = [ArticleInline]

admin.site.register(Size, SizeAdmin)
admin.site.register(Color, ColorAdmin)
admin.site.register(Product, ProductAdmin)