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
    isSelected: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
  },
});
</script>

<template>
  <MenuItem v-slot="{ active }" class="relative">
    <button
      class="flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
      :class="{ 'bg-gray-100 text-gray-900': active }"
    >
      <slot name="icon" />
      <span v-if="!isSelected" class="ml-2">{{ label }}</span>
      <span v-else class="ml-2 font-bold">{{ label }}</span>
    </button>
  </MenuItem>
</template>
