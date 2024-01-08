from rest_framework import serializers
from .models import Cart, CartItem
from product.models import Article  # Import Article


class CartItemSerializer(serializers.ModelSerializer):
    cart = serializers.PrimaryKeyRelatedField(queryset=Cart.objects.all()) # mandatory
    article = serializers.PrimaryKeyRelatedField(queryset=Article.objects.all()) # mandatory
    size = serializers.CharField(required=False, allow_blank=True, max_length=10)  # Optional
    color = serializers.CharField(required=False, allow_blank=True, max_length=20)  # Optional
    gtin = serializers.CharField(required=False, allow_blank=True, max_length=14)  # Optional
    name = serializers.CharField(required=False, allow_blank=True, max_length=255)  # Optional
    image = serializers.ImageField(required=False)  # Optional
    price = serializers.DecimalField(required=False, max_digits=6, decimal_places=2)  # Optional

    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'article', 'quantity', 'size', 'color', 'gtin', 'name', 'image', 'price']
        extra_kwargs = {
            'image': {'read_only': True},  # Make the image field read-only
        }

    def create(self, validated_data):
        cart = validated_data.get('cart')
        article = validated_data.get('article')
        quantity = validated_data.get('quantity', 1)

        # Check if the cart item already exists
        existing_item = CartItem.objects.filter(cart=cart, article=article).first()
        if existing_item:
            # Update quantity of the existing item
            existing_item.quantity += quantity
            existing_item.save()
            return existing_item
        else:
            # Create a new item if it doesn't exist
            return CartItem.objects.create(**validated_data)
        
    def update(self, instance, validated_data):
        # Update only the provided fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['size'] = instance.article.size.size if instance.article.size else None
        representation['color'] = instance.article.color.color if instance.article.color else None
        representation['gtin'] = instance.article.gtin
        representation['name'] = instance.article.name
        representation['image'] = instance.article.image
        representation['price'] = instance.article.price

        # Convert the Cloudinary image field to a string URL
        representation['image'] = instance.article.image.url if instance.article.image else None

        return representation

class CartSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True)
    items = CartItemSerializer(many=True, required=False)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'status','session_key', 'items']

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
            

        # Update other fields of the cart
        for attr, value in validated_data.items():
            if hasattr(instance, attr):
                setattr(instance, attr, value)
        instance.save()

        return instance