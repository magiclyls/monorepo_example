<script lang="ts" setup>
defineOptions({
  name: 'AppMiniGamePartBlackJackInfo',
})
</script>

<template>
  <div class="flex-col-16 flex flex-col p-[16px]">
    <BaseTab :list="[{ label: $t('mini_game_rules'), value: '1' }]" model-value="1" />
    <ol class="text-base">
      <li>{{ $t('mini_game_blackjack_rule1') }}</li>
      <li>{{ $t('mini_game_blackjack_rule2') }}</li>
      <li>{{ $t('mini_game_blackjack_rule3') }}</li>
      <li>{{ $t('mini_game_blackjack_rule4') }}</li>
      <li>{{ $t('mini_game_blackjack_rule5') }}</li>
      <li>{{ $t('mini_game_blackjack_rule6') }}</li>
      <li>{{ $t('mini_game_blackjack_rule7') }}</li>
      <li>{{ $t('mini_game_blackjack_rule8') }}</li>
      <li>{{ $t('mini_game_blackjack_rule9') }}</li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.flex-col-16{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
ol {
  list-style-type: decimal;
  list-style-position: outside;
  padding-left: 16px;
  li {
    margin-bottom: 4px;
    color: var(--tg-text-lightgrey);
  }
}
</style>
