<script lang="ts">
import SidePannel from "@/components/SidePannel.vue";
import MySnackbar from "@/components/MySnackbar.vue";
import PageContent from "@/components/PageContent.vue";
import SearchDialog from "@/components/SearchDialog.vue";
import { useSelectedPageStore } from "@/stores/selectedPage";
import { useSearchStore } from "@/stores/searchStore";
import { useAuth0 } from "@auth0/auth0-vue";

export default {
  name: "HomeView",
  components: {
    SidePannel,
    MySnackbar,
    PageContent,
    SearchDialog,
  },
  setup() {
    const selectedPageStore = useSelectedPageStore();
    const searchStore = useSearchStore();
    const { isAuthenticated, loginWithRedirect, user, isLoading } = useAuth0();
    const login = () => {
      loginWithRedirect({
        appState: {
          target: "/",
        },
      });
    };
    return {
      selectedPageStore,
      isAuthenticated,
      login,
      user,
      isLoading,
      searchStore,
    };
  },
};
</script>

<template>
  <main class="fixed">
    <div v-if="!isAuthenticated && isLoading" />
    <div v-else-if="isAuthenticated && user?.email !== undefined">
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
    </div>
    <div
      class="flex h-screen w-screen items-center justify-center shadow-sm"
      v-else
    >
      <div class="h-12 w-24">
        <button
          class="rounded-md bg-emerald-200 p-5 hover:bg-emerald-400"
          @click="login"
        >
          Log In
        </button>
      </div>
    </div>
    <div class="flex items-center justify-center">
      <SearchDialog />
    </div>
  </main>
</template>
