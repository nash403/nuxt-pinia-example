<template>
<div>
  <h1>Home page</h1>
  <p>
    <NuxtLink to="/other">
      Other page (internal link that belongs to the Nuxt App)
    </NuxtLink>
  </p>
  <div>
    {{'myGlobalRef:'}} <pre>{{ myGlobalRef }}</pre>
    <hr>
    {{'myStoreRef:'}} <pre>{{ aStore.myStoreRef }}</pre>
    <hr>
    {{'asyncData user:'}} <pre>{{ user }}</pre>
    <hr>
    <div>
      <p>{{'store user:'}} <pre>{{ aStore.userFromApi }}</pre></p>
      <button @click="changeStoreUser">
        change store username
      </button>
    </div>
    <hr>
    {{'userNameWithCount:'}} <pre>"{{ userNameWithCount }}"</pre>
    <div>
      <p>Counter : {{ counter }}</p>
      <button @click="increment">
        Increment
      </button>
      <button @click="decrement">
        Decrement
      </button>
      <p></p>
      <button @click="changeUser">
        change username
      </button>
    </div>
  </div>
  <Tutorial/>
</div>
</template>

<script lang="ts">
import { ssrRef, defineComponent, useRoute, computed } from '@nuxtjs/composition-api'
import { useStore } from "~/domain/store";
import { useComposable, User } from "~/domain/composable";
import { useVmData } from "~/domain/vm";

const myGlobalRef = ssrRef('my-ref-value') // to test cross-user server state pollution

export default defineComponent({
  setup() {
    const aStore = useStore()
    const { counter, increment, decrement, fetchData } = useComposable()

    const route = useRoute()

    if (route.value.query.ref) {
      // demonstrate difference between ssrRef and pinia store in term of cross-user server state pollution
      myGlobalRef.value = route.value.query.ref as string
      aStore.setString(route.value.query.ref as string)
    }
    const { vmData } = useVmData<{ user: User }>() // to get info returned from asyncData with type completion

    // example of computed with data coming from asyncData
    const userNameWithCount = computed(() => {
      const userName = vmData.value.user.name
      return `${userName} (count: ${counter.value})`
    })

    // method that changes data from asyncData to demonstrate that the computed works fine
    const changeUser = async () => {
      const { user } = await fetchData(true)
      vmData.value.user = user
      // Object.assign(vmData.value, { user }) // Use Object.assign() to replace multiple properties of vm.data at the same time
      console.log(`user changed to ${user.name}`)
    }

    const changeStoreUser = async () => {
        const { user } = await fetchData(true)
        aStore.userFromApi = user
        console.log(`user store changed to ${user.name}`)
    }

    return {
      aStore,
      myGlobalRef,
      counter,
      increment,
      decrement,
      userNameWithCount,
      changeUser,
      changeStoreUser,
    }
  },
  async asyncData ({ $pinia }) {
    const composable = useComposable()
    const store = useStore($pinia)

    // The following commented call breaks asyncData because useContext is used in the implementation,
    // and useContext can only be called in the setup function.
    // Uncomment for demo.
    // composable.fnThatBreaksAsyncData()
    // composable.fnThatBreaksAsyncData({ isDev: false }) // with a default param we can avoid the failure

    if (!store.userFromApi.name) {
      const { user } = await composable.fetchData()
      store.userFromApi = user
    }
    return { user: store.userFromApi }
  }
})
</script>
