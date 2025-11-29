<script setup lang='ts'>
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'AppMiniGamePartLimboGameInfo',
})
const { t } = useI18n()
</script>

<template>
  <div class="flex-col-16 flex flex-col p-[16px]">
    <ol class="th-leading-5 list-decimal list-outside pl-[16px]">
      <li class="text-tg-text-lightgrey mb-[4px] text-[16px]">
        {{ t('limbo游戏规则1') }}
      </li>
      <li class="text-tg-text-lightgrey mb-[4px] text-[16px]">
        {{ t('limbo游戏规则2') }}
      </li>
      <li class="text-tg-text-lightgrey mb-[4px] text-[16px]">
        {{ t('limbo游戏规则3') }}
      </li>
    </ol>
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16px;
  }
}
</style>
