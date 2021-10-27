import { ref } from '@nuxtjs/composition-api'
import { defineStore } from 'pinia'

export const useStore = defineStore('session', () => {
  const myStoreRef = ref('my-store-ref-value')

  function setString(str: string) {
    myStoreRef.value = str
  }

  return { myStoreRef, setString }
})
