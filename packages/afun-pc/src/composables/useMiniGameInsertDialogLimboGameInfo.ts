import { i18n } from '@tg/vue-i18n'
import AppMiniGamePartLimboGameInfo from '~/components/AppMiniGamePartLimboGameInfo.vue'

export function useMiniGameInsertDialogLimboGameInfo() {
  const { t } = i18n.global

  const {
    openDialog: openMiniGameInfoInsertDialog,
    closeDialog: closeMiniGameInfoInsertDialog,
  } = useMiniGamePublicInsertDialog({
    title: t('mini_game_info'),
    icon: 'chat-rule',
    default: () => h(AppMiniGamePartLimboGameInfo),
  })

  return {
    openMiniGameInfoInsertDialog,
    closeMiniGameInfoInsertDialog,
  }
}
