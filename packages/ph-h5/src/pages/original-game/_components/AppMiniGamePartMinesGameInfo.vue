<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'
import { useI18n } from 'vue-i18n'

interface Props {
  gameType: GAMES_LIST_ENUM
}
defineOptions({
  name: 'AppMiniGamePartMinesGameInfo',
})
const props = defineProps<Props>()

const { t } = useI18n()

let gameInfo: string[] = []

switch (props.gameType) {
  case GAMES_LIST_ENUM.MINES:
    gameInfo = [
      t('mines游戏规则1'),
      t('mines游戏规则2'),
      t('mines游戏规则3'),
      t('mines游戏规则4'),
    ]
    break
  case GAMES_LIST_ENUM.HILO:
    gameInfo = [
      t('hilo游戏规则1'),
      t('hilo游戏规则2'),
      t('hilo游戏规则3'),
      t('hilo游戏规则4'),
      t('hilo游戏规则5'),
    ]
    break
  case GAMES_LIST_ENUM.CRASH:
    gameInfo = [
      t('crash游戏规则1'),
      t('crash游戏规则2'),
      t('crash游戏规则3'),
    ]
    break
  case GAMES_LIST_ENUM.KENO:
    gameInfo = [
      t('keno游戏规则1'),
      t('keno游戏规则2'),
      t('keno游戏规则3'),
    ]
    break
  case GAMES_LIST_ENUM.WHEEI:
    gameInfo = [
      t('wheel游戏规则1'),
      t('wheel游戏规则2'),
    ]
    break
  case GAMES_LIST_ENUM.DIAMONDS:
    gameInfo = [
      t('diamonds游戏规则1'),
      t('diamonds游戏规则2'),
      t('diamonds游戏规则3'),
    ]
    break
  case GAMES_LIST_ENUM.BLACKJACK:
    gameInfo = [
      t('blackjack游戏规则1'),
      t('blackjack游戏规则2'),
      t('blackjack游戏规则3'),
      t('blackjack游戏规则4'),
      t('blackjack游戏规则5'),
      t('blackjack游戏规则6'),
      t('blackjack游戏规则7'),
      t('blackjack游戏规则8'),
      t('blackjack游戏规则9'),
    ]
    break
}
</script>

<template>
  <div class="flex-col-16 flex flex-col p-[16rem]">
    <ol class="th-leading-5 list-decimal list-outside pl-[16rem]">
      <li v-for="str, i in gameInfo" :key="i" class="text-tg-text-lightgrey mb-[4rem] text-[16rem]">
        {{ str }}
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
