import { i18n } from '@tg/vue-i18n'
import AppMiniGamePartDiceGameInfo from '~/components/AppMiniGamePartDiceGameInfo.vue'

export function useMiniGameInsertDialogDiceGameInfo() {
  const { t } = i18n.global

  const {
    openDialog: openMiniGameInfoInsertDialog,
    closeDialog: closeMiniGameInfoInsertDialog,
  } = useMiniGamePublicInsertDialog({
    title: t('mini_game_info'),
    icon: 'chat-rule',
    default: () => h(AppMiniGamePartDiceGameInfo),
  })

  return {
    openMiniGameInfoInsertDialog,
    closeMiniGameInfoInsertDialog,
  }
}
