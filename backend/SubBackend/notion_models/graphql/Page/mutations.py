import graphene
from graphene_django import DjangoObjectType
from graphql_relay.node.node import from_global_id
from .queries import PageContentNode, PageNode
from notion_models.enums import ContentTypes  # gql enum

from notion_models.models import Page, Text, PageContent


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

    page = graphene.Field(PageNode)

    @classmethod
    def mutate(cls, root, info, name=""):
        num_pages = Page.objects.count()
        page = Page.objects.create(name=name, index=num_pages)
        return CreatePage(page=page)


class UpdatePage(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        icon = graphene.String()

    page = graphene.Field(PageNode)

    @classmethod
    def mutate(cls, _root, _info, id, name=None, icon=None):
        try:
            page = Page.objects.get(id=from_global_id(id).id)
        except Page.DoesNotExist:
            print("page does not exist")
            return None
        if name != None:
            page.name = name
        if icon != None:
            if len(icon) != 1:
                print("icon must be a single character")
                return None
            page.icon = icon
        page.save()
        return UpdatePage(page=page)


class AddContentToPage(graphene.Mutation):
    class Arguments:
        page_id = graphene.ID(required=True)
        text = graphene.String(required=True)
        index = graphene.Int(required=True)
        indentation = graphene.Int()
        content_type = graphene.Argument(ContentTypes)

    page_content = graphene.Field(PageContentNode)

    @classmethod
    def mutate(cls, _root, _info, page_id, text, index, indentation=0, content_type=ContentTypes.TEXT):
        try:
            page = Page.objects.get(id=from_global_id(page_id).id)
        except Page.DoesNotExist:
            print("page does not exist")
            return None
        try:
            text_obj = Text.objects.create(text=text)
            index = page.content.count()
            page_content = PageContent.objects.create(
                text=text_obj, index=index, indentation=indentation, content_type=content_type)
            page.content.add(page_content)
        except Exception as e:
            print(e)
            return None
        return AddContentToPage(page_content=page_content)


class UpdateContentOnPage(graphene.Mutation):
    class Arguments:
        content_id = graphene.ID(required=True)
        text = graphene.String(required=True)
        index = graphene.Int(required=True)
        indentation = graphene.Int()
        content_type = graphene.Argument(ContentTypes)

    page_content = graphene.Field(PageContentNode)

    @classmethod
    def mutate(cls, _root, _info, content_id, text=None, index=None, indentation=None, content_type=None):
        try:
            page_content = PageContent.objects.get(
                id=from_global_id(content_id).id)
        except PageContent.DoesNotExist:
            print("page content does not exist")
            return None
        if text != None:
            page_content.text = text
        if index != None:
            page_content.index = index
        if indentation != None:
            page_content.indentation = indentation
        if content_type != None:
            page_content.content_type = content_type
        page_content.save()
        return UpdateContentOnPage(page_content=page_content)


class RemoveContentFromPage(graphene.Mutation):
    class Arguments:
        content_id = graphene.ID(required=True)

    page_content = graphene.Field(PageContentNode)

    @classmethod
    def mutate(cls, _root, _info, content_id):
        try:
            page_content = PageContent.objects.get(
                id=from_global_id(content_id).id)
        except PageContent.DoesNotExist:
            print("page content does not exist")
            return None
        page_content.delete()
        return RemoveContentFromPage(page_content=page_content)


class PageMutations(graphene.ObjectType):
    create_page = CreatePage.Field()
    update_page = UpdatePage.Field()
    add_content_to_page = AddContentToPage.Field()
