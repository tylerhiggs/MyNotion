<script lang="ts">
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import gql from "graphql-tag";
import { useMutation } from "@vue/apollo-composable";
import { useSnackbarStore } from "@/stores/snackbar";
import { SnackbarColor } from "@/enums";

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
    const editor = useEditor({
      extensions: [StarterKit, Highlight, Typography],
      content: props.content,
      onUpdate: () => {
        console.log(editor.value?.getHTML());
      },
      editorProps: {
        attributes: {
          class:
            "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none h-screen",
        },
      },
    });

    const { mutate: updateContent } = useMutation(UPDATE_CONTENT);
    const snackbarStore = useSnackbarStore();

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
        if (res?.data) {
          this.snackbarStore.toggleSnackbar(
            "Content saved",
            SnackbarColor.success
          );
        }
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
  <EditorContent
    :editor="editor"
    @keydown.tab="(e) => e.preventDefault()"
    @focusout="saveContent"
  />
</template>
