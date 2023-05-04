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
  <main class="fixed w-screen">
    <div v-if="!isAuthenticated && isLoading" />
    <div
      v-else-if="isAuthenticated && user?.email !== undefined"
      class="flex w-screen"
    >
      <SidePannel class="h-screen w-64" />
      <div v-if="selectedPageStore.selectedPageId !== ''" class="w-full">
        <PageContent :id="selectedPageStore.selectedPageId" />
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
