<script setup lang='ts'>
defineOptions({
  name: 'AppMiniGamePartLimboHotKeys',
})
const { t } = useI18n()

const hotKeys = [
  { label: t('mini_bet'), hotKey: 'space' },
  { label: t('mini_double_bet'), hotKey: 's' },
  { label: t('mini_half_bet'), hotKey: 'a' },
  { label: t('mini_zero_bet'), hotKey: 'd' },
]
</script>

<template>
  <AppMiniGamePartHotKeysWrap>
    <div class="flex-col-16 flex flex-col">
      <AppMiniGameBaseHotkey v-for="k in hotKeys" :key="k.hotKey" :label="k.label" :hot-key="k.hotKey" />
    </div>
  </AppMiniGamePartHotKeysWrap>
</template>

<style lang='scss' scoped>
.flex-col-16{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
</style>
