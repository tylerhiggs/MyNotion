from django.db import models
from notion_models.enums import DEFAULT_ICON
import uuid
from django.conf import settings
from typing import List


class Page(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=36, default="")
    icon = models.CharField(max_length=2, default=DEFAULT_ICON)

    index = models.IntegerField(default=0)
    is_root = models.BooleanField(default=True)
    is_favorite = models.BooleanField(default=False)
    is_public = models.BooleanField(default=False)
    # edit_users = m2m field to users that can edit, stored in the user model
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, related_name="children", null=True, blank=True)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="pages")

    @property
    def chain(self) -> List["Page"]:
        if self.parent:
            return self.parent.chain + [self]
        else:
            return [self]

    def __str__(self):
        return self.name
