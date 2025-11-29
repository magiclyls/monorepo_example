import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiAgencyCommissionCfg } from '@tg/apis'
import { acceptHMRUpdate, defineStore } from 'pinia'

/**
 * @description 联盟计划
 */
export const useAffiliate = defineStore('affiliate', () => {
  const { data: affiliateConfig, runAsync: runAsyncAffiliateCfg } = useRequest(ApiAgencyCommissionCfg, {
  })

  const mode = computed(() => affiliateConfig.value?.mode)
  const bonus_currency = computed(() => affiliateConfig.value?.bonus_currency as CurrencyCode)
  const link_url = computed(() => affiliateConfig.value?.link_url)
  const cond_direct = computed(() => affiliateConfig.value?.cond_direct)
  const cond_team = computed(() => affiliateConfig.value?.cond_team)
  const type = computed(() => affiliateConfig.value?.type)
  const bonus_limit = computed(() => affiliateConfig.value?.bonus_limit)
  const rules = computed(() => affiliateConfig.value?.rules ? JSON.parse(affiliateConfig.value?.rules) : '')
  const isOpen = computed(() => affiliateConfig.value?.front_entrance == 1)
  return {
    runAsyncAffiliateCfg,
    affiliateConfig,
    mode,
    bonus_currency,
    link_url,
    cond_direct,
    cond_team,
    type,
    bonus_limit,
    rules,
    isOpen,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAffiliate, import.meta.hot))
