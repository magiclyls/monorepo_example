<script setup lang='ts'>
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'AppMiniGamePartPlinkoGameInfo',
})
const { t } = useI18n()
</script>

<template>
  <div class="flex-col-16 flex flex-col p-[16rem]">
    <ol class="th-leading-5 list-decimal list-outside pl-[16rem]">
      <li class=" mb-[4rem] text-[16rem]">
        {{ t('wheel游戏规则1') }}
      </li>
      <li class=" mb-[4rem] text-[16rem]">
        {{ t('请勿在游戏进行时转动您的设备或者显示屏来逆重力') }}
      </li>
    </ol>
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16rem;
  }
}
</style>
