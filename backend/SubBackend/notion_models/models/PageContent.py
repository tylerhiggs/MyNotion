from django.db import models
from .Text import Text
from notion_models.enums import DEFAULT_ICON, CONTENT_TYPES
import uuid


class PageContent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    index = models.IntegerField(default=0)
    # The content type will determine which of the foreign keys below is used
    content_type = models.CharField(
        max_length=1, choices=CONTENT_TYPES.choices, default=CONTENT_TYPES.TEXT
    )
    # Type: Text, H1-6, BULLETED_LIST, NUMBERED_LIST, TODO_LIST, QUOTE, CODE
    # Bold text encoded as **bold text**, italic text encoded as *italic text*
    text = models.ForeignKey(
        Text, on_delete=models.CASCADE, blank=True, null=True)
    indentation = models.IntegerField(default=0)

    def __str__(self):
        if self.text:
            return "Page Content['" + self.text.text if len(self.text.text) < 20 else self.text.text[:20] + "...']"
        else:
            return "Page Content[No Text]"

    class Meta:
        ordering = ["index"]
