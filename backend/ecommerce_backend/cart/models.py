from django.db import models
from django.conf import settings
from product.models import Article
from cloudinary.models import CloudinaryField

from .kafka_utils import send_order_to_kafka

class Cart(models.Model):
    class StatusChoices(models.TextChoices):
        OPEN = 'Open', 'Open'
        ORDERED = 'Ordered', 'Ordered'
        ABANDONED = 'Abandoned', 'Abandoned'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=40, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=StatusChoices.choices, default=StatusChoices.OPEN)

    def save(self, *args, **kwargs):
        if self.status == Cart.StatusChoices.ORDERED and self._state.adding is False:
            previous_status = Cart.objects.get(id=self.id).status if not self._state.adding else None
            if previous_status != Cart.StatusChoices.ORDERED:
                # Prepare the data to be sent to Kafka
                order_data = {
                    "cart_id": self.id,
                    "user_id": self.user.id if self.user else None,
                    "created_at": self.created_at.isoformat(),
                    "items": list(self.items.values(
                        'article__product__title', 
                        'article__size__size', 
                        'article__color__color', 
                        'article__price',
                        'article__gtin',
                        'article__name',
                        'quantity'))
                }
                # Send the data to Kafka
                send_order_to_kafka(order_data)

        super().save(*args, **kwargs)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    article = models.ForeignKey(Article, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    size = models.CharField(max_length=10, blank=True, null=True)
    color = models.CharField(max_length=20, blank=True, null=True)
    gtin = models.CharField(max_length=14, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    image = CloudinaryField('image', blank=True, null=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f"{self.quantity} x {self.article.product.title} - {self.article.size} / {self.article.color}"

    def save(self, *args, **kwargs):
        # Auto-fill fields from the linked Article on save, if not provided
        if not self.size:
            self.size = self.article.size.size if self.article.size else ''
        if not self.color:
            self.color = self.article.color.color if self.article.color else ''
        if not self.gtin:
            self.gtin = self.article.gtin
        if not self.name:
            self.name = self.article.name

        super().save(*args, **kwargs)
