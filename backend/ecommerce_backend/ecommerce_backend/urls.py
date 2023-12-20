from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('product-api/', include('product.urls')),  # This line includes the product app's URLs
    path('cart-api/', include('cart.urls')),  # This line includes the cart app's URLs
]
