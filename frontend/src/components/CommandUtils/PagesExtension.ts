import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import EditorPage from "./EditorPage.vue";
export default Node.create({
  name: "PagesExtension",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      id: {
        default: "",
      },
      name: {
        default: "",
      },
      icon: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "page",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["page", mergeAttributes(HTMLAttributes), 0];
  },

  addNodeView() {
    return VueNodeViewRenderer(EditorPage);
  },
});
