import Vue from 'vue'
import { createPinia, setActivePinia, PiniaVuePlugin } from 'pinia'
import type { Plugin } from '@nuxt/types'

Vue.use(PiniaVuePlugin)

const PiniaNuxtPlugin: Plugin = (context, inject) => {
  const pinia = createPinia()
  context.app.pinia = pinia

  // make sure to inject pinia after installing the plugin because in Nuxt 3, inject defines a non configurable getter
  // on app.config.globalProperties
  // add $pinia to the context
  inject('pinia', pinia)
  // to allow accessing pinia without the $
  // TODO: remove this in deprecation
  context.pinia = pinia

  setActivePinia(pinia)

  // add access to `$nuxt`
  // TODO: adapt to Nuxt 3 with a definePlugin
  pinia._p.push(({ store }) => {
    // make it non enumerable so it avoids any serialization and devtools
    Object.defineProperty(store, '$nuxt', { value: context })
  })

  if (process.server) {
    context.beforeNuxtRender(({ nuxtState }) => {
      nuxtState.pinia = pinia.state.value
    })
  } else if (context.nuxtState && context.nuxtState.pinia) {
    pinia.state.value = context.nuxtState.pinia
  }
}

export default PiniaNuxtPlugin
