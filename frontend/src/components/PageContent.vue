<script lang="ts">
import gql from "graphql-tag";
import { ref, computed } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useSnackbarStore } from "@/stores/snackbar";
import { SnackbarColor } from "@/enums";
import EmojiPicker from "./EmojiPicker.vue";
import { Menu, MenuButton, MenuItems } from "@headlessui/vue";

const PAGE_QUERY = gql`
  query Page($id: ID!) {
    page(id: $id) {
      __typename
      id
      name
      icon
      content {
        edges {
          node {
            id
            text {
              id
              text
            }
          }
        }
      }
    }
  }
`;

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
  mutation UpdateContent($id: ID!, $text: String!, $index: Int!) {
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

type Page = {
  page: {
    __typename: string;
    id: string;
    name: string;
    icon: string;
    content: {
      edges: {
        node: {
          id: string;
          text: {
            id: string;
            text: string;
          };
        };
      }[];
    };
  };
};

type Content = {
  id: string;
  text: {
    id: string;
    text: string;
  };
};

export default {
  name: "PageContent",
  components: {
    EmojiPicker,
    Menu,
    MenuButton,
    MenuItems,
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
    const snackbarStore = useSnackbarStore();
    const title = ref("");
    const content = ref<Content[]>([]);
    onResult((res) => {
      title.value = res?.data?.page?.name ?? "";
      content.value = (result.value?.page?.content?.edges || []).map(
        (edge) => edge.node
      );
    });
    const emojiPickerOpen = ref(false);
    return {
      result,
      error,
      snackbarStore,
      updatePage,
      title,
      emojiPickerOpen,
      content,
      updateContent,
    };
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
    addTextArea() {
      console.log("add text area");
    },
    onChange(event: Event, index: number) {
      const target = event.target as HTMLElement;
      if (!target?.innerText) return;
      this.snackbarStore.toggleSnackbar(
        `Saving for index ${index} with ${target.innerText}`,
        SnackbarColor.info
      );
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

textarea {
  border: none;
  outline: none;
  margin: 0;
}

.textarea {
  border: none;
  font-family: inherit;
  font-size: inherit;
  background: none;
}

.textarea {
  display: block;
  outline: none;
  width: 100%;
  overflow: hidden;
  min-height: 40px;
  line-height: 20px;
  resize: none;
}
</style>

<template>
  <div class="grid h-screen w-full grid-cols-4">
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
              class="rounded-md hover:bg-gray-100"
            >
              {{ emojiPickerOpen ? "Close" : "Add icon" }}
            </button>
          </MenuButton>
          <MenuItems class="h-72 w-72">
            <EmojiPicker :id="id" class="h-72 w-72" />
          </MenuItems>
        </Menu>
      </div>
      <div class="flex w-full justify-between align-top">
        <input
          v-model="title"
          v-on:keyup.enter="saveTitle"
          class="w-full font-bold"
        />
      </div>
      <p
        v-for="(edge, index) in result?.page?.content?.edges"
        role="textbox"
        class="textarea mt-12 w-11/12 overflow-y-visible"
        contenteditable
        @keyup="onChange($event, index)"
        @focusout="onContentBlur($event, index, edge.node.id)"
      >
        {{ edge.node.text.text }}
      </p>
    </div>
  </div>
</template>
