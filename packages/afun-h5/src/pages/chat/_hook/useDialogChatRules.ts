// import AppChatRulesDialog from '~/pages/chat/_components/AppChatRulesDialog.vue'

// import { useDialog } from '~/hooks/useDialog'
import type { HomeTemplate } from '@tg/types'
import { globalInitMap } from '@tg/utils'

/** 4白色 */
const bgColorObj: Partial<Record<HomeTemplate, string>> = {
  4: '#ffffff',
}
console.log(bgColorObj[globalInitMap.currentTemplate], 'bgColorObj[globalInitMap.currentTemplate]')
export function useChatRulesDialog() {
  // const { t } = useI18n()
  // const title = computed(() => t('chat_rule_title'))
  const openChatRulesDialog = (e: unknown) => {}
  const closeChatRulesDialog = (_e: unknown) => {}

  return {
    openChatRulesDialog,
    closeChatRulesDialog,
  }
}
