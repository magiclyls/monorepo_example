<script setup lang='ts'>
import { IconUniTriDown, IconUniTriUp } from '@tg/icons'
import { useSportsStore } from '@tg/stores'
import { ref, watch } from 'vue'

interface Props {
  odds: string
  arrow?: 'left' | 'right'
  keep?: boolean
  /** 是否显示浮动箭头 */
  showArrow?: boolean
  arrowPosition?: 'relative' | 'absolute'
  prefix?: string
  textColor?: boolean
}

defineOptions({
  name: 'AppSportsOdds',
})
const props = withDefaults(defineProps<Props>(), {
  arrow: 'right',
  showArrow: true,
  arrowPosition: 'relative',
})

const saveNum = ref(props.odds)
const upDown = ref('')
const icon = ref('')
let timer: any

const sportsStore = useSportsStore()

function resetUpDown() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    upDown.value = ''
    clearTimeout(timer)
  }, 3200)
}
watch(() => props.odds, (newOdds) => {
  if (+saveNum.value !== +newOdds) {
    upDown.value = +newOdds > +saveNum.value ? 'up' : 'down'
    icon.value = +newOdds > +saveNum.value ? 'up' : 'down'
    resetUpDown()
    saveNum.value = newOdds
  }
})
</script>

<template>
  <div class="app-sports-odds" :class="[arrow, arrowPosition === 'absolute' ? 'gap-0' : 'gap-[4rem]']">
    <div class="odds" :class="[textColor ? `odds-${upDown}` : '']">
      <span v-if="prefix" class="prefix">{{ prefix }}</span><span v-html="sportsStore.renderOdds(+odds).value" />
    </div>
    <div
      v-if="showArrow" class="icon arrow-odds"
      :class="[`odds-${upDown}`, { keep }, arrowPosition]"
    >
      <IconUniTriUp v-if="icon === 'up'" />
      <IconUniTriDown v-else-if="icon === 'down'" />
    </div>
  </div>
</template>

<style>
:root {
  --ss-sports-odds-color: #025be8;
  --ss-sports-odds-text-align: start;
  --ss-sports-odds-font-size: 14rem;
  --ss-sports-odds-arrow-absolute-left: -12px;
  --ss-sports-odds-up-color: #2ba471;
  --ss-sports-odds-down-color: #ff4d4f;
}
</style>

<style lang='scss' scoped>
.app-sports-odds {
  display: inline-grid;
  position: relative;

  .odds {
    grid-area: odds;
    font-weight: 700;
    font-size: var(--ss-sports-odds-font-size);
    color: var(--ss-sports-odds-color);
    text-align: var(--ss-sports-odds-text-align);
    display: flex;
    align-items: center;
    .prefix {
      font-family: proxima-nova;
      margin-right: 2px;
    }
  }

  .icon {
    grid-area: arrow;
    font-size: 12rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    color: var(--ss-sports-odds-color);
    &.relative {
      position: relative;
    }
    &.absolute {
      position: absolute;
      left: var(--ss-sports-odds-arrow-absolute-left);
      top: 3px;
    }

    &.keep {
      opacity: 1;
    }
  }

  &.left {
    grid-template-areas: 'arrow odds';
    justify-content: flex-end;
  }

  &.right {
    grid-template-areas: 'odds arrow';
    justify-content: flex-start;
  }
  .odds-up {
    color: var(--ss-sports-odds-up-color);
  }
  .odds-down {
    color: var(--ss-sports-odds-down-color);
  }
}

// 赔率变化箭头动画
.arrow-odds {
  animation-duration: 0.8s;
  animation-iteration-count: 4;
  animation-fill-mode: forwards;
}

.odds-up {
  animation-name: flashingUp;
}

.odds-down {
  animation-name: flashingDown;
}

@keyframes flashingDown {
  0%,
  20% {
    transform: translateY(-20%);
    opacity: 1;
  }

  100% {
    transform: translateY(20%);
    opacity: 0;
  }
}

@keyframes flashingUp {
  0%,
  20% {
    transform: translateY(20%);
    opacity: 1;
  }

  100% {
    transform: translateY(-20%);
    opacity: 0;
  }
}
</style>
