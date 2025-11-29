<script setup lang="ts">
import type { EnumCurrencyKey } from '@tg/types'

interface Props {
  amount: string | number
  currencyType: EnumCurrencyKey
  showName?: boolean
  isBetSingle: boolean
  /**
   * 笔数
   */
  num?: number
}
defineOptions({
  name: 'AppSportBetSuccessNotify',
})
const props = defineProps<Props>()

const { t } = useI18n()

const numStr = computed(() => {
  if (props.num && props.num > 1)
    return `${props.num}${t('order')}`

  return ''
})
</script>

<template>
  <div class="app-sport-bet-success-notify">
    <i18n-t :keypath="isBetSingle ? 'bet_tip_amount_tip_single' : 'bet_tip_amount_tip_multi'">
      <AppAmount
        class="amount"
        :show-name="showName"
        :amount="amount"
        :currency-type="currencyType"
      />
    </i18n-t>
  </div>
</template>

<style lang="scss" scoped>
.app-sport-bet-success-notify {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  word-break: break-all;
  padding-top: var(--tg-spacing-4);
  line-height: 1.3;
  color: var(--tg-text-lightgrey);
}
.amount {
  margin: 0 5px;
  flex-wrap: nowrap;
  display: flex;
}
</style>
