<script setup lang='ts'>
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'AppMiniGamePartPlinkoGameInfo',
})
const { t } = useI18n()
</script>

<template>
  <div class="flex-col-16 flex flex-col p-[16px]">
    <ol class="text-[#B1BAD3] th-leading-5 list-decimal list-outside pl-[16px]">
      <li class=" mb-[4px] text-[16px]">
        {{ t('wheel游戏规则1') }}
      </li>
      <li class=" mb-[4px] text-[16px]">
        {{ t('请勿在游戏进行时转动您的设备或者显示屏来逆重力') }}
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
