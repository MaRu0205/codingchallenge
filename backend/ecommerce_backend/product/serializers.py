from rest_framework import serializers
from .models import Product, Size, Color

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'size']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'color']

class ProductSerializer(serializers.ModelSerializer):
    available_sizes = SizeSerializer(many=True, read_only=False)
    available_colors = ColorSerializer(many=True, read_only=False)

    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'description', 'available_sizes', 'available_colors', 'image']

    def create(self, validated_data):
        # Handle creation of product with sizes and colors
        sizes_data = validated_data.pop('available_sizes')
        colors_data = validated_data.pop('available_colors')
        product = Product.objects.create(**validated_data)
        for size_data in sizes_data:
            size, created = Size.objects.get_or_create(**size_data)
            product.available_sizes.add(size)
        for color_data in colors_data:
            color, created = Color.objects.get_or_create(**color_data)
            product.available_colors.add(color)
        return product

    def update(self, instance, validated_data):
        # Handle updating of product with sizes and colors
        sizes_data = validated_data.pop('available_sizes')
        colors_data = validated_data.pop('available_colors')
        instance = super(ProductSerializer, self).update(instance, validated_data)

        instance.available_sizes.clear()
        for size_data in sizes_data:
            size, created = Size.objects.get_or_create(**size_data)
            instance.available_sizes.add(size)

        instance.available_colors.clear()
        for color_data in colors_data:
            color, created = Color.objects.get_or_create(**color_data)
            instance.available_colors.add(color)

        return instance
