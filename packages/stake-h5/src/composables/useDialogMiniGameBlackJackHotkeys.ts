import AppMiniGameBlackJackShortCut from '~/components/AppMiniGamePartBlackJackHotKeys.vue'

export function useDialogMiniGameBlackJackHotkeys() {
  const { t } = useI18n()
  const { openDialog: openBlackJackShortCut, closeDialog: closeBlackJackShortCut } = useMiniGamePublicInsertDialog({
    title: t('mini_short_cuts'),
    icon: 'chess-slot-machine',
    default: () => h(AppMiniGameBlackJackShortCut),
  })

  return {
    openBlackJackShortCut,
    closeBlackJackShortCut,
  }
}
