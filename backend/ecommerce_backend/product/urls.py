from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, SizeViewSet, ColorViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'sizes', SizeViewSet)
router.register(r'colors', ColorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
