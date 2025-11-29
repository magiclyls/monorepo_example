<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'
import { PhBaseAmount } from '@tg/bccomponents'
import { computed } from 'vue'

defineOptions({
  name: 'AppPromoNotifications',
})
const props = defineProps<{
  amount: string
  /**
   * 0:审核通过
   *
   * 1:审核拒绝
   *
   * 2:领取成功
   *
   * 3:领取失败
   *
   * 4:派发成功(自动)
   *
   * 5: 审核中
   */
  type: '0' | '1' | '2' | '3' | '4' | '5'
  currencyType: EnumCurrencyKey
  t: any
}>()

/**
 * 是否显示货币图标
 */
const isShowCurrencyIcon = computed(() => ['0', '1', '2', '3', '4'].includes(props.type))
const t = props.t
const message = computed(() => {
  switch (props.type) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
      return t('金额')
    case '5':
      return t('奖金系统正在审核中...')
    default:
      return t('未知')
  }
})
</script>

<template>
  <div class="flex items-center">
    <span class="mr-5">{{ message }}</span>
    <template v-if="amount">
      <PhBaseAmount
        :amount="amount" :currency-type="currencyType"
        :show-icon="isShowCurrencyIcon"
      />
    </template>
  </div>
</template>

<style lang='scss' scoped>
.flex-wrap {
  flex-wrap: wrap;
}
</style>
