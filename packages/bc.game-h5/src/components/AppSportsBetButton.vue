<script setup lang='ts'>
import { domTransition } from '@tg/utils'
import { computed, ref, watch } from 'vue'

interface Props {
  odds: string
  size?: 'big' | 'small'
}

/**
 *
 * 赔率上涨 右上角 绿色 闪烁，赔率从上往下滚动
 * 赔率下降 右下角 红色 闪烁，赔率从下往上滚动
 */

defineOptions({ name: 'AppSportsBetButton' })
const props = withDefaults(defineProps<Props>(), {
  size: 'small',
})

const betButton = ref()
const oldONum = ref('')
const saveNum = ref(props.odds)
const upDown = ref('')
const isSelected = ref(false)
let timerUpdown: any
let timerSpan: any

const direction = computed(() => {
  return upDown.value ? upDown.value === 'up' ? 'down' : 'up' : ''
})

function clickHandler() {
  isSelected.value = !isSelected.value

  if (isSelected.value)
    startDomTransition()
}
function startDomTransition() {
  const startDom = betButton.value
  const endDom = document.getElementById('bet-slip-header-total')

  if (!startDom || !endDom)
    return

  domTransition(startDom, endDom)
}

function resetUpDown() {
  clearTimeout(timerUpdown)
  timerUpdown = setTimeout(() => {
    upDown.value = ''
    clearTimeout(timerUpdown)
  }, 2000)
}

function resetOldNum() {
  clearTimeout(timerSpan)
  timerSpan = setTimeout(() => {
    oldONum.value = ''
    clearTimeout(timerSpan)
  }, 350)
}

watch(() => props.odds, (newOdds, oldOdds) => {
  upDown.value = ''
  oldONum.value = ''

  if (+saveNum.value !== +newOdds) {
    oldONum.value = oldOdds
    upDown.value = +newOdds > +saveNum.value ? 'up' : 'down'

    resetOldNum()
    resetUpDown()
    saveNum.value = newOdds
  }
})
</script>

<template>
  <div ref="betButton" :class="[size]" class="sports-bet-button" style="--odds-duration: 0.35s;">
    <div class="layer1" :class="[size, { 'is-selected': isSelected }]" @click="clickHandler">
      <div class="w-full h-full top-0 left-0 absolute">
        <span :class="`odd-${upDown}`" />
      </div>
      <div class="name">
        低于1.5
      </div>
      <div class="odds">
        <!-- 跌📉 -->
        <span v-if="oldONum && upDown === 'down'" class="move-up odd-span">{{ oldONum }}</span>
        <span :class="[`move-${direction} odd-span`]">
          {{ odds }}
        </span>
        <!-- 涨📈 -->
        <span v-if="oldONum && upDown === 'up'" class="move-down odd-span">{{ oldONum }}</span>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.sports-bet-button {
  width: 100%;
  height: 40px;

  &.small {
    padding: 4px;
  }

  .layer1 {
    background-color: #3a4142;
    border: solid 1px;
    border-color: #3a4142;
    transition: 0.2s ease-in-out;
    cursor: pointer;
    display: flex;
    padding: 0 8px;
    position: relative;
    line-height: 30px;
    justify-content: center;
    border-radius: 8px;
    font-weight: 600;
    height: 100%;

    &.small {
      height: 32px;
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: rgb(255, 255, 255);
        background: rgba(0, 0, 0, 0.05);
        border-color: rgba(0, 0, 0, 0.05);
      }
    }

    &.is-selected {
      color: rgb(35, 38, 38);
      background: rgb(36, 238, 137);
      border-color: rgb(36, 238, 137);

      &:hover {
        color: rgb(35, 38, 38);
        background: rgba(36, 238, 137, 0.75);
        border-color: rgba(36, 238, 137, 0.75);
      }
    }

    .name {
      display: flex;
      font-size: 12px;
      line-height: 1.2;
      flex: 1;
      padding-right: 4px;
      align-items: center;
    }

    .odds {
      display: flex;
      flex-direction: column;
      height: 1.2em;
      line-height: 1.2;
      font-size: 12px;
      overflow: hidden;
      align-self: center;
      text-align: right;

      .odd-span {
        display: block;
        height: 1.2em;
        line-height: 1.2;
        font-size: 12px;
      }
    }
  }
}

// 跌，赔率往上
.move-up {
  animation-name: oddGoDownSpanMoveUp;
  animation-duration: 0.35s;
}

@keyframes oddGoDownSpanMoveUp {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-100%);
  }
}

// 涨，赔率往下
.move-down {
  animation-name: oddGoUpSpanMoveDown;
  animation-duration: 0.35s;
}

@keyframes oddGoUpSpanMoveDown {
  from {
    transform: translateY(-100%);
  }

  to {
    transform: translateY(0);
  }
}

.odd-up {
  top: 2px;
  right: 2px;
  width: 0;
  height: 0;
  position: absolute;
  border-color: transparent #24ee89 transparent transparent;
  border-style: solid;
  border-width: 0 8px 8px 0;
  animation-name: Ani-odd-changed;
  animation-duration: 2s;
}

.odd-down {
  right: 2px;
  width: 0;
  bottom: 2px;
  height: 0;
  position: absolute;
  border-color: transparent transparent #fc3c3c transparent;
  border-style: solid;
  border-width: 0 0 8px 8px;
  animation-name: Ani-odd-changed;
  animation-duration: 2s;
}

@keyframes Ani-odd-changed {
  16% {
    opacity: 1;
  }

  32% {
    opacity: 0;
  }

  48% {
    opacity: 1;
  }

  64% {
    opacity: 0;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
