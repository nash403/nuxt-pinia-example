// import { reactive, toRefs } from '@nuxtjs/composition-api'
// import { ref, Ref } from '@nuxtjs/composition-api'
import { defineStore } from 'pinia'

// Doesn't work when data updated in asyncData
// export const useStore = defineStore('session', () => {
//   const state: { myStoreRef: string; userFromApi: any } = reactive({
//     myStoreRef: 'my-store-ref-value',
//     userFromApi: null,
//   })

//   function setString(str: string) {
//     state.myStoreRef = str
//   }

//   return { ...toRefs(state), setString }
// })

// Doesn't work when data updated in asyncData
// export const useStore = defineStore('session', function () {
//   const myStoreRef = ref('my-store-ref-value')
//   const userFromApi: Ref<any> = ref(null)

//   function setString(str: string) {
//     myStoreRef.value = str
//   }

//   return { userFromApi, myStoreRef, setString }
// })

// Works when data updated in asyncData
export const useStore = defineStore('session', {
  state: (): { myStoreRef: string; userFromApi: any } => ({
    myStoreRef: 'my-store-ref-value',
    userFromApi: null,
  }),
  actions: {
    setString(str: string) {
      this.myStoreRef = str
    }
  }
})
