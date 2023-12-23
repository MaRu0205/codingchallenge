from django.db import models
from cloudinary.models import CloudinaryField

class Size(models.Model):
    size = models.CharField(max_length=10)  # Example values: 'S', 'M', 'L', etc.

    def __str__(self):
        return self.size

class Color(models.Model):
    color = models.CharField(max_length=20)  # Example values: 'Red', 'Blue', etc.

    def __str__(self):
        return self.color

class Product(models.Model):
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField()
    available_sizes = models.ManyToManyField(Size)
    available_colors = models.ManyToManyField(Color)
    image = CloudinaryField('image', blank=True, null=True)  # Cloudinary image field

    def __str__(self):
        return self.title