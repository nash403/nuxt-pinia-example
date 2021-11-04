<template>
<div>
  <div>
    {{'myGlobalRef:'}} <pre>{{ myGlobalRef }}</pre>
    <hr>
    {{'myStoreRef:'}} <pre>{{ aStore.myStoreRef }}</pre>
    <hr>
    {{'asyncData user:'}} <pre>{{ user }}</pre>
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
import { ssrRef, defineComponent, useRoute, getCurrentInstance, computed } from '@nuxtjs/composition-api'
import { useStore } from "~/domain/store";
import { useComposable } from "~/domain/composable";

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

    const vm = getCurrentInstance() // to get info returned from asyncData

    // example of computed with data coming from asyncData
    const userNameWithCount = computed(() => {
      const userName = (vm?.data?.user as any)?.name // fields of vm.data will not be properly typed so the cast is necessary
      return `${userName} (count: ${counter.value})`
    })

    // method that changes data from asyncData to demonstrate that the computed works fine
    const changeUser = async () => {
      if (vm) {
        const { user } = await fetchData(true)
        vm.data.user = user
        console.log(`user changed to ${user.name}`)
      } else {
        console.error('something went wrong, this should not arrive in normal execution flow')
      }
    }

    return {
      aStore,
      myGlobalRef,
      counter,
      increment,
      decrement,
      userNameWithCount,
      changeUser,
    }
  },
  async asyncData () {
    const composable = useComposable()

    // The following commented call breaks asyncData because useContext is used in the implementation,
    // and useContext can only be called in the setup function.
    // Uncomment for demo.
    // composable.fnThatBreaksAsyncData()
    // composable.fnThatBreaksAsyncData({ isDev: false }) // with a default param we can avoid the failure

    const { user } = await composable.fetchData()
    return { user }
  }
})
</script>
