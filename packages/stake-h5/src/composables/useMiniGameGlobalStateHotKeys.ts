export const useMiniGameGlobalStateHotKeys = createGlobalState(() => {
  const { bool: isHotKeysEnabled } = useBoolean(Local.get<boolean>(STORAGE_MINI_GAME_HOTKEYS_ENABLED)?.value ?? false)

  Local.set(STORAGE_MINI_GAME_HOTKEYS_ENABLED, isHotKeysEnabled.value)

  return {
    isHotKeysEnabled,
  }
})
