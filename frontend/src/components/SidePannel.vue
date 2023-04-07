<script lang="ts">
import gql from "graphql-tag";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import {
  ClockIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronDoubleLeftIcon,
  ArchiveBoxIcon,
  DocumentDuplicateIcon,
  ArrowUpOnSquareStackIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  Cog8ToothIcon,
} from "@heroicons/vue/20/solid";
import SidePanelMenuItem from "./SidePanelMenuItem.vue";

const PAGE_QUERY = gql`
  query Pages {
    pages {
      id
      name
    }
  }
`;

const CREATE_PAGE = gql`
  mutation CreatePage($name: String!) {
    createPage(name: $name) {
      id
    }
  }
`;

export default {
  name: "SidePannel",
  setup() {
    const { result, error } = useQuery(PAGE_QUERY);
    const { mutate: createPage } = useMutation(CREATE_PAGE);
    return {
      result,
      error,
      createPage,
    };
  },
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    SidePanelMenuItem,
    ChevronDownIcon,
    ArchiveIcon: ArchiveBoxIcon,
    DuplicateIcon: DocumentDuplicateIcon,
    MoveIcon: ArrowUpOnSquareStackIcon,
    EditIcon: PencilSquareIcon,
    DeleteIcon: TrashIcon,
    PlusIcon,
    ChevronDoubleLeftIcon,
    UserIcon,
    MagnifyingGlassIcon,
    ClockIcon,
    Cog8ToothIcon,
  },
};
</script>

<template>
  <!-- The real menu -->
  <div class="w-72 bg-gray-50">
    <Menu as="div" class="w-72">
      <MenuButton
        class="m-1 h-6 w-6 rounded-md bg-black bg-opacity-0 hover:bg-opacity-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        <ChevronDoubleLeftIcon class="h-6 w-6 text-gray-500" />
      </MenuButton>
      <!-- Wrap this in a <transition> later -->
      <MenuItems class="focus:outline-none">
        <SidePanelMenuItem label="Profile - TODO" class="mx-1 w-11/12">
          <template v-slot:icon>
            <UserIcon class="h-5 w-5" />
          </template>
        </SidePanelMenuItem>
        <SidePanelMenuItem label="Search - TODO" class="mx-1 w-11/12">
          <template v-slot:icon>
            <MagnifyingGlassIcon class="h-5 w-5" />
          </template>
        </SidePanelMenuItem>
        <SidePanelMenuItem label="Updates - TODO" class="mx-1 w-11/12">
          <template v-slot:icon>
            <ClockIcon class="h-5 w-5" />
          </template>
        </SidePanelMenuItem>
        <SidePanelMenuItem label="Settings & members" class="mx-1 w-11/12">
          <template v-slot:icon>
            <Cog8ToothIcon class="h-5 w-5" />
          </template>
        </SidePanelMenuItem>
        <MenuItem>
          <b class="ml-2 mt-4 inline-block text-gray-400">Shared</b>
        </MenuItem>
        <!-- Shared pages v-fored with their emojis as icons-->
        <MenuItem>
          <div class="ml-2 mt-4 flex justify-between text-gray-400">
            <b class="rounded-sm bg-inherit p-0.5 hover:bg-gray-100">Private</b>
            <button
              type="button"
              class="mr-2 h-5 w-5 rounded-sm bg-inherit hover:bg-gray-100"
            >
              <PlusIcon class="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </MenuItem>
        <p v-if="error">{{ error }}</p>
        <div v-else v-for="page in result?.pages || []" :key="page.name">
          <SidePanelMenuItem :label="page.name" class="mx-1 w-11/12">
            <template v-slot:icon>
              <DocumentIcon class="h-5 w-5">📄</DocumentIcon>
            </template>
          </SidePanelMenuItem>
        </div>
      </MenuItems>
    </Menu>
  </div>
  <h3>Shared</h3>
</template>
