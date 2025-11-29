import { application } from '@tg/utils'
import { capitalize } from 'lodash'
import { useI18n } from 'vue-i18n'

export function useRebateData() {
  const { t } = useI18n()
  const rebateType: {
    [t: string]: any
  } = {
    3: { label: t('老虎机'), value: '3', icon: '/afun-h5/png/rebate-slot.png' },
    2: { label: t('捕鱼'), value: '2', icon: '/afun-h5/png/rebate-fish.png' },
    5: { label: t('棋牌'), value: '5', icon: '/afun-h5/png/rebate-chess.png' },
    1: { label: t('真人'), value: '1', icon: '/afun-h5/png/rebate-casino.png' },
    4: { label: capitalize(t('体育')), value: '4', icon: '/afun-h5/png/rebate-sports.png' },
    8: { label: t('小游戏'), value: '8', icon: '/afun-h5/png/rebate-plinko.png' },
    7: { label: t('彩票'), value: '7', icon: '/afun-h5/png/rebate-lottery.png' },
  }

  const rebateTypeArr = [
    { label: t('老虎机'), value: '3', sortID: '1', icon: '/afun-h5/png/rebate-slot.png', activeIcon: '/afun-h5/png/rebate-slot1.png' },
    { label: t('棋牌'), value: '5', sortID: '2', icon: '/afun-h5/png/rebate-chess.png', activeIcon: '/afun-h5/png/rebate-chess1.png' },
    { label: t('捕鱼'), value: '2', sortID: '3', icon: '/afun-h5/png/rebate-fish.png', activeIcon: '/afun-h5/png/rebate-fish1.png' },
    { label: t('真人'), value: '1', sortID: '4', icon: '/afun-h5/png/rebate-casino.png', activeIcon: '/afun-h5/png/rebate-casino1.png' },
    { label: t('小游戏'), value: '8', sortID: '5', icon: '/afun-h5/png/rebate-plinko.png', activeIcon: '/afun-h5/png/rebate-plinko1.png' },
    { label: capitalize(t('体育')), value: '4', sortID: '6', icon: '/afun-h5/png/rebate-sports.png', activeIcon: '/afun-h5/png/rebate-sports1.png' },
    { label: capitalize(t('彩票')), value: '7', sortID: '7', icon: '/afun-h5/png/rebate-lottery.png', activeIcon: '/afun-h5/png/rebate-lottery1.png' },
  ]
  /** 自定义平台名字 */
  function customPlatformName(name: string) {
    if (name === 'IM')
      return t('体育')
    else if (name === 'Casino Games' || name === 'Originals')
      return t('小游戏')
    else
      return name
  }
  /** 自定义返水的显示格式 只能用于梯级返回 1:有效投注|可领取 再投注  2:暂无  3 返水比例 */
  function customFormat(val: string | number, type: 1 | 3) {
    const newVal = +val
    if (type === 1)
      return `${application.formatNumDecimal(newVal, 2)}`
    else if (type === 3)
      return newVal === 0 ? `${newVal}%` : `${application.formatNumDecimal(newVal, 2, 1)}%`
    else
      return `${newVal}`
  }
  return {
    rebateType,
    rebateTypeArr,
    customPlatformName,
    customFormat,
  }
}
