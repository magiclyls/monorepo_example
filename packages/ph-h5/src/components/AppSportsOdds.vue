<script setup lang='ts'>
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
  <div class="app-sports-odds" :class="[arrow, arrowPosition === 'absolute' ? 'gap-0' : 'gap-4']">
    <div class="odds" :class="[textColor ? `odds-${upDown}` : '']">
      <span v-if="prefix" class="prefix">{{ prefix }}</span><span v-html="sportsStore.renderOdds(+odds).value" />
    </div>
    <div
      v-if="showArrow" class="icon arrow-odds"
      :class="[`odds-${upDown}`, { keep }, arrowPosition]"
    >
      <component :is="`IconUniTri${icon}`" />
    </div>
  </div>
</template>

<style>
:root {
  --tg-sports-odds-color: var(--tg-text-lightblue);
  --tg-sports-odds-text-align: start;
  --tg-sports-odds-font-size: 14rem;
  --tg-sports-odds-arrow-absolute-left: -12px;
  --tg-sports-odds-up-color: #00e700;
  --tg-sports-odds-down-color: #ff2247;
}
</style>

<style lang='scss' scoped>
.app-sports-odds {
  display: inline-grid;
  position: relative;

  .odds {
    grid-area: odds;
    font-weight: var(--tg-font-weight-bold);
    font-size: var(--tg-sports-odds-font-size);
    color: var(--tg-sports-odds-color);
    text-align: var(--tg-sports-odds-text-align);
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
    &.relative {
      position: relative;
    }
    &.absolute {
      position: absolute;
      left: var(--tg-sports-odds-arrow-absolute-left);
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
    color: var(--tg-sports-odds-up-color);
  }
  .odds-down {
    color: var(--tg-sports-odds-down-color);
  }
}
</style>
