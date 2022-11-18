# MyNotion

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### CSS styling with [Tailwind CSS](https://tailwindcss.com/)
* Try the playground [here](https://play.tailwindcss.com/)
* Set up editor [here](https://tailwindcss.com/docs/editor-setup)
* Designed to work well with Tailwind:
    * See the [Headless UI](https://headlessui.com/)
    * See the [Heroicons](https://heroicons.com/) for icons

#### Heroicons
```vue
<template>
    ...
    <BeakerIcon class="h-6 w-6 text-blue-500"/>
    ...
</template>
<script>
import { BeakerIcon } from '@heroicons/vue/24/solid'

export default {
  components: { BeakerIcon }
}
</script>
```
The 24x24 outline icons can be imported from `@heroicons/vue/24/outline`, the 24x24 solid icons can be imported from `@heroicons/vue/24/solid`, and the 20x20 solid icons can be imported from `@heroicons/vue/20/solid`.

Icons use an upper camel case naming convention and are always suffixed with the word Icon.


## Appolo GraphQL
https://v4.apollo.vuejs.org/guide-composable/query.html#polling

## Maybe host here:

https://railway.app/
