<script lang="ts">
import gql from "graphql-tag";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useSnackbarStore } from "@/stores/snackbar";
import { useSelectedPageStore } from "@/stores/selectedPage";
import { SnackbarColor } from "@/enums";

const PAGE_QUERY = gql`
  query Page($id: ID!) {
    page(id: $id) {
      __typename
      id
      name
      icon
      content {
        edges {
          node {
            id
            name
            icon
            index
            indent
            text {
              __typename
              id
              text
            }
          }
        }
      }
    }
  }
`;

export default {
  name: "PageContent",
  setup() {
    const selectedPageStore = useSelectedPageStore();
    const { result, error } = useQuery(PAGE_QUERY, {
      variables: {
        id: selectedPageStore.selectedPageId,
      },
    });
    const snackbarStore = useSnackbarStore();
    return {
      result,
      error,
      snackbarStore,
      selectedPageStore,
    };
  },
};
</script>

<template>
  <div
    v-if="selectedPageStore.selectedPageId !== ''"
    class="h-screen w-screen bg-emerald-300"
  >
    Something
  </div>
</template>
