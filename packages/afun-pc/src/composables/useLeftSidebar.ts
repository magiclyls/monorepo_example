export const useLeftSidebar = createGlobalState(() => {
  const route = useRoute()
  const { isMobile } = storeToRefs(useWindowStore())

  let initExpand = false
  if (window.innerWidth <= 768)
    initExpand = !!Local.get<boolean>(STORAGE_MENU_LEFT_EXPAND)?.value

  const leftIsExpand = useDebouncedRef({ value: initLeftIsExpand(), delay: 100, beforeTrigger, afterTrigger })
  const { bool: isSwitching, setTrue, setFalse } = useBoolean(false)
  const switchTo = ref<'big' | 'small' | ''>('')
  const selectedCasinoTab = ref<'game' | 'favorite' | 'recent' | ''>('')
  const after = ref()
  /** 导航排序 */
  const navButtons = ref<{ title: string }[]>([
    { title: 'casino' },
    { title: 'sports' },
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
  }
  function closeLeftSidebar(fn?: () => void) {
    if (leftIsExpand.value === true)
      leftIsExpand.value = false

    after.value = fn
    Local.set(STORAGE_MENU_LEFT_EXPAND, false)
  }
  function triggerLeftSidebar() {
    leftIsExpand.value = !leftIsExpand.value
    Local.set(STORAGE_MENU_LEFT_EXPAND, leftIsExpand.value)
  }
  function initLeftIsExpand() {
    if (!globalInitMap.isPcRenderH5)
      return window.innerWidth >= 1200 ? true : initExpand

    return initExpand
  }

  watch(() => route.path, () => {
    if (isMobile.value && leftIsExpand.value) {
      setTimeout(() => {
        closeLeftSidebar()
      }, 100)
    }
  })

  watchEffect(() => {
    console.log('xxxxxx', leftIsExpand.value, isSwitching.value)
  })

  return {
    leftIsExpand,
    isSwitching,
    switchTo,
    selectedCasinoTab,
    openLeftSidebar,
    closeLeftSidebar,
    triggerLeftSidebar,
    navButtons,
  }
})
