import { IconNavbarActive, IconNavbarSettled } from '@tg/icons';

export function useSportSelectSettle(settleValue?: number) {
  const { t } = useI18n()
  const {
    selected: settle,
    list: settleList,
  } = useSelect([
    { label: t('sports_active'), value: 0, icon: IconNavbarActive },
    { label: t('sports_settled'), value: 1, icon: IconNavbarSettled },
  ])

  if (settleValue !== void 0)
    settle.value = settleValue

  return {
    settle,
    settleList,
  }
}
