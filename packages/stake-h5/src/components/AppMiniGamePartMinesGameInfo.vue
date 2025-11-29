<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'

interface Props {
  gameType: GAMES_LIST_ENUM
}
defineOptions({
  name: 'AppMiniGamePartMinesGameInfo',
})
const props = defineProps<Props>()

const { t } = useI18n()
const tab = ref('1')
const tabList = [
  { value: '1', label: t('mini_game_rules') },
]

let gameInfo: string[] = []

switch (props.gameType) {
  case GAMES_LIST_ENUM.MINES:
    gameInfo = [
      t('mini_game_mines_rule1'),
      t('mini_game_mines_rule2'),
      t('mini_game_mines_rule3'),
      t('mini_game_mines_rule4'),
    ]
    break
  case GAMES_LIST_ENUM.HILO:
    gameInfo = [
      t('hilo_game_rules_1'),
      t('hilo_game_rules_2'),
      t('hilo_game_rules_3'),
      t('hilo_game_rules_4'),
      t('hilo_game_rules_5'),
    ]
    break
  case GAMES_LIST_ENUM.CRASH:
    gameInfo = [
      t('crash_game_info1'),
      t('crash_game_info2'),
      t('crash_game_info3'),
    ]
    break
  case GAMES_LIST_ENUM.KENO:
    gameInfo = [
      t('keno_game_info1'),
      t('keno_game_info2'),
      t('keno_game_info3'),
    ]
    break
  case GAMES_LIST_ENUM.WHEEI:
    gameInfo = [
      t('wheel_game_info1'),
      t('wheel_game_info2'),
    ]
    break
  case GAMES_LIST_ENUM.DIAMONDS:
    gameInfo = [
      t('diamonds_game_info1'),
      t('diamonds_game_info2'),
      t('diamonds_game_info3'),
    ]
    break
}
</script>

<template>
  <div class="flex-col-16 flex flex-col p-[16px]">
    <BaseTab v-model="tab" :list="tabList" />
    <ol class="th-leading-5 list-decimal list-outside pl-[16px]">
      <li v-for="str, i in gameInfo" :key="i" class="text-tg-text-lightgrey mb-[4px] text-[16px]">
        {{ str }}
      </li>
      <!-- <li class="text-tg-text-lightgrey mb-[4px] text-[16px]">
        {{ t('mini_game_mines_rule1') }}
      </li>
      <li class="text-tg-text-lightgrey mb-[4px] text-[16px]">
        {{ t('mini_game_mines_rule2') }}
      </li>
      <li class="text-tg-text-lightgrey mb-[4px] text-[16px]">
        {{ t('mini_game_mines_rule3') }}
      </li>
      <li class="text-tg-text-lightgrey mb-[4px] text-[16px]">
        {{ t('mini_game_mines_rule4') }}
      </li> -->
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
