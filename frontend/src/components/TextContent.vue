<script lang="ts">
import { ref } from "vue";
import gql from "graphql-tag";
import { useMutation } from "@vue/apollo-composable";
import { useSnackbarStore } from "@/stores/snackbar";
import { SnackbarColor } from "@/enums";

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
    const boldModeOn = ref(false);
    const { mutate: updateContent } = useMutation(UPDATE_CONTENT);
    const { mutate: deleteContent } = useMutation(DELETE_CONTENT);
    const snackbarStore = useSnackbarStore();
    return {
      element,
      type,
      text,
      updateContent,
      snackbarStore,
      boldModeOn,
      deleteContent,
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
  methods: {
    async unfocus(event: Event) {
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
      if (!event.target) return;
      const target = event.target as HTMLElement;
      console.log(`deleting content with innerHTML: "${target.innerHTML}"`);
      if (
        (target.innerHTML.length !== 0 && target.innerHTML !== "<br>") ||
        this.index === 0
      )
        return;
      const res = await this.deleteContent({
        id: this.contentId,
      });
      if (res?.data) {
        console.log("deleted content");
        const nextBackElement = document.getElementById(
          `content-${this.index - 1}`
        );
        const sel = window.getSelection();
        if (nextBackElement && sel) {
          console.log(
            `back element inner html length: "${nextBackElement.innerHTML?.length}"`
          );
          nextBackElement.focus();
          sel.removeAllRanges();
          const range = this.setCursorPosition(
            nextBackElement,
            document.createRange(),
            {
              pos: -1,
              done: false,
            }
          );
          range.collapse(true);
          sel.addRange(range);
        }
      } else {
        this.snackbarStore.toggleSnackbar("Error!", SnackbarColor.error);
      }
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
    onInput() {
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
      if (this.element.innerHTML === "" || this.element.innerHTML === "<br>") {
        this.element.focus();
        return;
      }
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
      let fixedText = this.element.innerHTML.replace(/(\r\n|\n|\r|<br>)/gm, "");
      fixedText = fixedText.replace("<div><br></div>", ""); // new lines not allowed - we create new content instead
      const bold = /\*\*(.+?)\*\*/gm;
      const preBold = fixedText;
      fixedText = fixedText.replace(bold, "<b>$1</b>&nbsp;");
      let cursorRangeAdjustment = preBold === fixedText ? 0 : -3;
      const italic = /([^*]+|^)\*([^*]+?)\*/gm;
      const preItalic = fixedText;
      fixedText = fixedText.replace(italic, "$1<i>$2</i>&nbsp;");
      cursorRangeAdjustment += preItalic === fixedText ? 0 : -1;
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
  <!-- class CONTENT_TYPES(models.TextChoices):
    TEXT = "T", _("Text")
    PAGE = "P", _("Page")
    H1 = "1", _("Heading 1")
    H2 = "2", _("Heading 2")
    H3 = "3", _("Heading 3")
    H4 = "4", _("Heading 4")
    H5 = "5", _("Heading 5")
    H6 = "6", _("Heading 6")
    BULLETED_LIST = "B", _("Bulleted List")
    NUMBERED_LIST = "N", _("Numbered List")
    TODO_LIST = "D", _("To-do List")
    QUOTE = "Q", _("Quote")
    CODE = "C", _("Code") -->
  <div>
    <p
      v-if="type === 'T'"
      ref="element"
      v-once
      contenteditable
      role="textbox"
      class="textarea w-11/12 overflow-y-visible bg-blue-200"
      @focusout="unfocus"
      @input="onInput"
      @keydown.bold="() => (boldModeOn = !boldModeOn)"
      @keydown.delete="deleteContent"
      :id="'content-' + index"
      v-html="text"
    />
    <ul v-if="type === 'B'" :id="'content-' + index"></ul>
  </div>
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
</style>
