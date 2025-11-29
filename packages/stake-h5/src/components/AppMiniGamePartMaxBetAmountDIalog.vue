<script setup lang='ts'>
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
  <div class="flex-col-16 flex flex-col items-center px-[8px] py-[16px]">
    <span class="text-tg-text-lightgrey text-sm leading-[1.5]">{{ t('mini_are_you_sure_enable_max_bet_amount') }}</span>
    <BaseButton bg-style="secondary" size="md" @click="enableMaxBetAmount">
      {{ t('mini_enable') }}
    </BaseButton>
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
</style>
