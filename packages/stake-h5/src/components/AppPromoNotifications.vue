<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'

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
}>()

const { t } = useI18n()

/**
 * 是否显示货币图标
 */
const isShowCurrencyIcon = computed(() => ['0', '1', '2', '3', '4'].includes(props.type))
const message = computed(() => {
  switch (props.type) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
      return t('amount')
    case '5':
      return t('bonus_on_the_way')
    default:
      return t('unknown')
  }
})
</script>

<template>
  <i18n-t keypath="components_placeholder" tag="span" class="inline-flex items-center leading-[1.5]">
    <span class="mr-[5px]">{{ message }}</span>
    <template v-if="+amount > 0">
      <span class="mr-[5px]">{{ amount }}</span>
      <template v-if="isShowCurrencyIcon">
        <AppCurrencyIcon :currency-type="currencyType" />
      </template>
    </template>
  </i18n-t>
</template>

<style lang='scss' scoped>
.flex-wrap {
  flex-wrap: wrap;
}
</style>
