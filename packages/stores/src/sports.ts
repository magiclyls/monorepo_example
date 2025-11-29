import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export enum EnumSportsOddsType {
  /** 小数式、欧洲  */
  DECIMAL = 'DECIMAL',
  /** 分数式 */
  FRACTION = 'FRACTION',
  /** 美式 */
  AMERICAN = 'AMERICAN',
  /** 印尼格式 */
  INDONESIA = 'INDONESIA',
  /** 香港格式 */
  HONGKONG = 'HONGKONG',
  /** 马来格式 */
  MALAYSIA = 'MALAYSIA',
}

export const useSportsStore = defineStore('sports', () => {
  const { t } = useI18n()

  /** 体育赔率展示方式 */
  const sportsOddsType = ref('DECIMAL')

  /** 所有赔率类型 */
  const AllOddsTypes = computed<Array<{
    label: string
    value: EnumSportsOddsType
  }>>(() => Object.values(EnumSportsOddsType).map(m => ({ label: t(m), value: m })))

  /** 设置当前体育赔率展示方式 */
  function setSportsOddsType(type: EnumSportsOddsType) {
    sportsOddsType.value = type
  }

  return {
    sportsOddsType,
    AllOddsTypes,
    setSportsOddsType,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useSportsStore, import.meta.hot))
