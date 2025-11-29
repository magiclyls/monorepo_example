import { acceptHMRUpdate, defineStore } from 'pinia'

export const useRouterStore = defineStore('router', () => {
  const keepAliveList = ref<string[]>([])

  const addKeepAlive = (name: string) => {
    if (!keepAliveList.value.includes(name))
      keepAliveList.value.push(name)
  }

  const removeKeepAlive = (name: string) => {
    const index = keepAliveList.value.indexOf(name)
    if (index !== -1)
      keepAliveList.value.splice(index, 1)
  }

  return {
    keepAliveList,
    addKeepAlive,
    removeKeepAlive,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useRouterStore, import.meta.hot))
