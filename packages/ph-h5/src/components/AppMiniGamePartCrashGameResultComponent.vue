<script lang="ts" setup>
import { PhBaseInput } from '@tg/bccomponents'
import { useElementSize } from '@vueuse/core'
import { computed, ref } from 'vue'

interface Props {
  result?: number | string
  betPoint?: number | string
}
defineOptions({
  name: 'AppMiniGamePartCrashGameResultComponent',
})
const props = defineProps<Props>()

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
      class="w-full px-16"
      :class="[betPoint ? 'pb-16' : '']"
    >
      <div class="w-full flex grow flex-col items-center justify-center">
        <div class="wrap flex-col-16 mb-16 mt-12 w-full flex flex-col">
          <div class="text-tg-text-white text-center text-[28rem] font-semibold leading-[42rem]">
            {{ result }}x
          </div>
          <div v-if="betPoint">
            <PhBaseInput readonly :model-value="betPoint" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flex-col-16 {
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
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
