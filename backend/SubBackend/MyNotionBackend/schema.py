import graphene
from notion_models.graphql.Page import PageQuery, PageMutations
# import my_app.schema.Query
# import my_app.schema.Mutation

class Query(
    # my_app.schema.Query, # Add your Query objects here
    PageQuery,
    graphene.ObjectType
):
    pass

class Mutation(
    PageMutations,
    graphene.ObjectType
):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)