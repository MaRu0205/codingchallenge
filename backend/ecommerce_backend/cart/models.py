from django.db import models
from django.conf import settings
from product.models import Product, Size, Color

from .kafka_utils import send_order_to_kafka

class Cart(models.Model):
    class StatusChoices(models.TextChoices):
        OPEN = 'Open', 'Open'
        ORDERED = 'Ordered', 'Ordered'
        ABANDONED = 'Abandoned', 'Abandoned'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=StatusChoices.choices, default=StatusChoices.OPEN)

    # def save(self, *args, **kwargs):
    #     # Check if the status has been changed to 'Ordered'
    #     if self.status == Cart.StatusChoices.ORDERED and self._state.adding is False:
    #         previous_status = Cart.objects.get(id=self.id).status
    #         if previous_status != Cart.StatusChoices.ORDERED:
    #             # Prepare the data to be sent to Kafka
    #             order_data = {
    #                 "cart_id": self.id,
    #                 "user_id": self.user.id if self.user else None,
    #                 "created_at": self.created_at,
    #                 "items": list(self.items.values('product_id', 'quantity', 'size__size', 'color__color')),
    #             }
    #             # Send the data to Kafka
    #             send_order_to_kafka(order_data)

    #     super().save(*args, **kwargs)

    def save(self, *args, **kwargs):
        # Check if the status has been changed to 'Ordered'
        if self.status == Cart.StatusChoices.ORDERED and self._state.adding is False:
            previous_status = Cart.objects.get(id=self.id).status
            if previous_status != Cart.StatusChoices.ORDERED:
                # Prepare the data to be sent to Kafka
                order_data = {
                    "cart_id": self.id,
                    "user_id": self.user.id if self.user else None,
                    "created_at": self.created_at.isoformat(),  # Convert datetime to string
                    "items": list(self.items.values('product_id', 'quantity', 'size__size', 'color__color')),
                }
                # Send the data to Kafka
                send_order_to_kafka(order_data)

        super().save(*args, **kwargs)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    size = models.ForeignKey(Size, on_delete=models.SET_NULL, null=True, blank=True)
    color = models.ForeignKey(Color, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.title} - {self.size} / {self.color}"



