<script setup lang="ts">
import { AfunBaseImage, AfunBaseCurrencyIcon } from '@tg/bccomponents'

interface Props {
  currencyType?: 'wallet' | 'fiat' | 'virtual' // 钱包，法币，虚拟币--对应图标地址拼接不同
  type: number
  item: any
  size?: string
}
const props = withDefaults(defineProps<Props>(), {
  currencyType: 'wallet',
  size: '24px',
})
/** 获取图标路径 */
function getMerchantsIconPath(type: number, str: string) {
  return type === 2 ? `/webp/bank/${str}.webp` : `/payment/deposit/${str ?? 'dft'}.webp`
}
/** 法币获取图标路径 */
function getMerchantsIconPath2(type: number, item: object) {
  let str = (item as { alias: string }).alias
  if (str === 'qb') {
    str = (item as { zk_id: string }).zk_id
    return `/payment/deposit/${str}.webp`
  }
  else {
    return type === 2 ? `/webp/bank/${str}.webp` : `/payment/deposit/${str ?? 'dft'}.webp`
  }
}
</script>

<template>
  <AfunBaseImage v-if="currencyType === 'wallet'" :style="{ width: `${size}`, height: `${size}` }" :url="getMerchantsIconPath(type, item.zk_id)" is-network />
  <AfunBaseImage v-else-if="currencyType === 'fiat'" :style="{ width: `${size}`, height: `${size}` }" :url="getMerchantsIconPath2(type, item)" is-network />
  <AfunBaseCurrencyIcon v-else-if="currencyType === 'virtual'" :style="{ '--ph-app-currency-icon-size': size }" icon-align="right" :currency-type="item.alias.toUpperCase()" :show-name="false" />
</template>

<style scoped lang="scss">

</style>
