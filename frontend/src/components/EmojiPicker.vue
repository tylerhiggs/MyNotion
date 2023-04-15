<template>
  <div class="z-100 h-72 w-72">
    <div class="justify-left relative flex align-middle">
      <input
        v-model="search"
        type="text"
        class="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
        placeholder="Filter..."
      />
      <div class="absolute top-2 left-2 justify-start align-middle">
        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
      </div>
    </div>
    <div
      class="absolute z-10 mt-1 h-72 w-72 overflow-y-auto rounded-md bg-white shadow-lg"
    >
      <div v-for="(emojis, category) in filteredEmojis" :key="category">
        <h2 v-if="emojis.length" class="p-2 text-lg font-bold">
          {{ category }}
        </h2>
        <hr v-if="emojis.length" class="border-gray-300" />
        <div class="grid w-full grid-cols-6 p-2">
          <template v-for="emoji in emojis" :key="category">
            <button
              @click="selectEmoji(emoji.char)"
              class="h-1 w-1 rounded-md hover:bg-gray-200"
            >
              <p class="text-sm">{{ emoji.char }}</p>
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from "vue";
import { EmojiData } from "emoji-data-ts";
import type { Emoji } from "emoji-data-ts";
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

const UPDATE_ICON = gql`
  mutation UpdatePageCopy($id: ID!, $icon: String) {
    updatePage(id: $id, icon: $icon) {
      page {
        __typename
        id
        name
        icon
      }
    }
  }
`;

export default {
  components: {
    MagnifyingGlassIcon,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const emojiData = new EmojiData();
    const { mutate: updateIcon } = useMutation(UPDATE_ICON);

    const search = ref("");
    const filteredEmojis = computed(() =>
      [...emojiData.emojiCategoryLookUp.entries()].reduce(
        (accum, [key, value]) => ({
          ...accum,
          [key]: value.filter((emoji) =>
            emoji.short_names.some((name) =>
              name.toLocaleLowerCase().includes(search.value.toLowerCase())
            )
          ),
        }),
        {} as Record<string, Emoji[]>
      )
    );
    return {
      search,
      filteredEmojis,
      updateIcon,
    };
  },
  methods: {
    onClose() {
      return;
    },
    async selectEmoji(icon: string) {
      const res = await this.updateIcon({
        id: this.id,
        icon,
      });
      if (res?.data) {
        console.log("Icon updated successfully");
      } else {
        console.log("Icon update failed");
        if (res?.errors) {
          console.error(res.errors);
        }
      }
      this.onClose();
    },
  },
};
</script>

<style scoped>
button {
  font-size: 1.5rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
