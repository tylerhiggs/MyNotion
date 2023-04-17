from graphene import ObjectType, relay, Field
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from notion_models.models import Page, Text, PageContent
from notion_models.enums import ContentTypes

# https://docs.graphene-python.org/projects/django/en/latest/tutorial-relay/


class TextNode(DjangoObjectType):
    class Meta:
        model = Text
        filter_fields = ["id", "text"]
        interfaces = (relay.Node,)


class PageNode(DjangoObjectType):
    class Meta:
        model = Page
        filter_fields = ["id", "name", "is_root", "user__email"]
        interfaces = (relay.Node,)


class PageContentNode(DjangoObjectType):
    content_type = Field(ContentTypes)

    class Meta:
        model = PageContent
        filter_fields = ["id", "text"]
        interfaces = (relay.Node,)


class PageQuery(ObjectType):
    page = relay.Node.Field(PageNode)
    pages = DjangoFilterConnectionField(PageNode)
