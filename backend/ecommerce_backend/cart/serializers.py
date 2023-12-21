from rest_framework import serializers
from .models import Cart, CartItem
from product.models import Product, Size, Color

class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    size = serializers.PrimaryKeyRelatedField(queryset=Size.objects.all(), allow_null=True)
    color = serializers.PrimaryKeyRelatedField(queryset=Color.objects.all(), allow_null=True)

    class Meta:
        model = CartItem
        fields = ['product', 'quantity', 'size', 'color']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ['id', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        cart = Cart.objects.create(**validated_data)
        for item_data in items_data:
            CartItem.objects.create(cart=cart, **item_data)
        return cart

