<script lang="ts">
import { SnackbarColor } from "@/enums";
import { useSnackbarStore } from "@/stores/snackbar";

export default {
  name: "MySnackbar",
  setup() {
    const snackbarStore = useSnackbarStore();
    return {
      snackbarStore,
    };
  },
  computed: {
    color() {
      switch (this.snackbarStore.snackbarColor) {
        case SnackbarColor.success:
          return "bg-green-500";
        case SnackbarColor.error:
          return "bg-red-500";
        case SnackbarColor.warning:
          return "bg-yellow-500";
        default:
          return "bg-gray-500";
      }
    },
  },
  methods: {
    close() {
      this.snackbarStore.hideSnackbar();
    },
  },
};
</script>

<template>
  <div
    class="fixed bottom-0 right-0 mb-4 mr-4 rounded-md p-4 text-white"
    :class="color"
    v-if="snackbarStore.showSnackbar"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <span class="mr-2">{{ snackbarStore.snackbarText }}</span>
      </div>
      <button @click="close" class="ml-4">
        <svg
          class="h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10.293 10l4.147-4.146a.5.5 0 11.708.708L11.707 10l4.147 4.146a.5.5 0 01-.708.708L10 10.707l-4.146 4.147a.5.5 0 01-.708-.708L9.293 10 5.146 5.854a.5.5 0 11.708-.708L10 9.293l4.146-4.147a.5.5 0 11.708.708L10.707 10z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
