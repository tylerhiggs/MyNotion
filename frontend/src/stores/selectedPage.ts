import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useSelectedPageStore = defineStore('selectedPage', () => {
  const selectedPageId = ref("")

  const setSelectedPageId = (id: string) => {
    selectedPageId.value = id
  }
  

  return {selectedPageId, setSelectedPageId}
})