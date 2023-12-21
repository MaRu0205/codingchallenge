from django.contrib import admin
from .models import Cart, CartItem

# Inline class for CartItem
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1  # How many rows to show

# Admin class for Cart
class CartAdmin(admin.ModelAdmin):
    inlines = [CartItemInline]
    list_display = ('id', 'user', 'created_at')  # Fields to display in the admin list view
    search_fields = ('user',)  # Fields to search in the admin

# Registering the Cart model with the CartAdmin
admin.site.register(Cart, CartAdmin)

# Registering the CartItem model
admin.site.register(CartItem)



