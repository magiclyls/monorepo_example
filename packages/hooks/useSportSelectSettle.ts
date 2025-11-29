import { useI18n } from 'vue-i18n'
import { useSelect } from './useSelect'

export function useSportSelectSettle(settleValue?: number) {
  const { t } = useI18n()
  const {
    selected: settle,
    list: settleList,
  } = useSelect([
    { label: t('未结算'), value: 0, icon: 'navbar-active' },
    { label: t('已结算'), value: 1, icon: 'navbar-settled' },
  ])

  if (settleValue !== void 0)
    settle.value = settleValue

  return {
    settle,
    settleList,
  }
}
