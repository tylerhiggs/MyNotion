<script lang="ts">
import { ref, computed } from "vue";
import gql from "graphql-tag";
import { useMutation } from "@vue/apollo-composable";
import { useSnackbarStore } from "@/stores/snackbar";
import { SnackbarColor } from "@/enums";
import { Content_Types } from "@/gql/graphql";
import type { UpdateContentMutationVariables } from "@/gql/graphql";

const UPDATE_CONTENT = gql`
  mutation UpdateContent(
    $id: ID!
    $text: String!
    $index: Int!
    $type: CONTENT_TYPES
  ) {
    updatePageContent(
      contentId: $id
      text: $text
      index: $index
      contentType: $type
    ) {
      pageContent {
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

const DELETE_CONTENT = gql`
  mutation DeleteContent($id: ID!) {
    removeContentFromPage(contentId: $id) {
      page {
        __typename
        id
        content {
          edges {
            node {
              __typename
              id
            }
          }
        }
      }
    }
  }
`;

export default {
  setup(props) {
    const element = ref<HTMLElement | null>(null);
    const type = ref(props.initialType);
    const text = ref(props.initialText);
    const nextTypeIsBold = ref(false);
    const nextTypeIsItalic = ref(false);
    const { mutate: updateContent } = useMutation(UPDATE_CONTENT);
    const { mutate: deleteContent } = useMutation(DELETE_CONTENT);
    const snackbarStore = useSnackbarStore();
    const isText = computed(() => type.value === Content_Types.Text);
    const isBullet = computed(() => type.value === Content_Types.BulletedList);
    return {
      element,
      type,
      text,
      updateContent,
      snackbarStore,
      nextTypeIsBold,
      nextTypeIsItalic,
      deleteContent,
      isText,
      isBullet,
    };
  },
  props: {
    initialType: {
      type: String,
      required: true,
    },
    initialText: {
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
  },
  watch: {
    initialText(newText) {
      console.log(this.text, newText);
      this.text = newText;
      if (this.element) this.element.innerHTML = newText;
    },
    initialType(newType) {
      console.log("updating type to: ", newType);
      this.type = newType;
    },
  },
  methods: {
    async unfocus() {
      if (!this.element) return;
      this.element.blur();
      console.log("unfocusing with text: ", this.text);
      const res = await this.updateContent({
        id: this.contentId,
        text: this.text,
        index: this.index,
      });
      if (res?.data) {
        console.log("saving...");
      } else {
        this.snackbarStore.toggleSnackbar("Error!", SnackbarColor.error);
      }
    },
    async deleteContent(event: Event) {
      console.log("time to delete");
    },
    focus() {
      if (this.element) this.element.focus();
    },
    getCursorPosition(
      parent: ChildNode,
      node: Node,
      offset: number,
      stat: { pos: number; done: boolean }
    ) {
      if (stat.done) return stat;

      let currentNode = null;
      if (parent.childNodes.length == 0 && parent.textContent) {
        stat.pos += parent.textContent.length;
      } else {
        for (let i = 0; i < parent.childNodes.length && !stat.done; i++) {
          currentNode = parent.childNodes[i];
          if (currentNode === node) {
            stat.pos += offset;
            stat.done = true;
            return stat;
          } else this.getCursorPosition(currentNode, node, offset, stat);
        }
      }
      return stat;
    },
    setCursorPosition(
      parent: Node,
      range: Range,
      stat: { pos: number; done: boolean }
    ) {
      if (stat.done) {
        range.setStart(parent, range.startOffset);
      }
      if (stat.pos < 0 && parent.textContent) {
        // place the cursor at the end of the element + pos + 1
        if (parent.childNodes.length === 0) {
          range.setStart(parent, parent.textContent.length + stat.pos + 1);
          return range;
        } else {
          this.setCursorPosition(
            parent.childNodes[parent.childNodes.length - 1],
            range,
            {
              pos: stat.pos,
              done: false,
            }
          );
        }
      }

      if (parent.childNodes.length === 0 && parent.textContent) {
        if (parent.textContent.length >= stat.pos) {
          range.setStart(parent, stat.pos);
          stat.done = true;
        } else {
          stat.pos = stat.pos - parent.textContent.length;
        }
      } else {
        for (let i = 0; i < parent.childNodes.length && !stat.done; i++) {
          let currentNode = parent.childNodes[i];
          this.setCursorPosition(currentNode, range, stat);
        }
      }
      return range;
    },
    async onInput(_?: Event, mannualInput?: string) {
      if (!this.element) return;
      // lets get the cursor position
      const sel = window.getSelection();
      if (!sel) {
        this.snackbarStore.toggleSnackbar(
          "Error getting selection!",
          SnackbarColor.error
        );
        return;
      }
      // check if blank to skip and remove weird errors
      console.log(`onInput: ${this.element.innerHTML}`);
      const node = sel.focusNode;
      if (!node) {
        this.snackbarStore.toggleSnackbar(
          "Error getting focus node!",
          SnackbarColor.error
        );
        return;
      }
      const offset = sel.focusOffset;
      const pos = this.getCursorPosition(this.element, node, offset, {
        pos: 0,
        done: false,
      });
      if (offset === 0) pos.pos += 0.5;
      // parse the text
      let fixedText = mannualInput || this.element.innerHTML;
      let cursorRangeAdjustment = 0;
      const bold = /\*\*(.+?)\*\*/gm;
      const otherBold = /\_\_(.+?)\_\_/gm;
      const preBold = fixedText;
      if (this.nextTypeIsBold) {
        this.nextTypeIsBold = false;
      }
      fixedText = fixedText.replace(bold, "<b>$1</b>&nbsp;");
      fixedText = fixedText.replace(otherBold, "<b>$1</b>&nbsp;");
      cursorRangeAdjustment += preBold === fixedText ? 0 : -3;
      const italic = /([^*]+|^)\*([^*]+?)\*/gm;
      const otherItalic = /([^_]+|^)\_([^_]+?)\_/gm;
      const preItalic = fixedText;
      fixedText = fixedText.replace(italic, "$1<i>$2</i>&nbsp;");
      fixedText = fixedText.replace(otherItalic, "$1<i>$2</i>&nbsp;");
      cursorRangeAdjustment += preItalic === fixedText ? 0 : -1;
      // const code = /`(.+?)`/gm;

      if (fixedText !== this.element.innerHTML) {
        this.element.innerHTML = fixedText;
      }
      this.text = this.element.innerHTML;
      // set the cursor position
      sel.removeAllRanges();
      const range = this.setCursorPosition(
        this.element,
        document.createRange(),
        {
          pos: pos.pos + cursorRangeAdjustment,
          done: false,
        }
      );
      range.collapse(true);
      sel.addRange(range);
    },
  },
};
</script>

<template>
  <div
    ref="element"
    v-once
    contenteditable
    role="textbox"
    class="textarea w-11/12 overflow-y-visible bg-blue-200"
    @focusout="unfocus"
    @input="onInput"
    @keydown.cmd.b="() => (nextTypeIsBold = !nextTypeIsBold)"
    @keydown.delete="deleteContent"
    :id="'content-' + index"
    v-html="text"
  />
  <!-- <div v-if="isText">
      <p
        ref="element"
        v-once
        contenteditable
        role="textbox"
        class="textarea w-11/12 overflow-y-visible bg-blue-200"
        @focusout="unfocus"
        @input="onInput"
        @keydown.cmd.b="() => (nextTypeIsBold = !nextTypeIsBold)"
        @keydown.delete="deleteContent"
        :id="'content-' + index"
        v-html="text"
      />
    </div>
    <div v-if="isBullet">
      <li
        v-if="isBullet"
        ref="element"
        v-once
        contenteditable
        role="textbox"
        class="li textarea w-11/12 overflow-y-visible bg-blue-200"
        @focusout="unfocus"
        @input="onInput"
        @keydown.cmd.b="() => (nextTypeIsBold = !nextTypeIsBold)"
        @keydown.delete="deleteContent"
        :id="'content-' + index"
        v-html="text"
      />
    </div> -->
</template>

<style scoped>
.textarea {
  border: none;
  font-family: inherit;
  font-size: inherit;
  display: block;
  outline: none;
  width: 100%;
  overflow: hidden;
  min-height: 40px;
  line-height: 20px;
  resize: none;
}
.li {
  display: list-item;
}
</style>
