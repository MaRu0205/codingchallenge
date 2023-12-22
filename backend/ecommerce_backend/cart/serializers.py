from rest_framework import serializers
from .models import Cart, CartItem
from product.models import Product, Size, Color

class CartItemSerializer(serializers.ModelSerializer):
    cart = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all())
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    size = serializers.PrimaryKeyRelatedField(queryset=Size.objects.all(), allow_null=True)
    color = serializers.PrimaryKeyRelatedField(queryset=Color.objects.all(), allow_null=True)

    class Meta:
        model = CartItem
        fields = ['id','cart', 'product', 'quantity', 'size', 'color']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, required=False)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'status', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        cart = Cart.objects.create(**validated_data)
        for item_data in items_data:
            CartItem.objects.create(cart=cart, **item_data)
        return cart

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)

        if items_data is not None:
            existing_item_ids = [item.id for item in instance.items.all()]
            updated_item_ids = []

            for item_data in items_data:
                item_id = item_data.get('id', None)
                item_data.pop('cart', None)  # Remove 'cart' key if it exists

                if item_id and item_id in existing_item_ids:
                    # Update the existing item
                    cart_item = CartItem.objects.get(id=item_id, cart=instance)
                    for key, value in item_data.items():
                        setattr(cart_item, key, value)
                    cart_item.save()
                    updated_item_ids.append(item_id)
                elif not item_id:
                    # Create a new item
                    CartItem.objects.create(cart=instance, **item_data)

            # Remove any items not in the updated data
            for item_id in set(existing_item_ids) - set(updated_item_ids):
                CartItem.objects.get(id=item_id, cart=instance).delete()

        # Update other fields of the cart
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance




