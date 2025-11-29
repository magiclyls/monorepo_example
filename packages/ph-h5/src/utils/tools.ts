import { i18n } from '@tg/vue-i18n'
import { copy } from 'clipboard'
import { Message } from './message'

const { t } = i18n.global

export function copyTest(str: string): void {
  copy(str)
  Message.success(t('成功复制'))
}
