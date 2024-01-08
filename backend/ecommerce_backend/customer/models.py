from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField
from django.conf import settings

from django.db.models.signals import post_save
from django.dispatch import receiver


class CustomUser(AbstractUser):
    profile_image = CloudinaryField('image', blank=True, null=True)

class Customer(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=50, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.user} - {self.city} / {self.postal_code}"