<script setup lang='ts'>
import gsap from 'gsap'
import { CustomEase } from 'gsap/all'
import type { OriginalGameMinesTile } from '~/shims'

interface Props {
  animateEnabled: boolean
  data: OriginalGameMinesTile
  isAuto?: boolean
  isChosen?: boolean
  index: number
  /** 立即展示结果 */
  immediately?: boolean
}
defineOptions({
  name: 'AppMiniGamePartMinesTile',
})
const props = defineProps<Props>()

const { bool: isShowResult } = useBoolean(false)
const { bool: isInit } = useBoolean(false)

const duration = computed(() => props.animateEnabled ? 0.3 : 0.1)

/** 钻石 */
const isGem = computed(() => props.data.result === 'gem')
/** 炸弹 */
const isMine = computed(() => props.data.result === 'mine')
/** 打开炸弹 */
const isBomb = computed(() => props.data.result === 'mine' && (props.data.openByPlayer || (props.isAuto && props.data.chosen)))
/** 有结果 */
const isHasResult = computed(() => isGem.value || isMine.value)
/** 手动打开 */
const isOpenByPlayer = computed(() => props.data.openByPlayer)
/** 请求数据 */
const isFetching = computed(() => props.data.fetching)
/** 自动模式下选中 */
const isChosen = computed(() => props.isAuto && props.data.chosen)

function onResultUpdate() {
  if (props.animateEnabled) {
    gsap.fromTo(`.tg-tile-${props.index}`,
      {
        opacity: 1,
      }, {
        scale: 0,
        opacity: 0,
        duration: duration.value,
      })
      .then(() => {
        isShowResult.value = true
        nextTick(() => {
          gsap.fromTo(`.tg-result-${props.index}`, {
            scale: 0,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: duration.value,
            ease: CustomEase.create('custom', '0.87, -0.41, 0.19, 1.44'),
          })
        })
      })
  }
  else {
    isShowResult.value = true
    gsap.to(`.tg-result-${props.index}`, { scale: 1, opacity: 1 })
  }
}
function reset() {
  isShowResult.value = false
  isInit.value = true
  props.animateEnabled && gsap.to(`.tg-result-${props.index}`, { scale: 0, opacity: 0 })
  setTimeout(() => {
    isInit.value = false
  }, props.animateEnabled ? 300 : 0)
}

watch(() => props.data.result, (a, b) => {
  if (a)
    onResultUpdate()
  else if (!a && b)
    reset()
})

gsap.registerPlugin(CustomEase)

onMounted(() => {
  setTimeout(() => {
    isInit.value = false
    if (props.immediately)
      onResultUpdate()
  }, props.animateEnabled ? 300 : 0)
})
</script>

<template>
  <button :disabled="isHasResult || isFetching" :class="isHasResult ? 'cursor-default' : 'cursor-pointer'">
    <div
      :style="{
        '--duration': animateEnabled ? '300ms' : '0',
        '--fetch-duration': animateEnabled ? '600ms' : '0',
      }" class="text-[1.5em]"
    >
      <div
        class="group relative after:block after:pb-[100%] after:content-['']"
        :class="[isHasResult ? 'bg-tg-secondary-deepdark theme-res-bg rounded-[0.5rem]' : '']"
      >
        <div
          :class="[
            `tg-result-${props.index}`, isShowResult ? 'opacity-100' : 'opacity-0',
          ]"
          class="absolute left-0 top-0 h-full w-full"
        >
          <!-- 钻石 -->
          <div v-if="isGem" :class="[isOpenByPlayer || isChosen ? 'gen-active' : 'scale-[0.7] opacity-[0.3]']" class="tg-gem h-full w-full" />
          <!-- 爆炸 -->
          <template v-if="isBomb">
            <img
              class="absolute left-[50%] top-[50%] block w-[150%] translate-x-[-50%] translate-y-[-50%]"
              src="/stake/webp/mines/mine-effect.webp" alt=""
            >
            <div class="tg-bomb absolute left-0 top-0 h-full w-full" />
          </template>
          <!-- 炸弹 -->
          <div v-else-if="isMine" :class="[isOpenByPlayer || isChosen ? 'bomb-active' : 'scale-[0.7] opacity-[0.3]']" class="tg-bomb h-full w-full" />
        </div>
        <!-- 自动投注时始终显示的选中框 -->
        <div v-if="isAuto && isChosen" class="theme-br absolute h-full w-full border-[5px] rounded-[0.5rem] border-solid group-hover:translate-y-[-0.15em]" />

        <!-- 默认状态 -->
        <div
          v-if="!isShowResult"
          class="absolute left-0 top-0 h-full w-full rounded-[0.5rem] opacity-100 active:translate-y-0"
          :class="[`tg-tile-${index}`,
                   isAuto && isChosen ? 'theme-bg  group-hover:bg-[#962eff]' : 'theme-box-shadow theme-default-bg group-hover:bg-tg-third-grey',
                   isFetching ? 'group-hover:bg-tg-secondary' : 'group-hover:translate-y-[-0.15em]',
                   {
                     'tg-fetching': isFetching,
                     'tg-tile-in': isInit,
                   },
          ]"
        />
      </div>
    </div>
  </button>
</template>

<style lang='scss' scoped>
.theme-default-bg{
  background-color: var(--tg-secondary-main);
  @include webTheme('white'){
    --tg-secondary-main:#ACACAC;
    --tg-third-grey:#cecece;
  }
}
.theme-res-bg{
  @include webTheme('green'){
    background-color: #083023;
  }
  @include webTheme('white'){
    background-color: #555;
  }
}
.theme-bg{
  background-color: #9000ff;
  box-shadow: 0 0.3em #7100c7;
  @include webTheme('green'){
    background-color: #FFEFB0;
    box-shadow: 0 0.3em #CCBA74;
  }
  @include webTheme('white'){
    background-color: #F2CA5C;
    box-shadow: 0 0.3em #B78601;
  }
}
.theme-br{
  border-color:#9000ff;
  box-shadow: 0 0.3em #7100c7;
  @include webTheme('green'){
    border-color: #FFEFB0;
    box-shadow: 0 0.3em #CCBA74;
  }
  @include webTheme('white'){
    border-color: #F2CA5C;
    box-shadow: 0 0.3em #B78601;
  }
}
.theme-box-shadow {
  box-shadow: 0 0.3em var(--tg-secondary-grey);
  @include webTheme('white'){
    box-shadow: 0 0.3em #8A8A8A;
  }
}

.tg-gem,
.tg-bomb {
  background-image: url('/stake/img/game/game-mines-diamond.svg');
  background-size: 70%;
  background-position: center;
  background-repeat: no-repeat;

}

.tg-bomb {
  background-image: url('/stake/img/game/game-mines-bomb.svg');
}

/** 开奖结果进场动画 */
.tg-scale-in {
  animation-duration: var(--duration);
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(.87, -.41, .19, 1.44);
  animation-name: scale-in;
}

@keyframes scale-in {
  0% {
    background-size: 0%;
  }

  100% {
    background-size: 70%;
  }
}

/** 方块进场动画 */
.tg-tile-in {
  animation-fill-mode: forwards;
  animation-name: tile-in;
  animation-duration: var(--duration);
  animation-timing-function: cubic-bezier(.87, -.41, .19, 1.44);
}

@keyframes tile-in {
  0% {
    opacity: 0;
    transform: scale(0);
  }
}

/** 方块退场动画 */
.tg-tile-out {
  animation-name: tile-out;
  animation-duration: var(--duration);
  animation-fill-mode: forwards;
  animation-timing-function: unset;
}

@keyframes tile-out {
  0% {
    opacity: 1;
  }

  100% {
    transform: scale(0);
    opacity: 0;
  }
}

/** 请求接口时动画 */
.tg-fetching {
  animation-name: fetching;
  animation-duration: var(--fetch-duration);
  animation-iteration-count: infinite;
  animation-timing-function: unset;
}

@keyframes fetching {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }
}
</style>
