import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSelectedPageStore = defineStore('selectedPage', () => {
  const selectedPageId = ref("")

  const setSelectedPageId = (id: string) => {
    selectedPageId.value = id
  }

  const currentPageIcon = ref("");
  const currentPageTitle = ref("");
  
  const setCurrentPageIcon = (icon: string) => {
    currentPageIcon.value = icon
  }
  const setCurrentPageTitle = (title: string) => {
    currentPageTitle.value = title
  }

  return {
    selectedPageId,
    setSelectedPageId,
    currentPageIcon,
    currentPageTitle,
    setCurrentPageIcon,
    setCurrentPageTitle,
  }
})