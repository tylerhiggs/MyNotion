<script lang="ts">
import SidePannel from "@/components/SidePannel.vue";
import MySnackbar from "@/components/MySnackbar.vue";
import PageContent from "@/components/PageContent.vue";
export default {
  name: "HomeView",
  components: {
    SidePannel,
    MySnackbar,
    PageContent,
  },
};
</script>

<template>
  <main>
    <SidePannel class="h-full" />
    <PageContent />
    <MySnackbar />
  </main>
</template>
