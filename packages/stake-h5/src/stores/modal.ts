import { acceptHMRUpdate, defineStore } from 'pinia'

/**
 * bg-login: BcGame 的登录弹窗
 * bg-register: BcGame 的注册弹窗
 */
export type ModalType = 'bg-login' | 'bg-register'

export const ModalList: ModalType[] = ['bg-login', 'bg-register']

export const useModalStore = defineStore('modal', () => {
  const modalState = ref<{
    isShow: boolean
  }>({
    isShow: false,
  })

  const showModal = () => {
    modalState.value.isShow = true
  }

  const hideModal = () => {
    modalState.value.isShow = false
  }

  return {
    modalState,
    showModal,
    hideModal,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useModalStore, import.meta.hot))
