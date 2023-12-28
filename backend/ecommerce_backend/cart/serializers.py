from rest_framework import serializers
from .models import Cart, CartItem
from product.models import Article  # Import Article


class CartItemSerializer(serializers.ModelSerializer):
    cart = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all())
    article = serializers.PrimaryKeyRelatedField(queryset=Article.objects.all())
    size = serializers.CharField(required=False, allow_blank=True, max_length=10)  # Optional
    color = serializers.CharField(required=False, allow_blank=True, max_length=20)  # Optional
    gtin = serializers.CharField(required=False, allow_blank=True, max_length=14)  # Optional
    name = serializers.CharField(required=False, allow_blank=True, max_length=255)  # Optional
    image = serializers.ImageField(required=False)  # Optional
    price = serializers.DecimalField(required=False, max_digits=6, decimal_places=2)  # Optional

    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'article', 'quantity', 'size', 'color', 'gtin', 'name', 'image', 'price']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['size'] = instance.article.size.size if instance.article.size else None
        representation['color'] = instance.article.color.color if instance.article.color else None
        representation['gtin'] = instance.article.gtin
        representation['name'] = instance.article.name
        representation['image'] = instance.article.image
        representation['price'] = instance.article.price
        return representation

class CartSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True)
    items = CartItemSerializer(many=True, required=False)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'status', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        cart = Cart.objects.create(**validated_data)
        for item_data in items_data:
            item_data.pop('size', None)
            item_data.pop('color', None)
            item_data.pop('gtin', None)
            item_data.pop('name', None)
            item_data.pop('image', None)
            item_data.pop('price', None)
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