import AppMiniGamePartBlackJackInfo from '~/components/AppMiniGamePartBlackJackInfo.vue'

export function useDialogBlackJackInfo() {
  const { t } = useI18n()
  const { openDialog: openBlackJackInfo, closeDialog: closeBlackJackInfo } = useMiniGamePublicInsertDialog({
    title: t('mini_game_info'),
    icon: 'chat-rule',
    default: () => h(AppMiniGamePartBlackJackInfo),
  })

  return {
    openBlackJackInfo,
    closeBlackJackInfo,
  }
}
