from rest_framework import serializers
from django.conf import settings
from .models import Product, Size, Color

import cloudinary

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'size']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'color']

class ProductSerializer(serializers.ModelSerializer):
    available_sizes = SizeSerializer(many=True, read_only=True)
    available_colors = ColorSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'description', 'available_sizes', 'available_colors', 'image']

    def get_image(self, obj):
        if obj.image:
            cloud_name = cloudinary.config().cloud_name
            return f'https://res.cloudinary.com/{cloud_name}/{obj.image}'
        return None

    def create(self, validated_data):
        sizes_data = validated_data.pop('available_sizes', [])
        colors_data = validated_data.pop('available_colors', [])
        product = Product.objects.create(**validated_data)
        for size_data in sizes_data:
            size, _ = Size.objects.get_or_create(**size_data)
            product.available_sizes.add(size)
        for color_data in colors_data:
            color, _ = Color.objects.get_or_create(**color_data)
            product.available_colors.add(color)
        return product

    def update(self, instance, validated_data):
        sizes_data = validated_data.pop('available_sizes', [])
        colors_data = validated_data.pop('available_colors', [])
        instance = super().update(instance, validated_data)

        instance.available_sizes.clear()
        for size_data in sizes_data:
            size, _ = Size.objects.get_or_create(**size_data)
            instance.available_sizes.add(size)

        instance.available_colors.clear()
        for color_data in colors_data:
            color, _ = Color.objects.get_or_create(**color_data)
            instance.available_colors.add(color)

        return instance

