export const useDialogState = createGlobalState(() => {
  const uniqueIds = ref<string[]>([])
  const { bool: closeAllDialog, setBool } = useBoolean(false)

  function addDialogId(id: string) {
    uniqueIds.value.push(id)
  }

  function removeDialogId(id: string) {
    uniqueIds.value = uniqueIds.value.filter(item => item !== id)
  }

  function includesId(id: string) {
    return uniqueIds.value.includes(id)
  }

  function setCloseAllDialog(b: boolean) {
    setBool(b)
    setTimeout(() => {
      setBool(false)
    }, 0)
  }

  return {
    uniqueIds,
    closeAllDialog,
    setCloseAllDialog,
    addDialogId,
    removeDialogId,
    includesId,
  }
})
