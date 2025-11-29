<script setup lang='ts'>
import { useMiniGameDiamondsData } from '@tg/hooks'
import { computed } from 'vue'

interface Props {
  result: string[]
  animateEnabled?: boolean
}
defineOptions({
  name: 'AppMiniGamePartDiamondsGameResult',
})
const props = defineProps<Props>()

const { getMatchList } = useMiniGameDiamondsData()

const matchList = computed(() => getMatchList(props.result))
</script>

<template>
  <div
    class="relative w-full flex grow flex-col items-center justify-end" :style="{
      '--duration': animateEnabled ? '300ms' : '0',
    }"
  >
    <div class="tg-theme w-full flex grow items-end rounded-[8rem] p-[16rem]">
      <div class="grid grid-cols-5 w-full gap-[1em]">
        <div v-for="item, i in result" :key="i" class="diamond-wrap">
          <!-- 底座 -->
          <div
            class="diamond-tile" :class="matchList.includes(item) ? item : ''"
            style="--rotate-x: 70deg; --radius: 0.3em;"
          />
          <!-- 宝石层 -->
          <div class="relative h-full w-full">
            <div class="absolute bottom-[13%] left-[50%] h-[14%] w-[60%] translate-x-[-50%]">
              <div v-show="!!item" class="shadow-gem" />
            </div>
            <!-- 宝石 -->
            <div class="absolute left-[50%] top-[-8%] w-full translate-x-[-50%]">
              <transition name="fade">
                <object v-if="!!item" type="image/svg+xml" :data="`/ph-h5/game/diamonds_${item}.svg`" class="h-full w-full" />
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.diamond-wrap {
  width: 100%;
  position: relative;

  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  .diamond-tile {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    transform: rotateX(var(--rotate-x)) translateY(100%);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border-radius: var(--radius);
      transition-duration: 0.3s;
      transition-timing-function: ease-out;
      transition-property: background-color;
      background-color: var(--app-mini-game-diamonds-result-tile-before);
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border-radius: var(--radius);
      transition-duration: 0.3s;
      transition-timing-function: ease-out;
      transition-property: background-color;
      transform: translateY(-20%);
      background-color: var(--app-mini-game-diamonds-result-tile-after);
    }

    &.orange::before {
      background-color: #ff4fb6;
    }

    &.orange::after {
      background-color: #ab186f;
    }

    &.red::before {
      background-color: #ff1c44;
    }

    &.red::after {
      background-color: #991029;
    }

    &.purple::before {
      background-color: #7633fa;
    }

    &.purple::after {
      background-color: #430bb0;
    }

    &.yellow::before {
      background-color: #fec916;
    }

    &.yellow::after {
      background-color: #81670e;
    }

    &.cyan::before {
      background-color: #03bfc7;
    }

    &.cyan::after {
      background-color: #02858b;
    }

    &.green::before {
      background-color: #17d118;
    }

    &.green::after {
      background-color: #006b01;
    }

    &.blue::before {
      background-color: #1e6eef;
    }

    &.blue::after {
      background-color: #0e3d8c;
    }
  }
}

.shadow-gem {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation-name: shadow-scale;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  background: #0003;
  animation-play-state: running;
}

@keyframes shadow-scale {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all var(--duration) ease;
  transform-origin: center;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
