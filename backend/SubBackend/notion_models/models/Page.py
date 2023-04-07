from django.db import models
from .Text import Text
from notion_models.enums import DEFAULT_ICON
import uuid


class Page(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=36, default="")
    icon = models.CharField(max_length=1, default=DEFAULT_ICON)
    text = models.ForeignKey(Text, on_delete=models.CASCADE)
