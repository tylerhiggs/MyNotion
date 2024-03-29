<script lang="ts">
import gql from "graphql-tag";
import { graphql } from "@/gql";
import { ref, computed } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useSnackbarStore } from "@/stores/snackbar";
import { useSelectedPageStore } from "@/stores/selectedPage";
import { SnackbarColor } from "@/enums";
import EmojiPicker from "./EmojiPicker.vue";
import { Menu, MenuButton, MenuItems } from "@headlessui/vue";
import TextContent from "./TextContent.vue";
import { Content_Types } from "@/gql/graphql";
import ContentEditor from "./ContentEditor.vue";
import NavBar from "./NavBar.vue";

const PAGE_QUERY = graphql(`
  query Page($id: ID!) {
    page(id: $id) {
      __typename
      id
      name
      icon
      content {
        edges {
          node {
            __typename
            id
            contentType
            text {
              id
              text
            }
          }
        }
      }
    }
  }
`);

const UPDATE_PAGE = gql`
  mutation UpdatePage($id: ID!, $name: String) {
    updatePage(id: $id, name: $name) {
      page {
        __typename
        id
        name
        icon
      }
    }
  }
`;

const UPDATE_CONTENT = gql`
  mutation UpdatePContent($id: ID!, $text: String!, $index: Int!) {
    updatePageContent(contentId: $id, text: $text, index: $index) {
      pageContent {
        id
        text {
          id
          text
        }
      }
    }
  }
`;

const CREATE_CONTENT = gql`
  mutation CreateContent(
    $pageId: ID!
    $index: Int!
    $contentType: CONTENT_TYPES
  ) {
    addContentToPage(
      pageId: $pageId
      index: $index
      contentType: $contentType
    ) {
      page {
        __typename
        id
        name
        icon
        content {
          edges {
            node {
              id
              contentType
              text {
                id
                text
              }
            }
          }
        }
      }
    }
  }
`;

type Content = {
  id: string;
  contentType: string;
  text: {
    id: string;
    text: string;
  };
};

type Page = {
  page: {
    __typename: string;
    id: string;
    name: string;
    icon: string;
    content: {
      edges: {
        node: Content;
      }[];
    };
  };
};

export default {
  name: "PageContent",
  components: {
    EmojiPicker,
    Menu,
    MenuButton,
    MenuItems,
    TextContent,
    ContentEditor,
    NavBar,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { result, error, onResult } = useQuery<Page>(PAGE_QUERY, props);
    const { mutate: updatePage } = useMutation(UPDATE_PAGE);
    const { mutate: updateContent } = useMutation(UPDATE_CONTENT);
    const { mutate: addContentToPage } = useMutation(CREATE_CONTENT);
    const snackbarStore = useSnackbarStore();
    const title = ref("");
    const contents = computed<Content[]>(
      () => result?.value?.page.content.edges.map((edge) => edge.node) || []
    );
    onResult((res) => {
      title.value = res?.data?.page?.name ?? "";
    });
    const onChange = (event: Event, index: number) => {
      const target = event.target as HTMLElement;
      if (!target?.innerText) return;
    };
    const emojiPickerOpen = ref(false);
    const selectedPageStore = useSelectedPageStore();
    return {
      result,
      error,
      snackbarStore,
      updatePage,
      title,
      emojiPickerOpen,
      contents,
      updateContent,
      onChange,
      addContentToPage,
      selectedPageStore,
    };
  },
  watch: {
    title(newTitle) {
      this.selectedPageStore.setCurrentPageTitle(newTitle);
    },
  },
  methods: {
    async saveTitle() {
      const mutationRes = await this.updatePage({
        id: this.id,
        name: this.title,
      });
      if (mutationRes?.data) {
        this.snackbarStore.toggleSnackbar("Saved!", SnackbarColor.success);
      }
    },
    toggleEmojiPicker() {
      this.emojiPickerOpen = !this.emojiPickerOpen;
    },
    closeEmojiPicker() {
      this.emojiPickerOpen = false;
    },
    /**
     * @param event
     * @param index index should be the index of the current text area
     * @param id content id for the current text area to save it before adding a new one
     */
    async addTextArea(event: Event, index: number, id: string) {
      // Save the current text
      const target = event.target as HTMLElement;
      target.blur();
      try {
        const res = await this.addContentToPage({
          pageId: this.id,
          index: index + 1,
          contentType:
            this.contents[index].contentType === Content_Types.BulletedList
              ? Content_Types.BulletedList
              : Content_Types.Text,
        });
        if (res?.data) {
          // Focus the new text area which will be text area with index + 1
          const newTextArea = document.getElementById(`content-${index + 1}`);
          if (newTextArea) {
            newTextArea.focus();
          }
        } else {
          this.snackbarStore.toggleSnackbar("Error!", SnackbarColor.error);
        }
      } catch (err) {
        console.error(err);
        this.snackbarStore.toggleSnackbar("Error!", SnackbarColor.error);
      }
    },
    async onContentBlur(event: Event, index: number, id: string) {
      const target = event.target as HTMLElement;
      if (!target?.innerText) return;
      const res = await this.updateContent({
        id,
        text: target.innerText,
        index,
      });
      if (res?.data) {
        console.log("saving...");
      } else {
        this.snackbarStore.toggleSnackbar("Error!", SnackbarColor.error);
      }
    },
  },
};
</script>

<style scoped>
input {
  border: none;
  outline: none;
  margin: 0;
  background: none;
  font-size: 2rem;
}

/* 

textarea {
  border: none;
  outline: none;
  margin: 0;
}

.textarea {
  border: none;
  font-family: inherit;
  font-size: inherit;
}

.textarea {
  display: block;
  outline: none;
  width: 100%;
  overflow: hidden;
  min-height: 40px;
  line-height: 20px;
  resize: none;
} */
</style>

<template>
  <NavBar class="w-full" />
  <div class="grid h-screen w-full grid-cols-4 overflow-auto">
    <div
      v-if="id !== '' && result?.page?.id !== undefined"
      class="col-start-2 col-end-5 flex flex-col align-top"
    >
      <div class="pt-24">
        <Menu>
          <MenuButton>
            <button
              v-if="result?.page?.icon !== 'E'"
              @click="toggleEmojiPicker"
              class="rounded-md text-5xl hover:bg-gray-100"
            >
              {{ result?.page?.icon }}
            </button>
            <button
              v-else
              @click="toggleEmojiPicker"
              class="rounded-md p-1 opacity-30 hover:bg-gray-200"
            >
              Add Icon
            </button>
          </MenuButton>
          <MenuItems class="h-72 w-72">
            <EmojiPicker :id="id" class="h-72 w-72" />
          </MenuItems>
        </Menu>
      </div>
      <div class="mb-12 flex w-full justify-between align-top">
        <input
          v-model="title"
          placeholder="Untitled"
          @focusout="saveTitle"
          class="w-full font-bold"
        />
      </div>
      <div v-for="(content, index) in contents">
        <ContentEditor
          :content="content.text.text"
          :contentId="content.id"
          :index="index"
          :initialType="content.contentType"
        />
      </div>
    </div>
  </div>
</template>
