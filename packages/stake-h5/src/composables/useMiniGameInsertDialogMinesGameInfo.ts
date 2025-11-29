import type { GAMES_LIST_ENUM } from 'feie-ui'
import { i18n } from '@tg/vue-i18n'
import AppMiniGamePartMinesGameInfo from '~/components/AppMiniGamePartMinesGameInfo.vue'

export function useMiniGameInsertDialogMinesGameInfo({ gameType }: { gameType: GAMES_LIST_ENUM }) {
  const { t } = i18n.global

  const {
    openDialog: openMiniGameInfoInsertDialog,
    closeDialog: closeMiniGameInfoInsertDialog,
  } = useMiniGamePublicInsertDialog({
    title: t('mini_game_info'),
    icon: 'chat-rule',
    default: () => h(AppMiniGamePartMinesGameInfo, { gameType }),
  })

  return {
    openMiniGameInfoInsertDialog,
    closeMiniGameInfoInsertDialog,
  }
}
