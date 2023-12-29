from django.db import models
from cloudinary.models import CloudinaryField

class Size(models.Model):
    size = models.CharField(max_length=10, unique=True)  # Ensure 'size' is unique

    def __str__(self):
        return self.size

class Color(models.Model):
    color = models.CharField(max_length=20, unique=True)  # Ensure 'color' is unique

    def __str__(self):
        return self.color

class Product(models.Model):
    class StatusChoices(models.TextChoices):
        ACTIVE = 'Active', 'Active'
        INACTIVE = 'Inactive', 'Inactive'

    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(
        max_length=8, 
        choices=StatusChoices.choices, 
        default=StatusChoices.ACTIVE
    )

    def __str__(self):
        return self.title

class Article(models.Model):
    product = models.ForeignKey(Product, related_name='articles', on_delete=models.CASCADE)
    size = models.ForeignKey(Size, on_delete=models.SET_NULL, null=True, blank=True)
    color = models.ForeignKey(Color, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    image = CloudinaryField('image', blank=True, null=True)
    gtin = models.CharField(max_length=14)  # Assuming GTIN-14, adjust length as needed
    name = models.CharField(max_length=255)  # Name of the article

    def __str__(self):
        return f"{self.name} - {self.size} / {self.color}"