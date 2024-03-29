/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation UpdateContentNew($id: ID!, $text: String!, $index: Int!) {\n    updatePageContent(contentId: $id, text: $text, index: $index) {\n      pageContent {\n        __typename\n        id\n        contentType\n        text {\n          id\n          text\n        }\n      }\n    }\n  }\n": types.UpdateContentNewDocument,
    "\n  mutation UpdatePageCopy($id: ID!, $icon: String) {\n    updatePage(id: $id, icon: $icon) {\n      page {\n        __typename\n        id\n        name\n        icon\n      }\n    }\n  }\n": types.UpdatePageCopyDocument,
    "\n  query Nav($pageId: ID!) {\n    page(id: $pageId) {\n      __typename\n      id\n      chain {\n        __typename\n        id\n        name\n        icon\n      }\n      isFavorite\n    }\n  }\n": types.NavDocument,
    "\n  mutation NavUpdate($id: ID!, $isFavorite: Boolean) {\n    updatePage(id: $id, isFavorite: $isFavorite) {\n      page {\n        __typename\n        id\n        isFavorite\n      }\n    }\n  }\n": types.NavUpdateDocument,
    "\n  query Page($id: ID!) {\n    page(id: $id) {\n      __typename\n      id\n      name\n      icon\n      content {\n        edges {\n          node {\n            __typename\n            id\n            contentType\n            text {\n              id\n              text\n            }\n          }\n        }\n      }\n    }\n  }\n": types.PageDocument,
    "\n  mutation UpdatePage($id: ID!, $name: String) {\n    updatePage(id: $id, name: $name) {\n      page {\n        __typename\n        id\n        name\n        icon\n      }\n    }\n  }\n": types.UpdatePageDocument,
    "\n  mutation UpdatePContent($id: ID!, $text: String!, $index: Int!) {\n    updatePageContent(contentId: $id, text: $text, index: $index) {\n      pageContent {\n        id\n        text {\n          id\n          text\n        }\n      }\n    }\n  }\n": types.UpdatePContentDocument,
    "\n  mutation CreateContent(\n    $pageId: ID!\n    $index: Int!\n    $contentType: CONTENT_TYPES\n  ) {\n    addContentToPage(\n      pageId: $pageId\n      index: $index\n      contentType: $contentType\n    ) {\n      page {\n        __typename\n        id\n        name\n        icon\n        content {\n          edges {\n            node {\n              id\n              contentType\n              text {\n                id\n                text\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.CreateContentDocument,
    "\n    query Search($query: String!, $email: String!) {\n      search(query: $query, email: $email) {\n        page {\n          __typename\n          id\n          name\n          icon\n        }\n        contentSnippet\n      }\n    }\n  ": types.SearchDocument,
    "\n  mutation DeletePage($id: ID!) {\n    deletePage(id: $id) {\n      page {\n        __typename\n        id\n      }\n    }\n  }\n": types.DeletePageDocument,
    "\n  query Pages($email: String) {\n    pages(isRoot: true, user_Email: $email) {\n      edges {\n        node {\n          __typename\n          id\n          name\n          icon\n          isFavorite\n          isPublic\n          editUsers {\n            edges {\n              node {\n                __typename\n                id\n                email\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.PagesDocument,
    "\n  query SharedPages($email: String!) {\n    users(email: $email) {\n      edges {\n        node {\n          __typename\n          id\n          email\n          editablePages {\n            edges {\n              node {\n                __typename\n                id\n                name\n                icon\n                isFavorite\n                isPublic\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.SharedPagesDocument,
    "\n  mutation CreatePage($email: String!) {\n    createPage(email: $email) {\n      page {\n        __typename\n        id\n        name\n        icon\n        isFavorite\n        isPublic\n      }\n    }\n  }\n": types.CreatePageDocument,
    "\n  mutation UpdateContent(\n    $id: ID!\n    $text: String!\n    $index: Int!\n    $type: CONTENT_TYPES\n  ) {\n    updatePageContent(\n      contentId: $id\n      text: $text\n      index: $index\n      contentType: $type\n    ) {\n      pageContent {\n        id\n        contentType\n        text {\n          id\n          text\n        }\n      }\n    }\n  }\n": types.UpdateContentDocument,
    "\n  mutation DeleteContent($id: ID!) {\n    removeContentFromPage(contentId: $id) {\n      page {\n        __typename\n        id\n        content {\n          edges {\n            node {\n              __typename\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n": types.DeleteContentDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateContentNew($id: ID!, $text: String!, $index: Int!) {\n    updatePageContent(contentId: $id, text: $text, index: $index) {\n      pageContent {\n        __typename\n        id\n        contentType\n        text {\n          id\n          text\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateContentNew($id: ID!, $text: String!, $index: Int!) {\n    updatePageContent(contentId: $id, text: $text, index: $index) {\n      pageContent {\n        __typename\n        id\n        contentType\n        text {\n          id\n          text\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePageCopy($id: ID!, $icon: String) {\n    updatePage(id: $id, icon: $icon) {\n      page {\n        __typename\n        id\n        name\n        icon\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePageCopy($id: ID!, $icon: String) {\n    updatePage(id: $id, icon: $icon) {\n      page {\n        __typename\n        id\n        name\n        icon\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Nav($pageId: ID!) {\n    page(id: $pageId) {\n      __typename\n      id\n      chain {\n        __typename\n        id\n        name\n        icon\n      }\n      isFavorite\n    }\n  }\n"): (typeof documents)["\n  query Nav($pageId: ID!) {\n    page(id: $pageId) {\n      __typename\n      id\n      chain {\n        __typename\n        id\n        name\n        icon\n      }\n      isFavorite\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation NavUpdate($id: ID!, $isFavorite: Boolean) {\n    updatePage(id: $id, isFavorite: $isFavorite) {\n      page {\n        __typename\n        id\n        isFavorite\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation NavUpdate($id: ID!, $isFavorite: Boolean) {\n    updatePage(id: $id, isFavorite: $isFavorite) {\n      page {\n        __typename\n        id\n        isFavorite\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Page($id: ID!) {\n    page(id: $id) {\n      __typename\n      id\n      name\n      icon\n      content {\n        edges {\n          node {\n            __typename\n            id\n            contentType\n            text {\n              id\n              text\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Page($id: ID!) {\n    page(id: $id) {\n      __typename\n      id\n      name\n      icon\n      content {\n        edges {\n          node {\n            __typename\n            id\n            contentType\n            text {\n              id\n              text\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePage($id: ID!, $name: String) {\n    updatePage(id: $id, name: $name) {\n      page {\n        __typename\n        id\n        name\n        icon\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePage($id: ID!, $name: String) {\n    updatePage(id: $id, name: $name) {\n      page {\n        __typename\n        id\n        name\n        icon\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePContent($id: ID!, $text: String!, $index: Int!) {\n    updatePageContent(contentId: $id, text: $text, index: $index) {\n      pageContent {\n        id\n        text {\n          id\n          text\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePContent($id: ID!, $text: String!, $index: Int!) {\n    updatePageContent(contentId: $id, text: $text, index: $index) {\n      pageContent {\n        id\n        text {\n          id\n          text\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateContent(\n    $pageId: ID!\n    $index: Int!\n    $contentType: CONTENT_TYPES\n  ) {\n    addContentToPage(\n      pageId: $pageId\n      index: $index\n      contentType: $contentType\n    ) {\n      page {\n        __typename\n        id\n        name\n        icon\n        content {\n          edges {\n            node {\n              id\n              contentType\n              text {\n                id\n                text\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateContent(\n    $pageId: ID!\n    $index: Int!\n    $contentType: CONTENT_TYPES\n  ) {\n    addContentToPage(\n      pageId: $pageId\n      index: $index\n      contentType: $contentType\n    ) {\n      page {\n        __typename\n        id\n        name\n        icon\n        content {\n          edges {\n            node {\n              id\n              contentType\n              text {\n                id\n                text\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Search($query: String!, $email: String!) {\n      search(query: $query, email: $email) {\n        page {\n          __typename\n          id\n          name\n          icon\n        }\n        contentSnippet\n      }\n    }\n  "): (typeof documents)["\n    query Search($query: String!, $email: String!) {\n      search(query: $query, email: $email) {\n        page {\n          __typename\n          id\n          name\n          icon\n        }\n        contentSnippet\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeletePage($id: ID!) {\n    deletePage(id: $id) {\n      page {\n        __typename\n        id\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeletePage($id: ID!) {\n    deletePage(id: $id) {\n      page {\n        __typename\n        id\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Pages($email: String) {\n    pages(isRoot: true, user_Email: $email) {\n      edges {\n        node {\n          __typename\n          id\n          name\n          icon\n          isFavorite\n          isPublic\n          editUsers {\n            edges {\n              node {\n                __typename\n                id\n                email\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Pages($email: String) {\n    pages(isRoot: true, user_Email: $email) {\n      edges {\n        node {\n          __typename\n          id\n          name\n          icon\n          isFavorite\n          isPublic\n          editUsers {\n            edges {\n              node {\n                __typename\n                id\n                email\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SharedPages($email: String!) {\n    users(email: $email) {\n      edges {\n        node {\n          __typename\n          id\n          email\n          editablePages {\n            edges {\n              node {\n                __typename\n                id\n                name\n                icon\n                isFavorite\n                isPublic\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query SharedPages($email: String!) {\n    users(email: $email) {\n      edges {\n        node {\n          __typename\n          id\n          email\n          editablePages {\n            edges {\n              node {\n                __typename\n                id\n                name\n                icon\n                isFavorite\n                isPublic\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePage($email: String!) {\n    createPage(email: $email) {\n      page {\n        __typename\n        id\n        name\n        icon\n        isFavorite\n        isPublic\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePage($email: String!) {\n    createPage(email: $email) {\n      page {\n        __typename\n        id\n        name\n        icon\n        isFavorite\n        isPublic\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateContent(\n    $id: ID!\n    $text: String!\n    $index: Int!\n    $type: CONTENT_TYPES\n  ) {\n    updatePageContent(\n      contentId: $id\n      text: $text\n      index: $index\n      contentType: $type\n    ) {\n      pageContent {\n        id\n        contentType\n        text {\n          id\n          text\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateContent(\n    $id: ID!\n    $text: String!\n    $index: Int!\n    $type: CONTENT_TYPES\n  ) {\n    updatePageContent(\n      contentId: $id\n      text: $text\n      index: $index\n      contentType: $type\n    ) {\n      pageContent {\n        id\n        contentType\n        text {\n          id\n          text\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteContent($id: ID!) {\n    removeContentFromPage(contentId: $id) {\n      page {\n        __typename\n        id\n        content {\n          edges {\n            node {\n              __typename\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteContent($id: ID!) {\n    removeContentFromPage(contentId: $id) {\n      page {\n        __typename\n        id\n        content {\n          edges {\n            node {\n              __typename\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;