from rest_framework import serializers
from .models import Product, Size, Color, Article
import cloudinary

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'size']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'color']

class ArticleSerializer(serializers.ModelSerializer):
    size = serializers.SlugRelatedField(
        slug_field='size',
        queryset=Size.objects.all()
    )
    color = serializers.SlugRelatedField(
        slug_field='color',
        queryset=Color.objects.all()
    )
    price = serializers.DecimalField(max_digits=6, decimal_places=2)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'product_id', 'size', 'color', 'price', 'image', 'gtin', 'name']

    def get_image(self, obj):
        if obj.image:
            cloud_name = cloudinary.config().cloud_name
            return f'https://res.cloudinary.com/{cloud_name}/{obj.image}'
        return None

class ProductSerializer(serializers.ModelSerializer):
    articles = ArticleSerializer(many=True)

    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'articles']

    def create(self, validated_data):
        articles_data = validated_data.pop('articles', [])
        product = Product.objects.create(**validated_data)
        for article_data in articles_data:
            Article.objects.create(product=product, **article_data)
        return product