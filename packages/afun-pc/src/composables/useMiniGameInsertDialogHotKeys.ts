import type { GAMES_LIST_ENUM } from 'feie-ui'
import { i18n } from '@tg/vue-i18n'
import AppMiniGamePartMinesHotKeys from '~/components/AppMiniGamePartMinesHotKeys.vue'

export function useMiniGameInsertDialogHotKeys({ gameType }: { gameType: GAMES_LIST_ENUM }) {
  const { t } = i18n.global

  const {
    openDialog: openMiniGameHotKeysInsertDialog,
    closeDialog: closeMiniGameKeyBoardInsertDialog,
  } = useMiniGamePublicInsertDialog({
    title: t('mini_short_cuts'),
    icon: 'chess-slot-machine',
    default: () => h(AppMiniGamePartMinesHotKeys, { gameType }),
  })

  return {
    openMiniGameHotKeysInsertDialog,
    closeMiniGameKeyBoardInsertDialog,
  }
}
