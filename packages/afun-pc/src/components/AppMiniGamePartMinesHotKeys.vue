<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'

interface Props {
  gameType: GAMES_LIST_ENUM
}
defineOptions({
  name: 'AppMiniGamePartMinesHotKeys',
})
const props = defineProps<Props>()

const { t } = useI18n()

const minesHotKeys = [
  { label: t('mini_bet'), hotKey: 'space' },
  { label: t('mini_double_bet'), hotKey: 's' },
  { label: t('mini_half_bet'), hotKey: 'a' },
  { label: t('mini_zero_bet'), hotKey: 'd' },
  { label: t('mini_randomly_turn_over_tiles'), hotKey: 'q' },
  { label: t('mini_cash_out'), hotKey: 'w' },
]

const hiloHotKeys = [
  { label: t('mini_bet'), hotKey: 'space' },
  { label: t('mini_double_bet'), hotKey: 's' },
  { label: t('mini_half_bet'), hotKey: 'a' },
  { label: t('mini_zero_bet'), hotKey: 'd' },
  { label: t('hilo_greater_than_or_equal'), hotKey: 'q' },
  { label: t('hilo_less_than_or_equal'), hotKey: 'w' },
  { label: t('hilo_jump_over'), hotKey: 'e' },
  { label: t('mini_cash_out'), hotKey: 'r' },
]

const crashHotKeys = [
  { label: t('mini_bet'), hotKey: 'space' },
  { label: t('mini_double_bet'), hotKey: 's' },
  { label: t('mini_half_bet'), hotKey: 'a' },
  { label: t('mini_zero_bet'), hotKey: 'd' },
  { label: t('cancel_or_cashout'), hotKey: 'q' },
]
const kenoHotKeys = [
  { label: t('mini_bet'), hotKey: 'space' },
  { label: t('mini_double_bet'), hotKey: 's' },
  { label: t('mini_half_bet'), hotKey: 'a' },
  { label: t('mini_zero_bet'), hotKey: 'd' },
  { label: t('keno_auto_pick'), hotKey: 'q' },
  { label: t('keno_clear_table'), hotKey: 'w' },
]

const wheelHotKeys = [
  { label: t('mini_bet'), hotKey: 'space' },
  { label: t('mini_double_bet'), hotKey: 's' },
  { label: t('mini_half_bet'), hotKey: 'a' },
  { label: t('mini_zero_bet'), hotKey: 'd' },
]

function getHotKeys() {
  switch (props.gameType) {
    case GAMES_LIST_ENUM.MINES:
      return minesHotKeys
    case GAMES_LIST_ENUM.HILO:
      return hiloHotKeys
    case GAMES_LIST_ENUM.CRASH:
      return crashHotKeys
    case GAMES_LIST_ENUM.KENO:
      return kenoHotKeys
    case GAMES_LIST_ENUM.WHEEI:
      return wheelHotKeys
    case GAMES_LIST_ENUM.DIAMONDS:
      return wheelHotKeys
  }
}
</script>

<template>
  <AppMiniGamePartHotKeysWrap>
    <div class="flex-col-16 flex flex-col">
      <AppMiniGameBaseHotkey v-for="k in getHotKeys()" :key="k.hotKey" :label="k.label" :hot-key="k.hotKey" />
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
