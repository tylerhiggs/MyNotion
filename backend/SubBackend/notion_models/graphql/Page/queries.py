from graphene import ObjectType, relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from notion_models.models import Page, Text, PageContent
from django_filters import FilterSet, OrderingFilter

# https://docs.graphene-python.org/projects/django/en/latest/tutorial-relay/


class TextNode(DjangoObjectType):
    class Meta:
        model = Text
        filter_fields = ["id", "text"]
        interfaces = (relay.Node,)


class PageNode(DjangoObjectType):
    class Meta:
        model = Page
        filter_fields = ["id", "name", "is_root"]
        interfaces = (relay.Node,)


class PageContentNode(DjangoObjectType):
    class Meta:
        model = PageContent
        filter_fields = ["id", "text"]
        interfaces = (relay.Node,)


class PageQuery(ObjectType):
    page = relay.Node.Field(PageNode)
    pages = DjangoFilterConnectionField(PageNode)
