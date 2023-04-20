import { VueRenderer } from '@tiptap/vue-3'
import type { Editor, Range } from '@tiptap/core'
import tippy from 'tippy.js'

import CommandsList from './CommandList.vue'

export default {
  items: ({ query }: { query: string }) => {
    return [
      {
        title: "Text",
        command: ({ editor, range }: { editor: Editor, range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .run()
        }
      },
      {
        title: 'H1',
        command: ({ editor, range }: { editor: Editor, range: Range }) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 1 })
            .run()
        },
      },
      {
        title: 'H2',
        command: ({ editor, range }: { editor: Editor, range: Range}) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 2 })
            .run()
        },
      },
      {
        title: 'H3',
        command: ({ editor, range }: { editor: Editor, range: Range}) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setNode('heading', { level: 3 })
            .run()
        },
      },
      {
        title: 'bold',
        command: ({ editor, range }: { editor: Editor, range: Range}) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setMark('bold')
            .run()
        },
      },
      {
        title: 'italic',
        command: ({ editor, range }: { editor: Editor, range: Range}) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .setMark('italic')
            .run()
        },
      },
      {
        title: "Bulleted List",
        command: ({ editor, range }: { editor: Editor, range: Range}) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleBulletList()
            .run()
        }
      },
      {
        title: "Numbered List",
        command: ({ editor, range }: { editor: Editor, range: Range}) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleOrderedList()
            .run()
        }
      },
      {
        title: "Quote",
        command: ({ editor, range }: { editor: Editor, range: Range}) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleBlockquote()
            .run()
        }
      },
      {
        title: "Code Block",
        command: ({ editor, range }: { editor: Editor, range: Range}) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleCodeBlock()
            .run()
        }
      }
    ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()))
  },

  render: () => {
    let component: any
    let popup: any

    return {
      onStart: (props: any) => {
        component = new VueRenderer(CommandsList, {
          // using vue 2:
          // parent: this,
          // propsData: props,
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props: any) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}