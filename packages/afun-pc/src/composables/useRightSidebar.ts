export enum EnumRightSidebarContent {
  CHATROOM = 'chatroom',
  BETTING = 'betting',
  NOTIFICATION = 'notification',
  CASINOBET = 'casinobet',
  SERVICE = 'service',
}

export const useRightSidebar = createGlobalState(() => {
  const { isLogin } = storeToRefs(useAppStore())
  const { isMobile } = useWindowStore()

  let defaultRightStatus = false
  const rightStatus = Local.get(
    STORAGE_RIGHT_SIDEBAR_CONTENT,
  )?.value as string | null ?? null
  // 显示内容，聊天室，投注单，通知
  const currentRightSidebarContent = ref<EnumRightSidebarContent | null>(null)

  // && isLogin.value
  if (
    Object.values(EnumRightSidebarContent).includes(rightStatus as EnumRightSidebarContent)
  ) {
    defaultRightStatus = true
    currentRightSidebarContent.value = rightStatus as EnumRightSidebarContent
  }

  // 右侧是否展开
  const { bool: rightIsExpand, setTrue: setRightIsExpandTrue, setFalse: setRightIsExpandFalse } = useBoolean(defaultRightStatus)
  const { bool: rightContainerIs0, setTrue: setRightContainerIs0True, setFalse: setRightContainerIsFalse } = useBoolean(!defaultRightStatus)

  function openRightSidebar(rightSidebarContent?: EnumRightSidebarContent) {
    // 打开右侧侧边栏
    setRightIsExpandTrue()
    Local.set(STORAGE_RIGHT_SIDEBAR_CONTENT, rightSidebarContent)
    setTimeout(() => {
      setRightContainerIsFalse()
      if (rightSidebarContent)
        currentRightSidebarContent.value = rightSidebarContent
    }, 30)
  }

  function closeRightSidebar() {
    setRightContainerIs0True()
    setTimeout(() => {
      // 关闭右侧侧边栏
      setRightIsExpandFalse()
      Local.set(STORAGE_RIGHT_SIDEBAR_CONTENT, null)
    }, 50)
  }

  watch(currentRightSidebarContent, (a) => {
    Local.set(STORAGE_RIGHT_SIDEBAR_CONTENT, a)
  })

  watch(rightIsExpand, (val) => {
    lockBodyScroll(val)
  }, { immediate: true })

  onDeactivated(() => {
  })

  onUnmounted(() => {
  })

  return {
    rightIsExpand,
    rightContainerIs0,
    currentRightSidebarContent,
    openRightSidebar,
    closeRightSidebar,
  }
})
