export const useMiniGameGlobalStateTheatre = createGlobalState(() => {
  const { bool: isTheatre, toggle: toggleIsTheatre } = useBoolean(false)

  return {
    isTheatre,
    toggleIsTheatre,
  }
})
