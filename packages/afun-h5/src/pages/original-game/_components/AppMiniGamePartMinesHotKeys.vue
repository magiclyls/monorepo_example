<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'
import { useI18n } from 'vue-i18n'
import AppMiniGameBaseHotkey from './AppMiniGameBaseHotkey.vue'
import AppMiniGamePartHotKeysWrap from './AppMiniGamePartHotKeysWrap.vue'

interface Props {
  gameType: GAMES_LIST_ENUM
}
defineOptions({
  name: 'AppMiniGamePartMinesHotKeys',
})
const props = defineProps<Props>()

const { t } = useI18n()

const minesHotKeys = [
  { label: t('下注'), hotKey: 'space' },
  { label: t('加倍投注额'), hotKey: 's' },
  { label: t('减半投注额'), hotKey: 'a' },
  { label: t('零数投注额'), hotKey: 'd' },
  { label: t('随机翻开瓷砖'), hotKey: 'q' },
  { label: t('兑现'), hotKey: 'w' },
]

const hiloHotKeys = [
  { label: t('下注'), hotKey: 'space' },
  { label: t('加倍投注额'), hotKey: 's' },
  { label: t('减半投注额'), hotKey: 'a' },
  { label: t('零数投注额'), hotKey: 'd' },
  { label: t('大于或等于'), hotKey: 'q' },
  { label: t('小于或等于'), hotKey: 'w' },
  { label: t('跳过'), hotKey: 'e' },
  { label: t('兑现'), hotKey: 'r' },
]

const crashHotKeys = [
  { label: t('下注'), hotKey: 'space' },
  { label: t('加倍投注额'), hotKey: 's' },
  { label: t('减半投注额'), hotKey: 'a' },
  { label: t('零数投注额'), hotKey: 'd' },
  { label: t('取消 / 兑现'), hotKey: 'q' },
]
const kenoHotKeys = [
  { label: t('下注'), hotKey: 'space' },
  { label: t('加倍投注额'), hotKey: 's' },
  { label: t('减半投注额'), hotKey: 'a' },
  { label: t('零数投注额'), hotKey: 'd' },
  { label: t('自动挑选'), hotKey: 'q' },
  { label: t('清空桌面'), hotKey: 'w' },
]

const wheelHotKeys = [
  { label: t('下注'), hotKey: 'space' },
  { label: t('加倍投注额'), hotKey: 's' },
  { label: t('减半投注额'), hotKey: 'a' },
  { label: t('零数投注额'), hotKey: 'd' },
]

const blackjackHotKeys = [
  { label: t('下注'), hotKey: 'space' },
  { label: t('加倍投注额'), hotKey: 's' },
  { label: t('减半投注额'), hotKey: 'a' },
  { label: t('零数投注额'), hotKey: 'd' },
  { label: t('叫牌'), hotKey: 'q' },
  { label: t('叫停'), hotKey: 'w' },
  { label: t('分牌'), hotKey: 'e' },
  { label: t('加倍'), hotKey: 'r' },
  { label: t('买保险'), hotKey: 't' },
  { label: t('不买保险'), hotKey: 'y' },
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
    case GAMES_LIST_ENUM.BLACKJACK:
      return blackjackHotKeys
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
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: 16px;
  }
}
</style>
