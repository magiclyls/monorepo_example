<script setup lang="ts">
import { computed, withDefaults } from 'vue'

defineOptions({
  name: 'AppMiniGamePartDiceResultComponent',
})
const props = withDefaults(defineProps<Props>(), {
  condition: 'above',
  target: 1,
})
interface Props {
  condition?: 'below' | 'above'
  target?: number
  result: number
}
const randomNumber = computed(() => props.result)
const rollValue = computed(() => props.target)
const isAbove = computed(() => props.condition === 'above')
const isWin = computed(() => {
  if (isAbove.value)
    return props.result > props.target
  else
    return props.result < props.target
})
</script>

<template>
  <!-- 游戏显示区 -->
  <div class="content svelte">
    <div
      class="svelte wrap" :data-test-dice-condition="[isAbove ? 'above' : 'below']" style="--slider-height:8px;--drag-size:36px;--max-game-board-width: 730px;
        --lines-asset: url(/img/game/lines.svg);"
    >
      <div class="wrap svelte-jyarsh">
        <div class="content svelte-jyarsh" style="left: 0%;">
          <div class="svelte-jyarsh value">
            0
          </div>
        </div>
        <div class="content svelte-jyarsh" style="left: 25%;">
          <div class="value svelte-jyarsh">
            25
          </div>
        </div>
        <div class="content svelte-jyarsh" style="left: 50%;">
          <div class="value svelte-jyarsh">
            50
          </div>
        </div>
        <div class="content svelte-jyarsh" style="left: 75%;">
          <div class="value svelte-jyarsh">
            75
          </div>
        </div>
        <div class="content svelte-jyarsh" style="left: 100%;">
          <div class="value svelte-jyarsh">
            100
          </div>
        </div>
      </div>

      <div class="svelte translate">
        <div class="svelte translate-x" :style="{ transform: `translate(${randomNumber}%, 0px)` }">
          <div class="svelte hide-show" :class="[isWin ? 'positive' : 'negative']">
            <img class="svelte dice" src="/afun-pc/img/game/classic-dice.svg" alt="Dice">
            <div class="svelte result" :class="[isWin ? 'positive' : 'negative']">
              {{ randomNumber.toFixed(2) }}
            </div>
          </div>
        </div>
        <div class="svelte range">
          <div :class="[isAbove ? 'lower above svelte' : 'lower below svelte']" /> <div :class="[isAbove ? 'higher above svelte' : 'higher below svelte']" :style="{ width: `${rollValue}%` }" />
        </div>
        <input :value="rollValue" readonly disabled type="range" class="svelte classic-slider" data-test="dice-slider">
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --slider-height: 8px;
  --lines-asset: url(/img/game/lines.svg);
  --radius-base: 0.25rem;
  --spacingEm-1-5: 1.5em;
  --grey-400: var(--tg-secondary-main);
  --shadows-md: 0 4px 6px -1px rgba(27, 23, 23, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12);
  --dice-scale-transition: 500ms;
  --drag-size: 36px;
  --max-game-board-width: 730px;
  --blue-400: #4391e7;
  --green-500: #00e701;
  --green-600: #00b801;
  --red-500: #e9113c;
  --grey-200: #b1bad3;
  --dice-slide-transition: 300ms;
  --dice-result-transition: 100ms;
}
</style>

<style lang='scss' scoped>
.unselectable {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */
}
.container {
  display: flex;
  flex-wrap: wrap;
}
@keyframes svelte-expand {
  50% {
    transform: scale(1.1) translate(-50%);
  }
}
.content.svelte {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  font-size: 16px;
  width: 100%;
}
.content.svelte-jyarsh::after {
  content: '';
  bottom: 0;
  position: absolute;
  transform: translate(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid var(--tg-secondary-main);
  @include webTheme('white') {
    border-bottom-color: #c1c1c1;
  }
}
.translate-x.svelte {
  position: absolute;
  display: flex;
  bottom: 50%;
  left: 0;
  right: 0;
  z-index: 5;
  pointer-events: none;
  transition: transform var(--dice-slide-transition);
  will-change: transform;
}
.wrap {
  font-size: 16px;
}

.svelte.wrap {
  position: relative;
  width: 100%;
  max-width: 730px;
  border-radius: 100px;
  padding: 24px;
  background: var(--tg-secondary-main);
  text-align: left;
  margin: 64px 0;
  box-shadow:
    0 4px 6px -1px rgba(27, 23, 23, 0.2),
    0 2px 4px -1px rgba(0, 0, 0, 0.12);
  @include webTheme('white') {
    background: #c1c1c1;
  }
}
.svelte.translate {
  position: relative;
  height: 8px;
}
.wrap.svelte-jyarsh {
  position: absolute;
  bottom: calc(100% - 1px);
  left: calc(1.5em + 4px);
  right: calc(1.5em + 4px);
}
.content.svelte-jyarsh {
  color: white;
  position: absolute;
  text-align: center;
  transform: translate(-50%);
}
.value.svelte-jyarsh {
  position: absolute;
  font-weight: 600;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, -50%);
  @include webTheme('white') {
    color: black;
  }
}
.hide-show.svelte {
  position: relative;
  transform: translate(-50%);
  transition: all var(--dice-scale-transition);
  transform-origin: center bottom;
}
.hide-show.positive.svelte,
.hide-show.negative.svelte {
  animation: svelte-expand var(--dice-scale-transition);
}
.hide-show.svelte.is-hidden {
  transform: translate(-50%) scale(0.8);
  opacity: 0;
}
.dice.svelte {
  width: 7ch;
  height: auto;
  filter: drop-shadow(0 0 3px rgba(25, 25, 25, 0.1));
}
.result.svelte {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 0 1px 0 #fff;
  font-weight: 600;
  transition: var(--dice-result-transition);
}
.result.neutral.svelte {
  color: var(--grey-200);
}
.result.positive.svelte {
  color: var(--green-600);
  @include webTheme('white') {
    color: #e9103d;
  }
}
.result.negative.svelte {
  color: var(--red-500);
  @include webTheme('white') {
    color: #00e700;
  }
}
.classic-slider.svelte {
  appearance: none;
  width: 100%;
  position: absolute;
  z-index: 10;
  background: #0000;
  top: 0;
  left: 0;
  height: 16px;
  pointer-events: none;
}
.classic-slider.svelte::-webkit-slider-thumb {
  height: var(--drag-size);
  width: var(--drag-size);
  border: none;
  background-color: #4391e7;
  background-image: var(--lines-asset);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 40%;
  cursor: grab;
  -webkit-appearance: none;
  border-radius: var(--radius-base);
  box-shadow: var(--shadows-md);
  transform: translateY(calc(var(--slider-height) * -1));
  pointer-events: auto;
}
.range.svelte {
  pointer-events: none;
  height: 8px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-radius: 100px;
  box-shadow: 0 0 0 10px #0f212e;
  transition: opacity 0.3s;
  overflow: hidden;
  @include webTheme('green') {
    box-shadow: 0 0 0 10px #02432d;
  }
  @include webTheme('white') {
    box-shadow: 0 0 0 10px #a4a4a4;
  }
}
.lower.svelte {
  position: absolute;
  height: 8px;
  width: 100%;
  right: 0;
  top: 0;
  border-radius: 100px;
}
.lower.above.svelte {
  background: var(--green-500);
  @include webTheme('white') {
    background: #e9103d;
  }
}
.lower.below.svelte {
  background: var(--red-500);
}
.higher.svelte {
  position: absolute;
  height: var(--slider-height);
  top: 0;
  left: 0;
  border-radius: 100px;
}
.higher.above.svelte {
  background: var(--red-500);
  @include webTheme('white') {
    background: #00e700;
  }
}
.higher.below.svelte {
  background: var(--green-500);
}
</style>
