import { computed, getCurrentInstance } from "@nuxtjs/composition-api"

// Helper composable for getting current instance data
// The type of vmData is casted for type completion in usage.
//
// As long as useVmData() is used with the same conditions as getCurrentInstance()
// you should be fine without checking that useVmData().vm is null.
// (see https://v3.vuejs.org/api/composition-api.html#getcurrentinstance)
export const useVmData = <T extends Record<string, any> = Record<string, any>>() => {
  const vm = getCurrentInstance()

  return {
    vm,
    vmData: computed((): T =>(vm?.data || {}) as T), // direct access to this.$data as a computed
  }
}
