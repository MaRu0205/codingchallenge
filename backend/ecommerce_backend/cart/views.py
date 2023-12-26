from rest_framework import viewsets
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from django_filters.rest_framework import DjangoFilterBackend

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    filter_backends = [DjangoFilterBackend]  # Add the Django Filter backend
    filterset_fields = ['status']  # Define the fields you want to filter on

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer