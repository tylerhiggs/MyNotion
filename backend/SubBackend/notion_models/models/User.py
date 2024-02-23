from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    email = models.EmailField()
    editable_pages = models.ManyToManyField(
        "notion_models.Page", related_name="edit_users", blank=True)
