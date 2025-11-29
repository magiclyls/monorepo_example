<script lang="ts" setup>
defineOptions({
  name: 'AppMiniGamePartBlackJackHotKeys',
})
const { t } = useI18n()
const shortCutKeys = computed(() => [
  { label: t('mini_bet'), key: 'space' },
  { label: t('mini_double_bet'), key: 's' },
  { label: t('mini_half_bet'), key: 'a' },
  { label: t('mini_zero_bet'), key: 'd' },
  { label: t('call_card'), key: 'q' },
  { label: t('stop_call'), key: 'w' },
  { label: t('split_card'), key: 'e' },
  { label: t('double_it'), key: 'r' },
  { label: t('accept_insurance'), key: 't' },
  { label: t('reject_insurance'), key: 'y' },
])
</script>

<template>
  <AppMiniGamePartHotKeysWrap>
    <div class="flex-col-16 flex flex-col">
      <AppMiniGameBaseHotkey v-for="k in shortCutKeys" :key="k.key" :label="k.label" :hot-key="k.key" />
    </div>
  </AppMiniGamePartHotKeysWrap>
</template>

<style lang="scss" scoped>
.flex-col-16{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
.system-message {
  svg {
    margin-top: 3px;
    margin-bottom: 3px;
    margin-left: 4px;
  }
}
</style>
