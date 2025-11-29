import { i18n } from '@tg/vue-i18n'
import AppMiniGamePartDiceHotKeys from '~/components/AppMiniGamePartDiceHotKeys.vue'

export function useMiniGameInsertDialogDiceHotKeys() {
  const { t } = i18n.global

  const {
    openDialog: openMiniGameHotKeysInsertDialog,
    closeDialog: closeMiniGameKeyBoardInsertDialog,
  } = useMiniGamePublicInsertDialog({
    title: t('mini_short_cuts'),
    icon: 'chess-slot-machine',
    default: () => h(AppMiniGamePartDiceHotKeys),
  })

  return {
    openMiniGameHotKeysInsertDialog,
    closeMiniGameKeyBoardInsertDialog,
  }
}
