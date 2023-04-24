<script lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { EllipsisHorizontalIcon, TrashIcon } from "@heroicons/vue/20/solid";
import { defineComponent } from "vue";
import ProfileMenu from "./ProfileMenu.vue";
import gql from "graphql-tag";
import { useMutation } from "@vue/apollo-composable";
import { useSnackbarStore } from "@/stores/snackbar";
import { SnackbarColor } from "@/enums";

const DELETE_PAGE = gql`
  mutation DeletePage($id: ID!) {
    deletePage(id: $id) {
      page {
        __typename
        id
      }
    }
  }
`;

export default defineComponent({
  name: "SidePannelMenuItem",
  setup(props) {
    const { mutate: deletePage } = useMutation(DELETE_PAGE, () => ({
      update: (cache) => {
        cache.evict({
          id: cache.identify({
            __typename: "PageNode",
            id: props.id,
          }),
        });
        cache.gc();
      },
    }));
    const snackbarStore = useSnackbarStore();
    return {
      deletePage,
      snackbarStore,
    };
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    id: {
      type: String,
    },
  },
  methods: {
    async deletePressed(event: Event) {
      try {
        const res = await this.deletePage({ id: this.id });
        const deletedPage = res?.data.deletePage.page;
        if (deletedPage) {
          this.snackbarStore.toggleSnackbar(
            "Page deleted",
            SnackbarColor.success
          );
        }
      } catch (e) {
        console.error(e);
        this.snackbarStore.toggleSnackbar(
          "Failed to delete page",
          SnackbarColor.error
        );
      }
    },
    openMenu(event: Event) {
      console.log("open menu");
    },
  },
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    ProfileMenu,
    EllipsisHorizontalIcon,
    TrashIcon,
  },
});
</script>

<template>
  <div class="relative">
    <button
      class="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
    >
      <slot name="icon" />
      <span
        class="ml-2 inline-block w-28 overflow-hidden text-ellipsis whitespace-nowrap text-left"
        >{{ label }}</span
      >
      <Menu as="div" class="ml-auto">
        <MenuButton
          class="hidden rounded-md p-0.5 hover:bg-gray-200 group-hover:block"
          v-if="id"
          @click="openMenu"
        >
          <EllipsisHorizontalIcon class="h-5 w-5" />
        </MenuButton>
        <MenuItems class="relative bg-white outline-none">
          <div class="absolute w-24 bg-white text-center">
            <MenuItem
              class="rounded-md hover:bg-gray-200"
              as="button"
              @click="deletePressed"
              v-if="id"
            >
              <div class="m-2 flex items-center">
                <TrashIcon class="mx-2 h-4 w-4" />
                <p>Delete</p>
              </div>
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>
    </button>
  </div>
</template>
