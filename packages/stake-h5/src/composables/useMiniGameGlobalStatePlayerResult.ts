export const useMiniGameGlobalStatePlayerResult = createGlobalState(() => {
  const { bool: showPlayerResult, toggle: togglePlayerResult } = useBoolean(true)

  return {
    showPlayerResult,
    togglePlayerResult,
  }
})
