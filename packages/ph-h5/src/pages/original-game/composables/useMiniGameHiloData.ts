import { i18n } from '@tg/vue-i18n'

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

      text: t('大于或等于'),
      betIcon: 'uni-arrow-up-small2',
      resultIcon: 'IconUniArrowUpEqual', // uni-arrow-up-equal IconUniArrowUpEqual
    },
    higher: {
      betVal: EnumBetType[1],
      text: t('大于'),
      betIcon: 'uni-arrow-up-small2',
      resultIcon: 'IconUniArrowUpSmall2',
    },
    lower_equal: {
      betVal: EnumBetType[2],
      text: t('小于或等于'),
      betIcon: 'uni-arrow-up-small',
      resultIcon: 'IconUniArrowDownEqual', // uni-arrow-down-equal
    },
    lower: {
      betVal: EnumBetType[3],
      text: t('小于'),
      betIcon: 'uni-arrow-up-small',
      resultIcon: 'IconUniArrowUpSmall', // uni-arrow-up-small
    },
    equal: {
      betVal: EnumBetType[4],
      text: t('相等于'),
      betIcon: 'uni-pair-equal',
      resultIcon: 'IconUniPairEqual', // uni-pair-equal
    },
    skip: {
      betVal: EnumBetType[5],
      text: t('跳过'),
      betIcon: 'uni-pair-right',
      resultIcon: 'IconUniPairRight', // uni-pair-right
    },
  }
  return {
    EnumBetType,
    betTextConfig,
  }
}
