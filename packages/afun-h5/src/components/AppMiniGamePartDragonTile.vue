<script setup lang='ts'>
import type { OriginalGameDragonTile } from '@tg/types'
import { useMiniGameDragonTowerData } from '@tg/hooks/useMiniGameDragonTowerData'
import { computed, ref } from 'vue'

interface Props {
  animateEnabled: boolean
  data: OriginalGameDragonTile
  isAuto?: boolean
  isOpenAll: boolean
  index: number
  activeRow: boolean
  difficult: string
  fire: string
  egg: string
  skull: string
}
defineOptions({
  name: 'AppMiniGamePartDragonTile',
})
const props = defineProps<Props>()
const { showAsyncResult } = useMiniGameDragonTowerData()
const skullRef = ref<HTMLDivElement | null>(null)
const skullAni = ref()
const fireEggRef = ref<HTMLDivElement | null>(null)
const fireEggAni = ref()
/** 龙蛋 */
const isEgg = computed(() => props.data.result === 'egg')
/** 头骨 */
const isSkull = computed(() => props.data.result === 'skull')
/** 隐藏的头骨 */
const isHiddenSkull = computed(() => props.data.result === 'skull-hidden')
/** 有结果 */
const isHasResult = computed(() => isEgg.value || isSkull.value || isHiddenSkull.value)
/** 自动模式下是否全部打开 */
const isOpenAll = computed(() => props.isOpenAll)
/** 手动打开 */
const isOpenByPlayer = computed(() => props.data.openByPlayer)
/** 自动模式 */
const isAuto = computed(() => props.isAuto)
/** 自动模式下选中 */
const isChosen = computed(() => props.isAuto && props.data.chosen)
/** 切换样式 */
const changeClass = computed(() => {
  if (isEgg.value) {
    return isOpenByPlayer.value ? 'status-win state-chosen' : 'status-win state-revealed'
  }
  else if (isSkull.value) {
    return isOpenByPlayer.value ? 'status-lose state-chosen' : 'status-lose state-revealed'
  }
  else {
    if (props.activeRow)
      return 'status-none state-active'

    else if (isChosen.value)
      return isHiddenSkull.value ? 'status-none state-revealed' : 'status-none state-autobetSelected'

    else
      return isOpenAll.value ? 'status-none state-revealed' : 'status-none state-hidden'
  }
})
/** 获取禁用状态 */
const getDisabled = computed(() => {
  return isAuto.value ? false : !props.activeRow
})
/** 画出结果 */
const drawResult = computed(() => {
  if (isEgg.value && isOpenByPlayer.value)
    showAsyncResult(fireEggRef, fireEggAni, false, 0.5, props.egg)
  else if (isSkull.value && isOpenByPlayer.value)
    showAsyncResult(skullRef, skullAni, false, 0.5, props.fire, props.skull)
  else
    return ''
})
</script>

<template>
  <button
    :disabled="getDisabled" type="button" class="tile"
    :class="changeClass"
  >
    <div class="bg-outer">
      <div
        class="tile-bg medium"
        :class="{ show: (!isOpenByPlayer || isHiddenSkull) }"
      >
        <!-- <span class="text-white">{{ activeRow }}-{{ isChosen }}</span> -->
        <svg class="background-pattern" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 249.65 45.23"><path fill="currentColor" d="M95.15,22.39a.51.51,0,0,0,.29.08.56.56,0,0,0,.46-.25.55.55,0,0,0-.17-.75L61.57.08a.55.55,0,0,0-.75.17A.55.55,0,0,0,61,1L81.67,14,66.51,22.78,30.27.08a.55.55,0,0,0-.75.17.55.55,0,0,0,.17.75l1.11.7L.27,19.49a.54.54,0,0,0-.2.74.54.54,0,0,0,.47.27.55.55,0,0,0,.28-.07l31-18.08,14.9,9.33L8.53,34,.83,29.13a.54.54,0,0,0-.58.92l24.11,15.1a.6.6,0,0,0,.29.08.54.54,0,0,0,.29-1L9.57,34.6l19.7-11.48L48.14,34.41a.6.6,0,0,0,.28.08.55.55,0,0,0,.28-.07l34-19.82ZM48.43,33.32,30.34,22.5,47.78,12.33,65.45,23.4Z" /><path fill="currentColor" d="M173.06,21.47,138.9.08a.54.54,0,0,0-.74.17.54.54,0,0,0,.17.75L159,14l-15.16,8.83L107.6.08a.55.55,0,0,0-.75.17A.55.55,0,0,0,107,1l1.11.7,1,.65,14.91,9.33L85.86,34a.85.85,0,0,0-.41.66c0,.36.47.66.47.66l15.78,9.88a.6.6,0,0,0,.28.08.54.54,0,0,0,.46-.25.54.54,0,0,0-.17-.75L86.9,34.6l19.7-11.48,18.88,11.29a.54.54,0,0,0,.28.08.54.54,0,0,0,.27-.07L160,14.6l12.44,7.79a.51.51,0,0,0,.29.08.54.54,0,0,0,.29-1Zm-47.3,11.85L107.67,22.5l17.45-10.17L142.78,23.4Z" /><path fill="currentColor" d="M87.5,33.62a.56.56,0,0,0-.75-.19L68.27,44.21a.54.54,0,0,0,.27,1,.53.53,0,0,0,.27-.08L87.3,34.37A.56.56,0,0,0,87.5,33.62Z" /><path fill="currentColor" d="M249.39,21.47,215.24.08a.54.54,0,0,0-.58.92l20.67,13-15.15,8.83L183.94.08a.54.54,0,0,0-.58.92l1.11.7,1,.65,14.9,9.33L162.2,34a.88.88,0,0,0-.42.66c0,.36.47.66.47.66L178,45.15a.6.6,0,0,0,.29.08.54.54,0,0,0,.29-1L163.24,34.6l19.69-11.48,18.88,11.29a.6.6,0,0,0,.28.08.5.5,0,0,0,.27-.07l34-19.82,12.45,7.79a.51.51,0,0,0,.29.08.56.56,0,0,0,.46-.25A.55.55,0,0,0,249.39,21.47ZM202.1,33.32,184,22.5l17.45-10.17L219.12,23.4Z" /><path fill="currentColor" d="M249.57,28.15a.54.54,0,0,0-.74-.2L220.94,44.21a.54.54,0,0,0,.27,1,.53.53,0,0,0,.27-.08l27.9-16.25A.54.54,0,0,0,249.57,28.15Z" /><path fill="currentColor" d="M163.89,33.59a.54.54,0,0,0-.74-.2L144.59,44.21a.54.54,0,0,0,.55.94L163.7,34.33A.54.54,0,0,0,163.89,33.59Z" /></svg>
      </div>
    </div>
    <div>
      <div class="result-wrapper">
        <div v-if="data.result === 'egg' && !isOpenByPlayer" class="symbol-wrap">
          <div class="symbol">
            <img :src="`/img/game/egg-${difficult}.svg`" alt="medium-win">
          </div>
        </div>
        <div
          v-else class="canvas"
          :class="{ hide: !(isEgg || isSkull) }"
        >
          <div class="sprite retina">
            <div
              ref="skullRef"
              class="skull"
              :class="{ hide: isEgg }"
            >
              {{ drawResult }}
            </div>
            <div
              ref="fireEggRef"
              class="fire-egg"
              :class="{ egg: isEgg }"
            >
              {{ drawResult }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </button>
</template>

<style>
:root {
  --background-image: url(/png/casino/background-dragon-tower.png);
  --text-size-default: 0.875px;
  --draggon-tower-border-color: #56687a;
  --dragon-tower-bg-color: #182433;
  --dragon-tower-max-width: 500px;
  --radius-md: 0.5px;
  --dragonScale: 0.6;
  --shadows-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
  --space-1: 0.25px;
  --space-2: 0.5px;
  --radius-base: 0.25px;
  --duration: 300ms;
  --fetch-duration: 600ms;
  --grey-600: #1a2c38;
  --grey-500: #213743;
  --grey-400: #2f4553;
  --green-400: #1fff20;
  --green-500: #24ee89;
  --green-600: #00b801;
  --grey-300: #557086;
  --red-500: #e9113c;
  --red-700: #8c0a24;
  --purple-600: #7100c7;
  --purple-500: #9000ff;
  --spacingEm-0-75: 0.75em;
  --spacingEm-1: 1em;
}
</style>

<style lang='scss'>
@keyframes revealCss {
  0% {
    opacity: 1;
    border-color: var(--grey-500);
  }

  to {
    opacity: 0.4;
    border-color: var(--grey-300);
    background-color: #1a2c38;
  }
}
@keyframes reveal {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes fetching {
  0%,
  to {
    transform: scale(1);
  }

  50% {
    transform: scale(1.03);
  }
}

.tile {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--grey-500);
  border: 2px solid transparent;
  border-radius: var(--radius-base);
  color: var(--grey-400);
  width: 100%;
  height: 2.8em;
  max-height: 56px;
  background-size: 260%;
  transition: transform 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.tile.state-chosen {
  border-color: var(--grey-300);
  background-color: #1a2c38;
}

.tile.state-revealed {
  animation-name: revealCss;
  animation-delay: 0.8s;
  animation-duration: 1ms;
  animation-fill-mode: forwards;
}

.tile.state-revealed .result-wrapper {
  opacity: 0;
  animation-name: reveal;
  animation-delay: 0.8s;
  animation-duration: var(--duration);
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0.87, 0, 0.13, 1);
}

.tile.state-fetching {
  animation-name: fetching;
  animation-duration: var(--fetch-duration);
  animation-iteration-count: infinite;
  background-color: var(--green-500);
  color: var(--green-600);
}

.tile.state-autobetSelected {
  border-color: var(--purple-600);
  background-color: var(--purple-500);
  color: var(--purple-500);
}

.tile.state-active {
  background-color: var(--green-500);
  color: var(--green-600);
}

.tile.state-active:hover {
  background-color: var(--green-400);
  transform: scale(1.01) translateY(-3px);
}

.tile.status-lose {
  border-color: var(--red-500);
  background-color: var(--red-700);
}
button {
  outline: none;
  line-height: 1.5;
}
.bg-outer {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.canvas.hide,
.symbopl-wrap.hide {
  visibility: hidden;
}
.result-wrapper {
  & > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    will-change: transform;
    pointer-events: none;
  }
}
.sprite {
  position: relative;
  width: 100%;
  height: 100%;
  transform: scale(0.45);
}
.sprite.retina {
  transform: scale(0.45) translateY(-20%);
}
.sprite.stacked {
  transform: scale(0.55) translateY(-20%);
}
.sprite.stacked.retina {
  transform: scale(0.45) translateY(-20%);
}
.background-pattern {
  overflow: hidden;
}
.skull,
.fire-egg {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 30%);
}
.skull canvas,
.fire-egg canvas {
  touch-action: none;
}
.skull.hide.hide {
  visibility: hidden;
}
.egg {
  transform: scale(0.55) translate(-90%, 80%);
}
.symbol {
  display: flex;
  align-items: center;
  justify-content: center;
}
.symbol img {
  height: min(3.2em, 3.2px);
  width: auto;
}
.tile-bg {
  display: none;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.tile-bg svg {
  width: 140%;
}

.tile-bg.easy svg,
.tile-bg.master svg {
  width: 280%;
}

.tile-bg.medium svg {
  width: 200%;
}

.tile-bg.expert svg {
  width: 200%;
}

.tile-bg.show {
  display: block;
}
</style>
