from rest_framework import serializers
from .models import Cart, CartItem
from product.serializers import SizeSerializer, ColorSerializer

class CartItemSerializer(serializers.ModelSerializer):
    size = SizeSerializer(read_only=True)
    color = ColorSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'size', 'color']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'created_at']

