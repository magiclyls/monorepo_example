<script setup lang="ts">
import { withDefaults } from 'vue'

interface Props {
  condition?: 'below' | 'above'
  target?: number
  result: number
}
defineOptions({
  name: 'AppMiniGamePartDragontowerResultComponent',
})
const props = withDefaults(defineProps<Props>(), {
  condition: 'above',
  target: 1,
})
</script>

<template>
  <div class="dragon-tower-game text-[0.5em] @[800px]:text-[1em]">
    <!-- 游戏显示区 -->
    <div class="unselectable board-wrapper dragon @[800px]:min-h-[630px]">
      <!-- 游戏显示区 -->
      <div class="dragon-wrap animations-enabled">
        <img class="castle" :src="isWinAll ? '/stake/img/game/castle-top-win.svg' : '/stake/img/game/castle-top.svg'" alt="castle">
      </div>
      <!-- 投注区 -->
      <div class="board">
        <div v-for="(rowItem, rowIndex) in tilesList" :key="rowIndex" class="row" :data-dragon-tower-tile-row="rowIndex">
          <AppMiniGamePartDragonTile
            v-for="(colItem, colIndex) in rowItem" :key="`${rowIndex}-${colIndex}`" :index="colIndex" :is-auto="isAutoBet"
            :is-open-all="isOpenAll"
            :difficult="difficult"
            :fire="fire"
            :egg="egg"
            :skull="skull"
            :data="colItem" :animate-enabled="animateEnabled" :active-row="activeRowList(rowIndex, activeRow)" @click="openTile(rowIndex, colIndex)"
          />
        </div>
      </div>
      <!-- 底部区 -->
      <div class="castle-bottom-wrap">
        <img class="castle-bottom" src="/stake/img/game/castle-top.svg" alt="castle">
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --background-image: url(/png/casino/background-dragon-tower.png);
  --text-size-default:.875rem;
  --draggon-tower-border-color: #56687a;
  --dragon-tower-bg-color: #182433;
  --dragon-tower-max-width: 500px;
  --radius-md:.5rem;
  --dragonScale: 0.6;
  --shadows-lg:0 10px 15px -3px rgba(0, 0, 0, .2), 0 4px 6px -2px rgba(0, 0, 0, .1);
  --space-1:.25rem;
  --space-2:.5rem;
  --radius-base:.25rem;
  --duration: 300ms;
  --fetch-duration: 600ms;
  --grey-600:#1a2c38;
  --grey-500:#213743;
  --grey-400:var(--tg-secondary-main);
  --green-400: #1fff20;
  --green-500:#00e701;
  --green-600:#00b801;
  --grey-300:#557086;
  --red-500:#e9113c;
  --red-700:#8c0a24;
  --purple-600:#7100c7;
  --purple-500:#9000ff;
  --spacingEm-0-75:.75em;
  --spacingEm-1:1em;
}
</style>

<style lang='scss'>
@keyframes revealCss {
  0% {
    opacity: 1;
    border-color: var(--grey-500);
  }

  to {
    opacity: .4;
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
  0%,to {
    transform: scale(1)
  }

  50% {
    transform: scale(1.03)
  }
}
.dragon-tower-game {
  width: 100%;
  height: 100%;
  /** font-size: 1em; PC版为1em,手机版为0.5em */
  position: relative;
}
/** 投注区 */
.board {
  position: relative;
  display: flex;
  max-width: var(--dragon-tower-max-width);
  width: 100%;
  margin: 0 auto;
  flex-direction: column-reverse;
  z-index: 3;
  padding: var(--space-1);
  background-color: var(--dragon-tower-bg-color);
  border-left: var(--space-2) solid var(--draggon-tower-border-color);
  border-right: var(--space-2) solid var(--draggon-tower-border-color);
  border-bottom-right-radius: var(--space-2);
  border-bottom-left-radius: var(--space-2);
}
.row {
  display: flex;
  position: relative;
  padding: var(--space-1);
  border-radius: var(--space-1);
  border-top-right-radius: 0;
  border: 2px solid transparent;
  transition: all .3s;
}
.row>*+* {
  margin-left: calc(var(--space-2) + 4px);
}
.board-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image:var(--background-image);
  padding: 4em 2em 2em;
  background-size: cover;
}
.board-wrapper.dragon {
  padding-top: clamp(100px,12em,140px);
}
.unselectable {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */
}
/** 龙头动画部分 */
.dragon-wrap {
  position: relative;
  max-width: var(--dragon-tower-max-width);
  width: 100%;
  margin: 0 auto;
}
.castle {
  position: relative;
  z-index: 2;
  top: -30px;
  margin-bottom: -30px;
}
.dragon-head {
  position: absolute;
  bottom: 8%;
  left: 50%;
  width: 20%;
  z-index: 4;
  transform: scale(.9) translate(-60%)
}
.dragon-body {
    position: absolute;
    bottom: 0;
    z-index: 1;
    transform: scale(1.8) translateY(5%);
    pointer-events: none;
}
.dragon-body-sprite,.dragon-head-sprite {
  width: 100%;
}
.dragon-head-sprite {
    & > * {
    z-index: 4;
  }
}
.dragon-body-sprite {
    & > * {
    z-index: 0;
  }
}
.dragon-body-sprite,.dragon-head-sprite {
  & > * {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%) scale(var(--dragonScale));
    pointer-events: none;
  }
}
.sprite-sheet {
  pointer-events: none;
}
/** 底部区 */
.castle-bottom-wrap {
  max-width: var(--dragon-tower-max-width);
  width: 100%;
  margin: 0 auto;
}
.castle-bottom {
  width: 100%;
  max-width: var(--dragon-tower-max-width);
  border-bottom-right-radius: var(--space-2);
  border-bottom-left-radius: var(--space-2);
  z-index: 0;
  position: relative;
  margin-top: -10%;
}
.fade-enter-active,
.fade-leave-active {
  transition: all var(--duration) ease;
  transform-origin: center;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
