import { useBoolean, useDebouncedRef } from '@tg/hooks'
import { Local, lockBodyScroll, STORAGE_MENU_LEFT_EXPAND } from '@tg/utils'
import { createGlobalState } from '@vueuse/core'
import { ref, watchEffect } from 'vue'

export const useLeftSidebar = createGlobalState(() => {
  const beforePage = ref('/')
  let initExpand = false
  if (window.innerWidth <= 768)
    initExpand = !!Local.get<boolean>(STORAGE_MENU_LEFT_EXPAND)?.value

  const leftIsExpand = useDebouncedRef({ value: initExpand, delay: 100, beforeTrigger, afterTrigger })
  const { bool: isSwitching, setTrue, setFalse } = useBoolean(false)
  const switchTo = ref<'big' | 'small' | ''>('')
  const selectedCasinoTab = ref<'game' | 'recent' | 'favorite' | ''>('')
  const after = ref()
  /** 导航排序 */
  const navButtons = ref<{ title: string, value: string }[]>([
    { title: '娱乐城', value: 'casino' },
    { title: '体育', value: 'sports' },
  ])
  // useRequest(ApiMemberGameCateIndex, {
  //   manual: false,
  //   onSuccess(res) {
  //     navButtons.value = res.map((a) => {
  //       return {
  //         ...a,
  //         title: a.id === '1'
  //           ? 'casino'
  //           : a.id === '2' ? 'sports' : '_',
  //       }
  //     })
  //   },
  // })
  function setBeforePage(path: string) {
    beforePage.value = path
  }
  function beforeTrigger(expand_cur: boolean) {
    setTrue()
    if (expand_cur)
      switchTo.value = 'small'
    else
      switchTo.value = 'big'
  }
  function afterTrigger() {
    setFalse()
    switchTo.value = ''
    after.value && after.value()
    after.value = undefined
  }
  function openLeftSidebar() {
    if (!leftIsExpand.value)
      leftIsExpand.value = true
    Local.set(STORAGE_MENU_LEFT_EXPAND, true)
    lockBodyScroll(true)
  }
  function closeLeftSidebar(fn?: () => void) {
    if (leftIsExpand.value === true)
      leftIsExpand.value = false

    after.value = fn
    Local.set(STORAGE_MENU_LEFT_EXPAND, false)
    lockBodyScroll(false)
  }
  async function triggerLeftSidebar() {
    leftIsExpand.value = !leftIsExpand.value
    Local.set(STORAGE_MENU_LEFT_EXPAND, leftIsExpand.value)
  }
  // function initLeftIsExpand() {
  //   if (!globalInitMap.isPcRenderH5)
  //     return window.innerWidth >= 1200 ? true : initExpand

  //   return initExpand
  // }

  // watch(() => route.path, () => {
  //   if (leftIsExpand.value) {
  //     setTimeout(() => {
  //       closeLeftSidebar()
  //     }, 100)
  //   }
  // })

  watchEffect(() => {
    console.log('xxxxxx', leftIsExpand.value, isSwitching.value)
  })

  return {
    leftIsExpand,
    isSwitching,
    switchTo,
    openLeftSidebar,
    closeLeftSidebar,
    triggerLeftSidebar,
    selectedCasinoTab,
    navButtons,
    beforePage,
    setBeforePage,
  }
})
