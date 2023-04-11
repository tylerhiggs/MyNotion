<script lang="ts">
import SidePannel from "@/components/SidePannel.vue";
import MySnackbar from "@/components/MySnackbar.vue";
import PageContent from "@/components/PageContent.vue";
import { useSelectedPageStore } from "@/stores/selectedPage";

export default {
  name: "HomeView",
  components: {
    SidePannel,
    MySnackbar,
    PageContent,
  },
  setup() {
    const selectedPageStore = useSelectedPageStore();
    return {
      selectedPageStore,
    };
  },
};
</script>

<template>
  <main>
    <div class="grid grid-cols-8">
      <SidePannel class="col-start-1 col-end-2 w-full" />
      <div
        v-if="selectedPageStore.selectedPageId !== ''"
        class="col-start-2 col-end-9 w-full"
      >
        <PageContent :id="selectedPageStore.selectedPageId" />
      </div>
    </div>
    <MySnackbar />
  </main>
</template>
