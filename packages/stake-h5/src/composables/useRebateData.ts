import { capitalize } from 'lodash'
import {
  IconChessSlotMachineNew,
  IconTabbarGame,
  IconUniFishing,
  IconChessLiveCasino,
  IconChessOriginalGame2,
  IconSptSoccer,
  IconTabbarLottery
} from '@tg/icons'

export function useRebateData() {
  const { t } = useI18n()
  const rebateType: {
    [t: string]: any
  } = {
    3: { label: t('slot'), value: '3', icon: IconChessSlotMachineNew },
    2: { label: t('fishing'), value: '2', icon: IconUniFishing },
    5: { label: t('chess'), value: '5', icon: IconTabbarGame },
    1: { label: t('vip_rebate_game_type_live'), value: '1', icon: IconChessLiveCasino },
    4: { label: capitalize(t('sports')), value: '4', icon: IconSptSoccer },
    8: { label: t('casino_game2'), value: '8', icon: IconChessOriginalGame2 },
    7: { label: t('lyticket'), value: '7', icon: IconTabbarLottery },
  }

  const rebateTypeArr = [
    { label: t('slot'), value: '3', sortID: '1', icon: IconChessSlotMachineNew },
    { label: t('chess'), value: '5', sortID: '2', icon: IconTabbarGame },
    { label: t('fishing'), value: '2', sortID: '3', icon: IconUniFishing },
    { label: t('vip_rebate_game_type_live'), value: '1', sortID: '4', icon: IconChessLiveCasino },
    { label: t('casino_game'), value: '8', sortID: '5', icon: IconChessOriginalGame2 },
    { label: capitalize(t('sports')), value: '4', sortID: '6', icon: IconSptSoccer },
    { label: capitalize(t('lyticket')), value: '7', sortID: '7', icon: IconTabbarLottery },
  ]
  /** 自定义平台名字 */
  function customPlatformName(name: string) {
    if (name === 'IM')
      return t('sports')
    else if (name === 'Casino Games' || name === 'Originals')
      return t('casino_game')
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
