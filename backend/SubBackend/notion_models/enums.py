from django.db import models
from django.utils.translation import gettext_lazy as _
import graphene

# Enums and constants for MyNotion API
DEFAULT_ICON = "E"


class CONTENT_TYPES(models.TextChoices):
    TEXT = "T", _("Text")
    PAGE = "P", _("Page")
    H1 = "1", _("Heading 1")
    H2 = "2", _("Heading 2")
    H3 = "3", _("Heading 3")
    H4 = "4", _("Heading 4")
    H5 = "5", _("Heading 5")
    H6 = "6", _("Heading 6")
    BULLETED_LIST = "B", _("Bulleted List")
    NUMBERED_LIST = "N", _("Numbered List")
    TODO_LIST = "D", _("To-do List")
    QUOTE = "Q", _("Quote")
    CODE = "C", _("Code")


ContentTypes = graphene.Enum.from_enum(CONTENT_TYPES)
