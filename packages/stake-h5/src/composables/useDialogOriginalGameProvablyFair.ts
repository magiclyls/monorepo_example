import AppMiniGameProvablyFair from '~/components/AppMiniGameProvablyFair.vue'

export function useDialogOriginalGameProvablyFair() {
  const { t } = useI18n()
  const title = computed(() => t('fairness'))
  const {
    openDialog: openDialogOriginalGameProvablyFair,
    closeDialog: closeDialogOriginalGameProvablyFair,
  } = useDialog({
    title: title.value,
    icon: 'uni-checklist',
    default: (p: {
      game: string
      tab?: 'seed' | 'verify'
      gameData?: {
        [k: string]: any
      }
    }) => h(AppMiniGameProvablyFair, {
      game: p.game,
      tab: p.tab,
      gameData: p.gameData,
    }),
  })

  return {
    openDialogOriginalGameProvablyFair,
    closeDialogOriginalGameProvablyFair,
  }
}
