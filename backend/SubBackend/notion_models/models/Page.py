from django.db import models
from notion_models.enums import DEFAULT_ICON
import uuid
from django.conf import settings


class Page(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=36, default="")
    icon = models.CharField(max_length=1, default=DEFAULT_ICON)

    index = models.IntegerField(default=0)
    is_root = models.BooleanField(default=True)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="pages")

    def __str__(self):
        return self.name
