<script setup lang='ts'>
defineOptions({
  name: 'AppMiniGamePartDiceGameInfo',
})
const { t } = useI18n()
const tab = ref('1')
const tabList = [
  { value: '1', label: t('mini_game_rules') },
]
</script>

<template>
  <div class="flex-col-16 flex flex-col p-[16px]">
    <BaseTab v-model="tab" :list="tabList" />
    <ol class="th-leading-5 list-decimal list-outside pl-[16px]">
      <li class="text-tg-text-lightgrey mb-[4px] text-[16px]">
        {{ t('mini_game_dice_rule1') }}
      </li>
      <li class="text-tg-text-lightgrey mb-[4px] text-[16px]">
        {{ t('mini_game_dice_rule2') }}
      </li>
      <li class="text-tg-text-lightgrey mb-[4px] text-[16px]">
        {{ t('mini_game_dice_rule3') }}
      </li>
    </ol>
  </div>
</template>

<style lang='scss' scoped>
.flex-col-16{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
</style>
