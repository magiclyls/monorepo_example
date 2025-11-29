/**
 *  用于路由跳转传递复杂对象、store本地存储
 *  注意⚠️：需主动声明想存储的位置 persist -> pick
 *
 */
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useStorageStore = defineStore('storage', () => {
  // 赛程筛选默认时间段
  const sportsEventTimeRang = ref('9')

  return {
    sportsEventTimeRang,
  }
}, {
  persist: [
    {
      pick: [''],
      storage: localStorage,
    },
    {
      pick: ['sportsEventTimeRang'],
      storage: sessionStorage,
    },
  ],
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useStorageStore, import.meta.hot))
