import { ref, useContext } from "@nuxtjs/composition-api"

export const useComposable = () => {
  const counter = ref(0)

  const increment = () => counter.value++
  const decrement = () => counter.value--

  const fetchData = (useHero: boolean = false) => simulateApi(useHero)
  const fnThatBreaksAsyncData = () => {
    const { isDev } = useContext()
    return isDev
  }

  return { counter, decrement, increment, fetchData, fnThatBreaksAsyncData }
}


function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function simulateApi(useHero: boolean = false) {
  const heros = ['iron man', 'captain america', 'black panther']
  return Promise.resolve({ user: { name: useHero ? heros[getRandomInt(0, heros.length - 1)] : 'i am not a hero' } })
}
