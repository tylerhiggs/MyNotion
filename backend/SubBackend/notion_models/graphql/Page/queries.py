from graphene import ObjectType, relay, List
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from notion_models.models import Page, Text

# https://docs.graphene-python.org/projects/django/en/latest/tutorial-relay/


class PageType(DjangoObjectType):
    class Meta:
        model = Page
        fields = ("id", "name", "text")


class TextNode(DjangoObjectType):
    class Meta:
        model = Text
        filter_fields = ["id", "text"]
        interfaces = (relay.Node,)


class PageNode(DjangoObjectType):
    class Meta:
        model = Page
        filter_fields = ["id", "name"]
        interfaces = (relay.Node,)


class TextType(DjangoObjectType):
    class Meta:
        model = Text
        fields = ("id", "text")


class PageQuery(ObjectType):
    page = relay.Node.Field(PageNode)
    pages = DjangoFilterConnectionField(PageNode)
    # category_by_name = graphene.Field(CategoryType, name=graphene.String(required=True))

    # def resolve_all_ingredients(root, info):
    #     # We can easily optimize query count in the resolve method
    #     return Ingredient.objects.select_related("category").all()

    # def resolve_category_by_name(root, info, name):
    #     try:
    #         return Category.objects.get(name=name)
    #     except Category.DoesNotExist:
    #         return None
