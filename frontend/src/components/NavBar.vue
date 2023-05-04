<script setup lang="ts">
import { useQuery, useMutation } from "@vue/apollo-composable";
import { graphql } from "@/gql";
import gql from "graphql-tag";
import { ref, computed, watch } from "vue";
import { useSnackbarStore } from "@/stores/snackbar";
import { SnackbarColor } from "@/enums";
import { StarIcon } from "@heroicons/vue/24/outline";
import {
  StarIcon as StarIconSolid,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/solid";
import { useSelectedPageStore } from "@/stores/selectedPage";

const NAV_QUERY = graphql(`
  query Nav($pageId: ID!) {
    page(id: $pageId) {
      __typename
      id
      chain {
        __typename
        id
        name
        icon
      }
      isFavorite
    }
  }
`);

const NAV_UPDATE = gql`
  mutation NavUpdate($id: ID!, $isFavorite: Boolean) {
    updatePage(id: $id, isFavorite: $isFavorite) {
      page {
        __typename
        id
        isFavorite
      }
    }
  }
`;

const selectedPageStore = useSelectedPageStore();
const snackbarStore = useSnackbarStore();
const { result, error, refetch } = useQuery(NAV_QUERY, {
  pageId: selectedPageStore.selectedPageId,
});
const page = computed(() => result.value?.page);
watch(
  () => error,
  (error) => {
    if (error) {
      snackbarStore.toggleSnackbar(
        "Error loading Navigation Bar",
        SnackbarColor.error
      );
    }
  }
);

watch(
  () => selectedPageStore.selectedPageId,
  (id) => {
    refetch({
      pageId: id,
    });
  }
);

const { mutate: updateNav } = useMutation(NAV_UPDATE);
const toggleFavorite = async () => {
  const res = await updateNav({
    id: selectedPageStore.selectedPageId,
    isFavorite: !page.value?.isFavorite,
  });
  if (res) {
    snackbarStore.toggleSnackbar(
      res?.data?.updatePage?.page?.isFavorite
        ? "Page added to favorites"
        : "Page removed from favorites",
      SnackbarColor.success
    );
  } else {
    snackbarStore.toggleSnackbar(
      "Error toggling page favorite status",
      SnackbarColor.error
    );
  }
};
</script>

<template>
  <nav>
    <div class="flex flex-row items-center justify-between px-4 py-2">
      <div class="flex">
        <div v-for="p in page?.chain" :key="p?.id">
          <button
            class="mr-2 flex flex-row items-center rounded-md p-1 text-center hover:bg-gray-100"
            @click="selectedPageStore.setSelectedPageId(p?.id || '')"
          >
            <div class="mr-1">{{ p?.icon }}</div>
            <div>{{ p?.name }}</div>
          </button>
          <div v-if="p !== page?.chain[page?.chain.length - 1]">/</div>
        </div>
      </div>
      <button class="rounded-md p-1 hover:bg-gray-100" @click="toggleFavorite">
        <StarIcon v-if="!page?.isFavorite" class="h-5 w-5" />
        <StarIconSolid v-else class="h-5 w-5 fill-yellow-200 shadow-sm" />
      </button>
    </div>
  </nav>
</template>
