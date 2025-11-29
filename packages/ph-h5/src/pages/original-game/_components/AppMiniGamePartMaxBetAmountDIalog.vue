<script setup lang='ts'>
import { PhBaseButton } from '@tg/bccomponents'
import { Local, STORAGE_MINIGAME_MAX_BET } from '@tg/utils'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMiniGameGlobalStateMaxBetAmount } from '../composables/useMiniGameGlobalStateMaxBetAmount'

defineOptions({
  name: 'AppMiniGamePartMaxBetAmountDIalog',
})
const closeDialog = inject('closeDialog', () => {})

const { t } = useI18n()
const { isMaxBetAmount } = useMiniGameGlobalStateMaxBetAmount()

function enableMaxBetAmount() {
  Local.set(STORAGE_MINIGAME_MAX_BET, true)
  isMaxBetAmount.value = true
  closeDialog()
}
</script>

<template>
  <div class="flex-col-16 flex flex-col items-center px-[8rem] py-[16rem]">
    <span class="text-tg-text-lightgrey text-[12rem] leading-[1.5]">{{ t('您确定要启用最大投注额按钮吗') }}</span>
    <PhBaseButton type="primary" @click="enableMaxBetAmount">
      {{ t('确定') }}
    </PhBaseButton>
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16rem;
  }
}
</style>
