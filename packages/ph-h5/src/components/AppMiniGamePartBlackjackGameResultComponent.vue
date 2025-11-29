<script lang="ts" setup>
import type { PokerCardItem } from '@tg/types'
import { PokerArray } from '@tg/types'
import { useElementSize } from '@vueuse/core'
import { computed, ref } from 'vue'
import { calcHandValue } from '~/pages/original-game/composables/useBlackJackHand'
import AppMiniGamePokerCard from './AppMiniGamePokerCard.vue'

interface Props {
  result?: number[]
}
defineOptions({
  name: 'AppMiniGamePartBlackjackGameResultComponent',
})
const props = defineProps<Props>()

const pokers = computed(() => props.result?.map(i => PokerArray[+i]))
const dealerCards = computed(() => pokers.value?.slice(2, 4) ?? [])
const dealerValue = computed(() => {
  let value = [0, 0]
  dealerCards.value.forEach((item: PokerCardItem) => {
    value = calcHandValue(item, value)
  })
  return value
})
const playerCards = computed(() => pokers.value?.slice(0, 2) ?? [])
const playerValue = computed(() => {
  let value = [0, 0]
  playerCards.value.forEach((item: PokerCardItem) => {
    value = calcHandValue(item, value)
  })
  return value
})
const restPokers = computed(() => pokers.value?.slice(4) ?? [])

const players = computed(() => [{ card: playerCards.value, value: playerValue.value }])

const gameBlackJackRef = ref()
const { width: WrapWidth } = useElementSize(gameBlackJackRef)
const fontSizeGameRoot = computed(() => {
  if (WrapWidth.value > 900)
    return 1.5
  else if (WrapWidth.value <= 400)
    return 0.7
  else
    return (0.7 + 0.7 * (WrapWidth.value - 400) / (900 - 400)).toFixed(6)
})
</script>

<template>
  <div ref="gameBlackJackRef" class="w-full">
    <div
      :style="{ fontSize: `${fontSizeGameRoot}em` }"
      class="hands relative grid h-fit min-h-[250rem] w-full content-between gap-[14rem] bg-[length:40%] bg-center bg-no-repeat @md:h-auto"
    >
      <div class="text-tg-secondary-light desc text-center text-sm font-semibold leading-[20rem]">
        {{ $t('dealer') }}
      </div>
      <div class="dealer w-full flex justify-center">
        <div
          v-if="dealerCards && dealerCards.length"
          class="wrap relative mt-[1em] min-h-[7.9em] min-w-[5em] flex items-start text-[1.2em]"
          :style="{
            width: `${5 + 2.5 * (dealerCards.length - 1)}em`,
            height: `${7.9 + 1 * (dealerCards.length - 1)}em`,
          }"
        >
          <div
            v-for="card, idx in dealerCards"
            :key="idx"
            class="content dealt dealer-card"
            :class="[`card${idx}`]"
            :style="{ marginTop: `${idx}em`, marginLeft: idx === 0 ? '0' : '-2.5em' }"
          >
            <!-- :win="card.win" :lose="card.lose" :active="card.active" :draw="card.draw" -->
            <AppMiniGamePokerCard :animate-enabled="false" :rank="card.rank" :color="card.suit" :face-down="false" />
          </div>
          <div
            class="value none text-tg-text-white absolute left-full top-0 w-[7ch] translate-x-[-100%] translate-y-[-100%] rounded-full px-2 py-1 text-center text-sm font-extrabold"
          >
            {{ dealerValue.join(',') }}
          </div>
        </div>
      </div>
      <div class="desc text-tg-secondary-light text-center text-sm font-semibold leading-[20rem]">
        {{ $t('table_player') }}
      </div>
      <div v-if="players && players.length" class="player flex flex-row-reverse justify-around">
        <div
          v-for="(p, idx) in players"
          :key="idx"
          class="hand-wrap relative flex flex-col items-center justify-center"
        >
          <div
            class="wrap relative mt-[1em] min-h-[7.9em] min-w-[5em] flex items-start text-[1.2em]"
            :style="{
              width: `${5 + 2.5 * (p.card.length - 1)}em`,
              height: `${7.9 + 1 * (p.card.length - 1)}em`,
            }"
          >
            <div
              v-for="card, cdx in p.card"
              :key="cdx"
              class="content dealt player-card"
              :class="[`card${cdx}`]"
              :style="{
                marginTop: `${cdx}em`,
                marginLeft: cdx === 0 ? '0' : '-2.5em',
              }"
            >
              <!-- :win="isWin" :lose="isLose" :draw="isDraw" :active="splitActiveIndex === 0" -->
              <AppMiniGamePokerCard :animate-enabled="false" :rank="card.rank" :color="card.suit" :face-down="false" />
            </div>
            <div
              class="value none text-tg-text-white absolute left-full top-0 w-[7ch] translate-x-[-100%] translate-y-[-100%] rounded-full px-2 py-1 text-center text-sm font-extrabold"
            >
              <!-- :class="{ 'duration-[300ms]': animateEnabled, 'draw': isDraw === true, 'win': isWin === true, 'lose': isLose === true, 'active': splitActiveIndex === 0 }" -->
              {{ p.value.join(',') }}
            </div>
          </div>
        </div>
      </div>
      <div class="content scroll-x random-cards w-full">
        <div class="wrap w-full">
          <div class="wrap">
            <div class="slide-down w-fit flex items-center justify-center gap-8">
              <template v-for="(card, idx) in restPokers" :key="idx">
                <AppMiniGamePokerCard :rank="card.rank" :color="card.suit" :face-down="false" />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.random-cards.content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  font-size: 16px;
  width: 100%;
}
.divider {
  position: absolute;
  width: 2px;
  height: 80%;
  top: 50%;
  right: 100%;
  transform: translate(50%, -50%);
  background: var(--tg-secondary-grey);
}
.stats-row {
  display: grid;
  padding: 12px 14px;
  background: var(--tg-secondary-dark);
  border-radius: 3px;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  .col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 0.5em;
    &:first-of-type .divider {
      display: none;
    }
    dt {
      color: var(--tg-text-lightgrey);
      transition: 250ms;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    dd {
      margin-top: 4px;
      color: #fff;
      font-weight: 500;
      display: flex;
      align-items: center;
    }
  }
}
.dealer {
  .deck {
    & > *:not(:nth-child(1)) {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
.hands {
  grid-template-rows: repeat(4, max-content);
}
.hand-wrap {
  .active-left,
  .active-right {
    display: none;
  }
  &.is-active {
    .active-left,
    .active-right {
      display: block;
    }
  }
}
.value {
  box-shadow: var(--tg-box-shadow);
  transition-property: background, color, transform, opacity;
  transition-timing-function: ease-out;
  &.none {
    background: var(--tg-secondary-main);
  }
  &.active {
    background: #4391e7;
    color: #082f5a;
  }
  &.draw {
    background: #ff9d00;
    color: #633d00;
  }
  &.win {
    background: #1fff20;
    color: #004d00;
  }
  &.lose {
    background: #e9113c;
    color: white;
  }
}
</style>
