export const useMiniGameGlobalStateMp3Volume = createGlobalState(() => {
  /** 是否开启声音 */
  const { bool: isSoundsEnabled } = useBoolean()
  if (Local.get<boolean>(STORAGE_MINI_GAME_SOUNDS_ENABLED)?.value !== undefined) {
    isSoundsEnabled.value = Local.get<boolean>(STORAGE_MINI_GAME_SOUNDS_ENABLED)?.value ?? true
  }
  else {
    isSoundsEnabled.value = true
    Local.set(STORAGE_MINI_GAME_SOUNDS_ENABLED, true)
  }

  /** 音量 */
  const volume = ref('')
  if (Local.get<string>(STORAGE_MINI_GAME_SOUNDS_VOLUME)?.value !== undefined) {
    volume.value = isSoundsEnabled.value ? Local.get<string>(STORAGE_MINI_GAME_SOUNDS_VOLUME)?.value ?? '100' : '0'
  }
  else {
    volume.value = '100'
    Local.set(STORAGE_MINI_GAME_SOUNDS_VOLUME, '100')
  }

  /** 开启声音 */
  function setSoundsEnabled() {
    if (!isSoundsEnabled.value) {
      isSoundsEnabled.value = true
      Local.set(STORAGE_MINI_GAME_SOUNDS_ENABLED, true)
    }
  }
  /** 切换声音 */
  function toggleSoundsEnabled() {
    if (isSoundsEnabled.value) {
      isSoundsEnabled.value = false
      volume.value = '0'
    }
    else {
      isSoundsEnabled.value = true
      volume.value = Local.get<string>(STORAGE_MINI_GAME_SOUNDS_VOLUME)?.value ?? '100'
    }
    Local.set(STORAGE_MINI_GAME_SOUNDS_ENABLED, isSoundsEnabled.value)
  }

  return {
    volume,
    isSoundsEnabled,
    setSoundsEnabled,
    toggleSoundsEnabled,
  }
})
