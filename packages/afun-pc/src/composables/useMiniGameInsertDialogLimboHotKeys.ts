import { i18n } from '@tg/vue-i18n'
import AppMiniGamePartLimboHotKeys from '~/components/AppMiniGamePartLimboHotKeys.vue'

export function useMiniGameInsertDialogLimboHotKeys() {
  const { t } = i18n.global

  const {
    openDialog: openMiniGameHotKeysInsertDialog,
    closeDialog: closeMiniGameKeyBoardInsertDialog,
  } = useMiniGamePublicInsertDialog({
    title: t('mini_short_cuts'),
    icon: 'chess-slot-machine',
    default: () => h(AppMiniGamePartLimboHotKeys),
  })

  return {
    openMiniGameHotKeysInsertDialog,
    closeMiniGameKeyBoardInsertDialog,
  }
}
