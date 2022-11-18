import graphene
from graphene_django import DjangoObjectType

from notion_models.models import Page, Text

class PageType(DjangoObjectType):
    class Meta:
        model = Page
        fields = ("id", "name", "text")

class TextType(DjangoObjectType):
    class Meta:
        model = Text
        fields = ("id", "text", "is_bold", "is_italic")

class PageQuery(graphene.ObjectType):
    pages = graphene.List(PageType)

    def resolve_pages(root, info):
        return Page.objects.all()
    # category_by_name = graphene.Field(CategoryType, name=graphene.String(required=True))

    # def resolve_all_ingredients(root, info):
    #     # We can easily optimize query count in the resolve method
    #     return Ingredient.objects.select_related("category").all()

    # def resolve_category_by_name(root, info, name):
    #     try:
    #         return Category.objects.get(name=name)
    #     except Category.DoesNotExist:
    #         return None