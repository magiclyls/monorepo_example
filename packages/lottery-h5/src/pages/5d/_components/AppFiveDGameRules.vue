<script setup lang='ts'>
import { useLocale } from '../../../components/LotteryConfigProvider'

defineOptions({ name: 'AppFiveDGameRules' })

const { $$t } = useLocale()
</script>

<template>
  <div class="rule-bg px-[16rem] py-[12rem] text-[12rem] font-[400] scroll-y">
    <h6 class="rule-title leading-[20rem] font-[800]">
      {{ $$t('5D游戏规则') }}
    </h6>
    <p v-for="i in 13" :key="i">
      {{ $$t(`5D游戏规则${i}`) }}
    </p>
  </div>
</template>

<style lang='scss' scoped></style>
