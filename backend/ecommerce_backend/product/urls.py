from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, SizeViewSet, ColorViewSet, ArticleViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'sizes', SizeViewSet)
router.register(r'colors', ColorViewSet)
router.register(r'articles', ArticleViewSet)  # Register ArticleViewSet

urlpatterns = [
    path('', include(router.urls)),
]