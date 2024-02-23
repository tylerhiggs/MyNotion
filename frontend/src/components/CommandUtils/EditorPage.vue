<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import { defineProps } from "vue";
import { useSelectedPageStore } from "@/stores/selectedPage";
import { useAuth0 } from "@auth0/auth0-vue";

const props = defineProps(nodeViewProps);

const selectedPageStore = useSelectedPageStore();
// const { user } = useAuth0();
const openPage = () => {
  selectedPageStore.setSelectedPageId(props.node.attrs.id);
};
if (props.node.attrs.id === "") {
  // return {
  //   openPage,
  // };
}
</script>
<template>
  <NodeViewWrapper as="span" class="outline">
    <button @click="openPage">
      <div class="ml-1">{{ node.attrs.icon }}</div>
      <div>{{ node.attrs.name || "Untitled" }}</div>
    </button>
  </NodeViewWrapper>
</template>
