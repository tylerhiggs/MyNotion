from django.db import models
from .Text import Text
from notion_models.enums import DEFAULT_ICON

class Page(models.Model):
    name = models.CharField(max_length=36)
    icon = models.CharField(max_length=1, default=DEFAULT_ICON)
    text = models.ForeignKey(Text, on_delete=models.CASCADE)