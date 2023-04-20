import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useSearchStore = defineStore('search', () => {

  const isOpen = ref(false)
  const onClose = () => {
    isOpen.value = false
  }
  const onOpen = () => {
    isOpen.value = true
  }

  return { isOpen, onClose, onOpen }
})