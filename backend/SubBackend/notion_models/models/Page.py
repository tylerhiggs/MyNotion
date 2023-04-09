from django.db import models
from .PageContent import PageContent
from notion_models.enums import DEFAULT_ICON
import uuid


class Page(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=36, default="")
    icon = models.CharField(max_length=1, default=DEFAULT_ICON)
    content = models.ManyToManyField(
        PageContent, related_name="page", blank=True)

    index = models.IntegerField(default=0)
    is_root = models.BooleanField(default=True)

    def __str__(self):
        return self.name
