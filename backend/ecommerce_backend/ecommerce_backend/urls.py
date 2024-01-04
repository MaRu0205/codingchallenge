from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('product-api/', include('product.urls')),
    path('cart-api/', include('cart.urls')),
    path('customer-api/', include('customer.urls')),
]
