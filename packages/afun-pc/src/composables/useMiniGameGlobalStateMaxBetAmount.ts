export const useMiniGameGlobalStateMaxBetAmount = createGlobalState(() => {
  const initValue = Local.get<boolean | undefined | null>(STORAGE_MINIGAME_MAX_BET)?.value
  const { bool: isMaxBetAmount } = useBoolean(!!initValue)

  return {
    isMaxBetAmount,
  }
})
