import graphene
from graphene_django import DjangoObjectType
from graphql_relay.node.node import from_global_id
from .queries import PageContentNode, PageNode
from notion_models.enums import ContentTypes  # !gql enum

from notion_models.models import Page, Text, PageContent
from auth_app.models import User


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
        email = graphene.String()

    page = graphene.Field(PageNode)

    @classmethod
    def mutate(cls, root, info, name="", email=None):
        try:
            print(f"creating page for {email}")
            if (email == None or email == ""):
                print("email is None")
                return None
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                user = User.objects.create(email=email)
            except Exception as e:
                print(f"something went wrong getting user: {e}")
                user = User.objects.create(email=email)
            try:
                if not user:
                    print("something went wrong creating user")
                    return None
                num_pages = Page.objects.count()
                page = Page.objects.create(
                    name=name, index=num_pages, user=user)
                PageContent.objects.create(
                    text=Text.objects.create(text=""), index=0, page=page)
                print(f"created page successfully with id {page.id}")
            except Exception as e:
                print(f"something went wrong creating page: {e}")
            return CreatePage(page=page)
        except Exception as e:
            print(f"something went wrong: {e}")
            return None


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
        text = graphene.String()
        index = graphene.Int(required=True)
        indentation = graphene.Int()
        content_type = graphene.Argument(ContentTypes)

    page = graphene.Field(PageNode)

    @classmethod
    def mutate(cls, _root, _info, page_id, index, text="", indentation=0, content_type=None):
        print("adding content to page")
        try:
            page = Page.objects.get(id=from_global_id(page_id).id)
        except Page.DoesNotExist:
            print("page does not exist")
            return None
        except Exception as e:
            print(e)
            return None
        try:
            text_obj = Text.objects.create(text=text)

            index = page.content.count()
            content = PageContent.objects.create(
                text=text_obj, index=index, indentation=indentation, page=page)
            if content_type != None:
                content.content_type = content_type
                content.text.text = "&nbsp;"
                content.text.save()
                content.save()
        except Exception as e:
            print(e)
            return None
        return AddContentToPage(page=page)


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
        print("Yayyyyyyyy I made it in here")
        print(f"content_type: {content_type}")
        try:
            page_content = PageContent.objects.get(
                id=from_global_id(content_id).id)
        except PageContent.DoesNotExist:
            print("page content does not exist")
            return None
        if text != None:
            page_content.text.text = text
            page_content.text.save()
        if index != None:
            page_content.index = index
        if indentation != None:
            page_content.indentation = indentation
        if content_type != None:
            page_content.content_type = content_type
            print(f"page.content_type: {page_content.content_type}")
        page_content.save()
        print("saved page content")
        return UpdateContentOnPage(page_content=page_content)


class RemoveContentFromPage(graphene.Mutation):
    class Arguments:
        content_id = graphene.ID(required=True)

    page = graphene.Field(PageNode)

    @classmethod
    def mutate(cls, _root, _info, content_id):
        try:
            page_content = PageContent.objects.get(
                id=from_global_id(content_id).id)
        except PageContent.DoesNotExist:
            print("page content does not exist")
            return None
        page = page_content.page
        page_content.delete()
        return RemoveContentFromPage(page=page)


class PageMutations(graphene.ObjectType):
    create_page = CreatePage.Field()
    update_page = UpdatePage.Field()
    add_content_to_page = AddContentToPage.Field()
    update_page_content = UpdateContentOnPage.Field()
    remove_content_from_page = RemoveContentFromPage.Field()
