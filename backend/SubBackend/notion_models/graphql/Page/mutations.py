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
        fields = ("id", "text")


class CreatePage(graphene.Mutation):
    class Arguments:
        name = graphene.String()

    page = graphene.Field(PageType)
    id = graphene.UUID()
    text = graphene.Field(TextType)

    @classmethod
    def mutate(cls, root, info, name=""):
        text = Text.objects.create()
        page = Page.objects.create(name=name, text=text)
        id = page.id
        return CreatePage(page=page, text=text, id=id)


class PageMutations(graphene.ObjectType):
    create_page = CreatePage.Field()
