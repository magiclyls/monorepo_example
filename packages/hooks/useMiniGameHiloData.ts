export function useMiniGameHiloData() {
  const { t } = i18n.global

  enum EnumBetType { higher_equal, higher, lower_equal, lower, equal, skip }

  type EnumBetKey = keyof typeof EnumBetType

  const betTextConfig: Record<EnumBetKey | string, {
    betVal: EnumBetKey | string
    text: string
    betIcon: string
    resultIcon: string
  }> = {
    higher_equal: {
      betVal: EnumBetType[0],
      text: t('hilo_greater_than_or_equal'),
      betIcon: 'uni-arrow-up-small2',
      resultIcon: 'uni-arrow-up-equal',
    },
    higher: {
      betVal: EnumBetType[1],
      text: t('hilo_more_than'),
      betIcon: 'uni-arrow-up-small2',
      resultIcon: 'uni-arrow-up-small2',
    },
    lower_equal: {
      betVal: EnumBetType[2],
      text: t('hilo_less_than_or_equal'),
      betIcon: 'uni-arrow-up-small',
      resultIcon: 'uni-arrow-down-equal',
    },
    lower: {
      betVal: EnumBetType[3],
      text: t('hilo_less_than'),
      betIcon: 'uni-arrow-up-small',
      resultIcon: 'uni-arrow-up-small',
    },
    equal: {
      betVal: EnumBetType[4],
      text: t('hilo_equal'),
      betIcon: 'uni-pair-equal',
      resultIcon: 'uni-pair-equal',
    },
    skip: {
      betVal: EnumBetType[5],
      text: t('hilo_jump_over'),
      betIcon: 'uni-pair-right',
      resultIcon: 'uni-pair-right',
    },
  }
  return {
    EnumBetType,
    betTextConfig,
  }
}
