<script lang="ts">
import { useEditor, EditorContent, FloatingMenu } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import PagesExtension from "./CommandUtils/PagesExtension";
import gql from "graphql-tag";
import { useMutation } from "@vue/apollo-composable";
import { useSnackbarStore } from "@/stores/snackbar";
import { SnackbarColor } from "@/enums";
import Commands from "./CommandUtils/commands";
import suggestion from "./CommandUtils/suggestion";
import { ref } from "vue";

const UPDATE_CONTENT = gql`
  mutation UpdateContentNew($id: ID!, $text: String!, $index: Int!) {
    updatePageContent(contentId: $id, text: $text, index: $index) {
      pageContent {
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
`;

export default {
  components: {
    EditorContent,
    FloatingMenu,
  },
  props: {
    content: {
      type: String,
      required: true,
    },
    contentId: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    initialType: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const lastLocalUpdate = ref(Date.now());
    const { mutate: updateContent } = useMutation(UPDATE_CONTENT);
    const snackbarStore = useSnackbarStore();
    const editor = useEditor({
      extensions: [
        StarterKit,
        Highlight,
        Typography,
        PagesExtension,
        Commands.configure({
          suggestion,
        }),
      ],
      content: props.content,
      onUpdate: () => {
        // save after there has been more than 2 seconds of inactivity
        lastLocalUpdate.value = Date.now();
        setTimeout(async () => {
          const now = Date.now();
          if (now - lastLocalUpdate.value <= 2000) {
            return;
          }
          console.log(`saving "${editor.value?.getHTML()}"`);
          try {
            const res = await updateContent({
              id: props.contentId,
              text: editor.value?.getHTML(),
              index: props.index,
            });
            if (res?.errors) {
              console.error(res.errors);
              snackbarStore.toggleSnackbar(
                "Failed to save content",
                SnackbarColor.error
              );
            }
          } catch (e) {
            console.error(e);
            snackbarStore.toggleSnackbar(
              "Failed to save content",
              SnackbarColor.error
            );
          }
        }, 2000);
      },
      editorProps: {
        attributes: {
          class:
            "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none h-screen",
        },
      },
    });

    return {
      editor,
      updateContent,
      snackbarStore,
    };
  },
  watch: {
    content(newContent) {
      const isSame = this.editor?.getHTML() === newContent;
      if (isSame) {
        return;
      }
      this.editor?.commands.setContent(newContent);
    },
  },
  methods: {
    async saveContent() {
      console.log(`saving "${this.editor?.getHTML()}"`);
      try {
        const res = await this.updateContent({
          id: this.contentId,
          text: this.editor?.getHTML(),
          index: this.index,
        });
        if (res?.errors) {
          console.error(res.errors);
          this.snackbarStore.toggleSnackbar(
            "Failed to save content",
            SnackbarColor.error
          );
        }
      } catch (e) {
        console.error(e);
        this.snackbarStore.toggleSnackbar(
          "Failed to save content",
          SnackbarColor.error
        );
      }
    },
  },
};
</script>

<template>
  <div v-if="editor !== undefined">
    <FloatingMenu :editor="editor" class="text-gray-300">
      <p>Press / for commands</p>
      <!-- <button
        class="button"
        :class="{ 'button--active': editor.isActive('bold') }"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        Bold
      </button>
      <button
        class="button"
        :class="{ 'button--active': editor.isActive('italic') }"
        @click="editor?.chain().focus().toggleItalic().run()"
      >
        Italic
      </button>
      <button
        class="button"
        :class="{ 'button--active': editor.isActive('strike') }"
        @click="editor?.chain().focus().toggleStrike().run()"
      >
        Strike
      </button>
      <button
        class="button"
        :class="{ 'button--active': editor.isActive('code') }"
        @click="editor?.chain().focus().toggleCode().run()"
      >
        Code
      </button>
      <button
        class="button"
        :class="{ 'button--active': editor.isActive('heading', { level: 1 }) }"
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        H1
      </button>
      <button
        class="button"
        :class="{ 'button--active': editor.isActive('heading', { level: 2 }) }"
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </button>
      <button
        class="button"
        :class="{ 'button--active': editor.isActive('heading', { level: 3 }) }"
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        H3
      </button> -->
    </FloatingMenu>
  </div>
  <EditorContent
    :editor="editor"
    @keydown.tab="(e) => e.preventDefault()"
    @focusout="saveContent"
  />
</template>
