<script lang="ts">
import gql from "graphql-tag";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { useSnackbarStore } from "@/stores/snackbar";
import { useSearchStore } from "@/stores/searchStore";
import { useSelectedPageStore } from "@/stores/selectedPage";
import { SnackbarColor } from "@/enums";
import { ref, computed } from "vue";

import {
  ClockIcon,
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
  ChevronRightIcon,
  EllipsisVerticalIcon,
} from "@heroicons/vue/20/solid";
import { DocumentIcon } from "@heroicons/vue/24/outline";
import SidePanelMenuItem from "./SidePanelMenuItem.vue";
import SearchDialog from "./SearchDialog.vue";
import ProfileMenu from "./ProfileMenu.vue";
import EmojiPicker from "./EmojiPicker.vue";
import { graphql } from "@/gql";
import { useAuth0 } from "@auth0/auth0-vue";

const PAGES_QUERY = graphql(`
  query Pages($email: String) {
    pages(isRoot: true, user_Email: $email) {
      edges {
        node {
          __typename
          id
          name
          icon
          isFavorite
          isPublic
          editUsers {
            edges {
              node {
                __typename
                id
                email
              }
            }
          }
        }
      }
    }
  }
`);

const SHARED_PAGES_QUERY = graphql(`
  query SharedPages($email: String!) {
    users(email: $email) {
      edges {
        node {
          __typename
          id
          email
          editablePages {
            edges {
              node {
                __typename
                id
                name
                icon
                isFavorite
                isPublic
              }
            }
          }
        }
      }
    }
  }
`);

const CREATE_PAGE = gql`
  mutation CreatePage($email: String!) {
    createPage(email: $email) {
      page {
        __typename
        id
        name
        icon
        isFavorite
        isPublic
      }
    }
  }
`;

export default {
  name: "SidePannel",
  setup() {
    const { isAuthenticated, user } = useAuth0();

    const { result, error, refetch } = useQuery(PAGES_QUERY, {
      email: user.value.email,
    });
    const { result: sharedResult, error: sharedError } = useQuery(
      SHARED_PAGES_QUERY,
      {
        email: user.value.email || "",
      }
    );
    const privatePagesAndFavs = computed(() => {
      return (result.value?.pages?.edges || [])
        .map((edge) => edge?.node)
        .filter((node) => node?.editUsers.edges.length === 0);
    });
    const sharedPagesAndFavs = computed(() => {
      const sharedWithMe = (sharedResult.value?.users?.edges || []).map(
        (edge) => edge?.node?.editablePages?.edges || []
      );
      const sharedWithMeFlattened =
        sharedWithMe.length == 1
          ? sharedWithMe[0].map((edge) => edge?.node)
          : [];
      const sharedWithOthers = (result.value?.pages?.edges || [])
        .map((edge) => edge?.node)
        .filter((node) => node?.editUsers.edges.length || 0 > 0);
      return [...sharedWithMeFlattened, ...sharedWithOthers];
    });
    const favoritePages = computed(() => {
      const privateFavoritePages = privatePagesAndFavs.value.filter(
        (node) => node?.isFavorite
      );
      const sharedFavoritePages = sharedPagesAndFavs.value.filter(
        (node) => node?.isFavorite
      );
      return [...privateFavoritePages, ...sharedFavoritePages];
    });
    const { mutate: createPage } = useMutation(CREATE_PAGE);
    const snackbarStore = useSnackbarStore();
    const searchStore = useSearchStore();
    const selectedPageStore = useSelectedPageStore();
    const menuOpen = ref(true);
    const privatePages = computed(() => {
      return privatePagesAndFavs.value.filter((node) => !node?.isFavorite);
    });
    const sharedPages = computed(() => {
      return sharedPagesAndFavs.value.filter((node) => !node?.isFavorite);
    });
    return {
      result,
      error,
      createPage,
      snackbarStore,
      menuOpen,
      selectedPageStore,
      refetch,
      isAuthenticated,
      user,
      searchStore,
      favoritePages,
      sharedPages,
      privatePages,
    };
  },
  methods: {
    showSnackbarWaring(message: string) {
      this.snackbarStore.toggleSnackbar(message, SnackbarColor.warning);
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    openPage(pageId?: string) {
      if (!pageId) {
        this.showSnackbarWaring("Unable to open page");
        return;
      }
      const textbox = document.activeElement as HTMLElement;
      if (textbox) {
        textbox.blur();
      }
      this.selectedPageStore.setSelectedPageId("");
      this.selectedPageStore.setSelectedPageId(pageId);
    },
    async createNewPage() {
      if (!this.user.email) {
        this.showSnackbarWaring("Unable to create page: no email");
        console.error(this.user);
        return;
      }
      const res = await this.createPage({
        email: this.user.email,
      });
      const data = res?.data;
      if (data?.createPage?.page?.id) {
        this.openPage(data.createPage.page.id || "");
        this.refetch();
      } else {
        if (data) {
          console.error(data);
        } else {
          console.error(res);
        }
        this.showSnackbarWaring("Unable to create page");
      }
    },
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
    DocumentIcon,
    ChevronRightIcon,
    EmojiPicker,
    ProfileMenu,
    EllipsisVerticalIcon,
    SearchDialog,
  },
};
</script>

<template>
  <!-- The real menu -->
  <div v-if="user.email" class="h-screen w-72 bg-gray-50">
    <div class="h-screen w-full">
      <button
        class="m-1 h-6 w-6 rounded-md bg-black bg-opacity-0 hover:bg-opacity-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        @click="toggleMenu"
      >
        <ChevronDoubleLeftIcon class="h-6 w-6 text-gray-500" />
      </button>
      <!-- Wrap this in a <transition> later -->
      <div class="h-full focus:outline-none" v-show="menuOpen" static>
        <SidePanelMenuItem
          :label="user.email || 'Unknown User'"
          class="mx-1 w-11/12 hover:bg-gray-100"
        >
          <template v-slot:icon>
            <Menu>
              <MenuButton>
                <button class="rounded-md p-0.5 hover:bg-gray-200">
                  <EllipsisVerticalIcon class="h-5 w-5" />
                </button>
              </MenuButton>
              <MenuItems class="realtive">
                <ProfileMenu class="absolute" />
              </MenuItems>
            </Menu>
          </template>
        </SidePanelMenuItem>
        <SidePanelMenuItem
          label="Search"
          class="mx-1 w-11/12 hover:bg-gray-100"
          @click="searchStore.onOpen()"
        >
          <template v-slot:icon>
            <MagnifyingGlassIcon class="h-5 w-5" />
          </template>
        </SidePanelMenuItem>
        <!-- <SidePanelMenuItem
          label="Updates - TODO"
          class="mx-1 w-11/12"
          @click="showSnackbarWaring('Not implemented yet')"
        >
          <template v-slot:icon>
            <ClockIcon class="h-5 w-5" />
          </template>
        </SidePanelMenuItem> -->
        <!-- <SidePanelMenuItem
          label="Settings & members"
          class="mx-1 w-11/12"
          @click="showSnackbarWaring('Not implemented yet')"
        >
          <template v-slot:icon>
            <Cog8ToothIcon class="h-5 w-5" />
          </template>
        </SidePanelMenuItem> -->
        <div
          @click="showSnackbarWaring('Not implemented yet')"
          class="w-full cursor-pointer"
          v-if="favoritePages.length"
        >
          <b
            class="ml-2 mt-4 inline-block rounded-md bg-inherit p-0.5 text-gray-400 hover:bg-gray-100"
            >Favorites</b
          >
        </div>
        <div v-for="page in favoritePages || []" :key="page?.id || ''">
          <SidePanelMenuItem
            :label="
              selectedPageStore.selectedPageId === page?.id
                ? selectedPageStore.currentPageTitle
                : page?.name || 'Unknown'
            "
            :id="page?.id"
            :refetch="refetch"
            class="mx-1 w-11/12 rounded-md hover:bg-gray-100"
            :class="
              selectedPageStore.selectedPageId === page?.id ? 'bg-gray-100' : ''
            "
            @click="openPage(page?.id)"
          >
            <template v-slot:icon>
              <Menu>
                <MenuButton>
                  <button class="rounded-md p-0.5 hover:bg-gray-200">
                    <DocumentIcon
                      v-if="!page?.icon || page?.icon === 'E'"
                      class="h-5 w-5"
                    />
                    <p v-else>{{ page?.icon }}</p>
                  </button>
                </MenuButton>
                <MenuItems class="relative">
                  <EmojiPicker class="absolute" :id="page?.id || ''" />
                </MenuItems>
              </Menu>
            </template>
          </SidePanelMenuItem>
        </div>
        <div
          @click="showSnackbarWaring('Not implemented yet')"
          class="w-full cursor-pointer"
          v-if="sharedPages.length"
        >
          <b
            class="ml-2 mt-4 inline-block rounded-md bg-inherit p-0.5 text-gray-400 hover:bg-gray-100"
            >Shared</b
          >
        </div>
        <!-- Shared pages v-fored with their emojis as icons-->
        <div class="w-full cursor-pointer">
          <div class="ml-2 mt-4 flex justify-between text-gray-400">
            <b class="rounded-md bg-inherit p-0.5 hover:bg-gray-100">Private</b>
            <button
              type="button"
              class="mr-2 h-5 w-5 rounded-md bg-inherit hover:bg-gray-100"
              @click="createNewPage"
            >
              <PlusIcon class="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        <p v-if="error">{{ error }}</p>
        <div v-else v-for="page in privatePages || []" :key="page?.id || ''">
          <SidePanelMenuItem
            :label="
              selectedPageStore.selectedPageId === page?.id
                ? selectedPageStore.currentPageTitle
                : page?.name || 'Unknown'
            "
            :id="page?.id"
            :refetch="refetch"
            class="mx-1 w-11/12 rounded-md hover:bg-gray-100"
            :class="
              selectedPageStore.selectedPageId === page?.id ? 'bg-gray-100' : ''
            "
            @click="openPage(page?.id)"
          >
            <template v-slot:icon>
              <Menu>
                <MenuButton>
                  <button class="rounded-md p-0.5 hover:bg-gray-200">
                    <DocumentIcon
                      v-if="!page?.icon || page?.icon === 'E'"
                      class="h-5 w-5"
                    />
                    <p v-else>{{ page?.icon }}</p>
                  </button>
                </MenuButton>
                <MenuItems class="relative">
                  <EmojiPicker class="absolute" :id="page?.id || ''" />
                </MenuItems>
              </Menu>
            </template>
          </SidePanelMenuItem>
        </div>
      </div>
    </div>
  </div>
</template>
