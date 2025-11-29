export const useGlobalStateShowFooter = createGlobalState(() => {
  const isShowFooterState = ref(true)

  return {
    isShowFooterState,
  }
})
