<template>
  <div>
  <h1>Other page</h1>
  <NuxtLink to="/">
    Homepage (internal link that belongs to the Nuxt App)
  </NuxtLink>
  <a href="https://nuxtjs.org">External Link to another page</a>
</div>
</template>

<script>
  import { defineComponent } from '@nuxtjs/composition-api'

  export default defineComponent({
    name: 'Other',
  })
</script>
