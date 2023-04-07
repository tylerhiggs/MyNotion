<script lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "SidePannelMenuItem",
  props: {
    label: {
      type: String,
      required: true,
    },
    onClick: {
      type: Function,
      required: false,
    },
  },
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  },
  methods: {
    handleClick() {
      if (this.onClick) {
        this.onClick();
      }
    },
  },
});
</script>

<template>
  <MenuItem v-slot="{ active }" class="relative">
    <button
      class="flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
      :class="{ 'bg-gray-100 text-gray-900': active }"
      @click="handleClick"
    >
      <slot name="icon" />
      <span class="ml-2">{{ label }}</span>
    </button>
  </MenuItem>
</template>
