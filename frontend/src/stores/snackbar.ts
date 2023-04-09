import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { SnackbarColor } from '@/enums'
export const useSnackbarStore = defineStore('snackbar', () => {

  const showSnackbar = ref(false)
  const snackbarText = ref('')
  const snackbarColor = ref(SnackbarColor.info)
  const toggleSnackbar = (message: string, color?: SnackbarColor) => {
    snackbarText.value = message
    snackbarColor.value = color || SnackbarColor.info
    showSnackbar.value = true
    setTimeout(() => {
      hideSnackbar();
    }, 3000)
    return;
  }
  const hideSnackbar = () => {
    showSnackbar.value = false
  }

  return { showSnackbar, snackbarText, snackbarColor, toggleSnackbar, hideSnackbar }
})
