<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { graphql } from "@/gql";
import { Dialog, DialogPanel } from "@headlessui/vue";
import { useSearchStore } from "@/stores/searchStore";
import { DocumentIcon } from "@heroicons/vue/24/outline";
import { useSelectedPageStore } from "@/stores/selectedPage";

const searchStore = useSearchStore();
const selectedPageStore = useSelectedPageStore();

const searchField = ref("");
const selectedIndex = ref(0);

const { result } = useQuery(
  graphql(`
    query Search($query: String!) {
      search(query: $query) {
        page {
          __typename
          id
          name
          icon
        }
        contentSnippet
      }
    }
  `),
  () => ({
    query: searchField.value,
  })
);
const searchResults = computed(() => {
  return (result.value?.search || [])
    .filter((res) => res !== null && res !== undefined)
    .map(
      (res) =>
        res && {
          page: res.page,
          contentSnippet: res?.contentSnippet?.replace(
            searchField.value,
            (match) => `<b>${match}</b>`
          ),
        }
    );
});
const isOpen = computed(() => searchStore.isOpen);
const onEnter = (event: Event, index: number) => {
  event.preventDefault();
  if (index !== undefined) {
    selectedIndex.value = index;
  }
  const selectedResult = searchResults.value[selectedIndex.value];
  if (selectedResult) {
    selectedPageStore.setSelectedPageId(selectedResult.page.id);
  }
  searchStore.onClose();
  searchStore.isOpen = false;
};
</script>

<template>
  <Dialog
    :open="isOpen"
    @close="searchStore.onClose"
    class="absolute z-10 flex h-screen w-screen items-center justify-center"
    @keydown.up="selectedIndex = Math.max(0, selectedIndex - 1)"
    @keydown.down="
      selectedIndex = Math.min(searchResults.length - 1, selectedIndex + 1)
    "
    @keydown.enter="onEnter"
  >
    <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
    <DialogPanel class="fixed h-2/3 w-1/3 rounded-md bg-white">
      <div class="flex flex-col">
        <div class="flex flex-row">
          <input
            v-model="searchField"
            class="w-full rounded-md border-none border-gray-300 p-2 outline-none"
            type="text"
            placeholder="Search"
          />
        </div>
      </div>
      <hr />
      <div
        v-for="(pageResult, index) in searchResults"
        :key="pageResult?.page.id"
        :class="index === selectedIndex ? 'bg-gray-100' : undefined"
        class="flex flex-row p-2"
      >
        <div
          v-if="pageResult?.page.icon && pageResult?.page.icon !== 'E'"
          class="mr-4 h-5 w-5"
        >
          {{ pageResult?.page.icon }}
        </div>
        <DocumentIcon class="mr-4 h-5 w-5" v-else />
        <div @click="onEnter($event, index)" class="flex flex-col">
          <div class="font-bold">{{ pageResult?.page.name }}</div>
          <div class="text-gray-500" v-html="pageResult?.contentSnippet" />
        </div>
      </div>
    </DialogPanel>
  </Dialog>
</template>
