export const useMiniGameGlobalStateLiveBetting = createGlobalState(() => {
  const { bool: isLiveBetting, toggle: toggleLiveBetting } = useBoolean(false)

  return {
    isLiveBetting,
    toggleLiveBetting,
  }
})
