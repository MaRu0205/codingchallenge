from django.contrib import admin
from .models import CustomUser, Customer

admin.site.register(CustomUser)
admin.site.register(Customer)
