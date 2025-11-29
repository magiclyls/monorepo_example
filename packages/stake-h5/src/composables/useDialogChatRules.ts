import AppChatRulesDialog from '~/components/AppChatRulesDialog.vue'
import type { HomeTemplate } from '~/utils/init'

/** 4白色 */
const bgColorObj: Partial<Record<HomeTemplate, string>> = {
  4: '#ffffff',
}
console.log(bgColorObj[globalInitMap.currentTemplate], 'bgColorObj[globalInitMap.currentTemplate]')
export function useChatRulesDialog() {
  const { t } = useI18n()
  const title = computed(() => t('chat_rule_title'))
  const {
    openDialog: openChatRulesDialog,
    closeDialog: closeChatRulesDialog,
  } = useDialog({
    title: title.value,
    icon: 'chat-rule',
    default: () => h(AppChatRulesDialog),
    backgroundColor: bgColorObj[globalInitMap.currentTemplate] || 'var(--tg-dialog_style-bg)',
  })

  return {
    openChatRulesDialog,
    closeChatRulesDialog,
  }
}
