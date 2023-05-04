from graphene import ObjectType, relay, Field, String, List
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from notion_models.models import Page, Text, PageContent
from auth_app.models import User
from notion_models.enums import ContentTypes
from html.parser import HTMLParser

# https://docs.graphene-python.org/projects/django/en/latest/tutorial-relay/


class TextNode(DjangoObjectType):
    class Meta:
        model = Text
        filter_fields = ["id", "text"]
        interfaces = (relay.Node,)


class PageNode(DjangoObjectType):
    chain = List(of_type="notion_models.graphql.Page.queries.PageNode",
                 source="chain", required=True)

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


class UserNode(DjangoObjectType):
    class Meta:
        model = User
        filter_fields = ["id", "email"]
        interfaces = (relay.Node,)


class PageQuery(ObjectType):
    page = relay.Node.Field(PageNode)
    pages = DjangoFilterConnectionField(PageNode)
    user = relay.Node.Field(UserNode)
    users = DjangoFilterConnectionField(UserNode)


class MyHTMLParser(HTMLParser):
    parsed_data = []

    def handle_data(self, data):
        self.parsed_data.append(data)


class SearchResultType(ObjectType):
    page = Field(PageNode, required=True)
    content_snippet = String()


class SearchQuery(ObjectType):
    search = Field(List(SearchResultType), query=String(),
                   email=String(required=True))

    def resolve_search(self, info, query, email):
        print("searching for", query)
        try:
            if query == "":
                return []
            queries = query.split(" ")
            print(f"queries: {queries}")
            if len(queries) > 1:
                queries = [query] + queries
            # will first search for exact match for full string of searched words, then for each word
            results = {}  # page_id: {"page": page, "content_snippet": None}
            for q in queries:
                print(f"searching for {q}")
                matching_titles = Page.objects.filter(
                    name__icontains=q, user__email=email)
                matching_content = PageContent.objects.filter(
                    text__text__icontains=q, page__user__email=email)
                parser = MyHTMLParser()
                new_results = {page.id: {"page": page, "content_snippet": None}
                               for page in matching_titles}
                results = new_results | results
                for content in matching_content:
                    parser.parsed_data = []
                    parser.feed(content.text.text)
                    snippet = [s for s in parser.parsed_data if q.lower()
                               in s.lower()][0]
                    if content.page.id not in results:
                        results[content.page.id] = {
                            "page": content.page, "content_snippet": snippet}
            print(results)
            return [SearchResultType(page=result["page"], content_snippet=result["content_snippet"]) for result in results.values()]
        except Exception as e:
            print("something went wrong searching:", e)
            return []
