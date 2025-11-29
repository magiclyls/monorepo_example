<script setup lang="ts">
import type { CurrencyCode } from '~/composables/useCurrencyData'

interface Props {
  result: number
  segments: number
  risk: string
  currencyId?: CurrencyCode
  betAmount?: string
}

interface GameFooterListType {
  color: string
  odds: number
  oddsString: string
}
defineOptions({
  name: 'AppMiniGamePartWheelResultComponent',
})
const props = defineProps<Props>()

const { result, risk, segments, currencyId, betAmount } = toRefs(props)
const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())
const { toFixedByLockCurrency } = useMiniGameLockCurrency()
const { bool: isinput1Select } = useBoolean(false)
const { bool: isinput2Select } = useBoolean(false)
const wheelPayouts = [
  {
    payouts: [
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
    ],
    risk: 'low',
    rows: 10,
  },
  {
    payouts: [
      0,
      1.9,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
      3,
    ],
    risk: 'middle',
    rows: 10,
  },
  {
    payouts: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      9.9,
    ],
    risk: 'high',
    rows: 10,
  },
  {
    payouts: [
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
    ],
    risk: 'low',
    rows: 20,
  },
  {
    payouts: [
      1.5,
      0,
      2,
      0,
      2,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.8,
      0,
      2,
      0,
      2,
      0,
      2,
      0,
    ],
    risk: 'middle',
    rows: 20,
  },
  {
    payouts: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      19.8,
    ],
    risk: 'high',
    rows: 20,
  },
  {
    payouts: [
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
    ],
    risk: 'low',
    rows: 30,
  },
  {
    payouts: [
      1.5,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
      2,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.5,
      0,
      2,
      0,
      2,
      0,
      1.7,
      0,
      4,
      0,
      1.5,
      0,
      2,
      0,
    ],
    risk: 'middle',
    rows: 30,
  },
  {
    payouts: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      29.7,
    ],
    risk: 'high',
    rows: 30,
  },
  {
    payouts: [
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
    ],
    risk: 'low',
    rows: 40,
  },
  {
    payouts: [
      2,
      0,
      3,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.5,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.5,
      0,
      2,
      0,
      2,
      0,
      1.6,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
    ],
    risk: 'middle',
    rows: 40,
  },
  {
    payouts: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      39.6,
    ],
    risk: 'high',
    rows: 40,
  },
  {
    payouts: [
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
    ],
    risk: 'low',
    rows: 50,
  },
  {
    payouts: [
      2,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.5,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
      2,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
      1.5,
      0,
      5,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
    ],
    risk: 'middle',
    rows: 50,
  },
  {
    payouts: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      49.5,
    ],
    risk: 'high',
    rows: 50,
  },
]
const colorsEnum: { [t: string]: string } = {
  0: '#406c82',
  1.2: '#d5e8f2',
  1.5: '#00e403',
  1.6: '#d5e8f2',
  1.7: '#d5e8f2',
  1.8: '#d5e8f2',
  1.9: '#d5e8f2',
  2: '#fde905',
  3: '#7f46fd',
  4: '#fca32f',
  5: '#007bff',
  9.9: '#ff0000',
  19.8: '#ff0000',
  29.7: '#ff0000',
  39.6: '#ff0000',
  49.5: '#ff0000',
}

const inputRef1 = ref()
const inputRef2 = ref()
const inputRef3 = ref()
const gameFooterListActiveIndex = ref(-1)
const gameFooterListresIndex = ref(-1)
const oddsStatistics = ref<null | Record<string, number>>(null)
const showTipsBox = ref(true)
const gameFooterList = ref<GameFooterListType[]>([])
const isShowProfit = computed(() => betAmount.value)
const orderCurrencyType = computed(() => {
  if (currencyId.value)
    return getCurrencyConfigByCode(currencyId.value)?.name
  else
    return 'CNY'
})
/* 获胜利润 */
const winningProfit = computed(() => {
  const index = gameFooterListActiveIndex.value === -1 ? gameFooterListresIndex.value : gameFooterListActiveIndex.value
  return toFixedByLockCurrency(mul(+sub(gameFooterList.value[index]?.odds, 1), Number(betAmount.value)), orderCurrencyType.value)
})
/* 胜算 */
const winningChance = computed(() => {
  const index = gameFooterListActiveIndex.value === -1 ? gameFooterListresIndex.value : gameFooterListActiveIndex.value
  return `${oddsStatistics.value?.[gameFooterList.value[index]?.odds]} / ${segments.value}`
})
/* 计算弹框箭头位置 */
const arrowPosition = computed(() => {
  const index = gameFooterListActiveIndex.value === -1 ? gameFooterListresIndex.value : gameFooterListActiveIndex.value
  const average = 100 / gameFooterList.value.length * index
  switch (gameFooterList.value.length) {
    case 2:
      return `${average + 25}%`
    case 3:
      return `${average + 16.666666}%`
    case 5:
      return `${average + 10}%`
    case 6:
      return `${average + 8.3333333}%`
    default:
      return `${0}%`
  }
})
/** 游戏配置 */
function initConfig() {
  const payouts = wheelPayouts.filter(item => risk.value === item.risk && segments.value === item.rows)[0]?.payouts || []
  const odds = payouts[result.value]
  gameFooterList.value = [...new Set(payouts)].map((item) => {
    return {
      color: colorsEnum[item],
      odds: item,
      oddsString: `${item.toFixed(2)}x`,
    }
  })
  gameFooterListresIndex.value = gameFooterList.value.findIndex(item => item.odds === odds)
  oddsStatistics.value = countOccurrences(payouts)
}
/** 点击结果内容 */
function selectAll(event: MouseEvent, index: number) {
  if (index === 1) {
    if ((event.target as HTMLElement).tagName.toUpperCase() === 'INPUT' && isinput1Select.value === true)
      return inputRef3.value.select()
    isinput1Select.value = false
    inputRef3.value.select()
    setTimeout(() => {
      isinput1Select.value = true
      inputRef1.value.select()
    }, 50)
  }
  else if (index === 2) {
    if ((event.target as HTMLElement).tagName.toUpperCase() === 'INPUT' && isinput2Select.value === true)
      return inputRef3.value.select()
    isinput2Select.value = false
    inputRef3.value.select()
    setTimeout(() => {
      isinput2Select.value = true
      inputRef2.value.select()
    }, 50)
  }
}
/** 双击结果内容 */
function ondblclick(index: number) {
  if (index === 1)
    nextTick(() => inputRef1.value.select())
  else if (index === 2)
    nextTick(() => inputRef2.value.select())
}
function changeIndex(index: number) {
  if (gameFooterListActiveIndex.value === index)
    return
  if (index !== gameFooterListresIndex.value && gameFooterListresIndex.value !== gameFooterListActiveIndex.value) {
    showTipsBox.value = false
    isinput1Select.value = false
    isinput2Select.value = false
    setTimeout(() => {
      gameFooterListActiveIndex.value = index
      showTipsBox.value = true
    }, 50)
  }
}
/** 统计数组元素出现次数 */
function countOccurrences(arr: number[]) {
  const count: { [t: string]: number } = {}
  arr.forEach((item) => {
    count[item] = (count[item] || 0) + 1
  })
  return count
}
/** 添加全局点击事件监听器 */
function isClickOutside1() {
  document.addEventListener('click', ClickOutside1HadnleFn)
}
function ClickOutside1HadnleFn(event: MouseEvent) {
  // 检查点击是否发生在目标元素之外
  if (!document.querySelector('#inputWrapRef1')?.contains(event.target as Node)) {
    isinput1Select.value = false
    inputRef3.value.select()
  }
}
function isClickOutside2() {
  document.addEventListener('click', ClickOutside2HadnleFn)
}
function ClickOutside2HadnleFn(event: MouseEvent) {
  if (!document.querySelector('#inputWrapRef2')?.contains(event.target as Node)) {
    isinput2Select.value = false
    inputRef3.value.select()
  }
}

onMounted(() => {
  isClickOutside1()
  isClickOutside2()
})
onBeforeUnmount(() => {
  document.removeEventListener('click', ClickOutside1HadnleFn)
  document.removeEventListener('click', ClickOutside2HadnleFn)
})

watch(props, () => {
  initConfig()
}, { immediate: true })
</script>

<template>
  <div class="h-full w-full pt-[10px]0" :class="[isMobile ? 'pt-[16px]0' : 'pt-[10px]0']">
    <div class="box align-items-end relative grid gap-[1em]">
      <div
        v-for="item, index in gameFooterList"
        :key="item.color" :style="{ '--border-color': item.color }"
        :class="{ active: index === gameFooterListActiveIndex || index === gameFooterListresIndex }"
        class="text-tg-text-white footer-text-box shadow-tg-box-shadow bg-tg-secondary relative row-start-1 row-end-auto flex cursor-help items-center justify-center overflow-hidden rounded-[8px] font-semibold text-shadow-lg"
        @click="changeIndex(index)" @mouseenter="changeIndex(index)"
        @mouseleave="changeIndex(-1)"
      >
        <span class="relative leading-[1.5]" style="font-size: var(--tg-font-size-default);"><span>{{ item.oddsString
        }}</span></span>
      </div>
      <!-- 提示框 -->
      <div
        v-show="showTipsBox"
        class="bg-tg-secondary-grey footer-tips-box absolute right-0 w-full flex justify-between rounded-[4px] p-[1em]"
        :class="[isMobile ? 'flex-col flex-col-1em' : 'flex-row flex-row-1em']"
        style="bottom:calc(100% + 1em)"
        :style="{
          '--arrow-position': arrowPosition,
          '--column-count': gameFooterList.length,
          'animation': showTipsBox ? '300ms linear 0ms 1 normal both gameFooterTips' : '',
        }"
      >
        <BaseLabel id="inputWrapRef1" class="order-2 flex-1" :label="t('mini_win_profit')" @click="selectAll($event, 1)">
          <div class="bg-tg-secondary shadow-tg-box-shadow flex items-center justify-between rounded-[4px]">
            <div
              class="text-tg-text-white border-tg-secondary hover:border-[var(--tg-text-grey)] flex flex-1 items-center justify-between border-[2px] rounded-[4px] border-solid p-[0.5em] font-semibold leading-[1.5]"
              :class="{ 'border-tg-text-grey': isinput1Select }"
            >
              <input
                ref="inputRef1" :value="winningProfit" type="text" autocomplete="on" readonly
                class="text-tg-text-white bg-tg-secondary leading[1.5] cursor-text appearance-none" @dblclick="ondblclick(1)"
              >
              <AppCurrencyIcon style="--tg-app-currency-icon-size:16px" :currency-type="orderCurrencyType" />
            </div>
          </div>
        </BaseLabel>
        <BaseLabel id="inputWrapRef2" class="order-2 flex-1" :label="t('win_chance')" @click="selectAll($event, 2)">
          <div class="bg-tg-secondary shadow-tg-box-shadow flex items-center justify-between rounded-[4px] font-semibold">
            <div
              class="text-tg-text-white border-tg-secondary hover:border-[var(--tg-text-grey)] flex flex-1 items-center justify-between border-[2px] rounded-[4px] border-solid p-[0.5em] font-semibold leading-[1.5]"
              :class="{ 'border-tg-text-grey': isinput2Select }"
            >
              <input
                ref="inputRef2" :value="winningChance" type="text" autocomplete="on" readonly
                class="leading[1.5] text-tg-text-white bg-tg-secondary cursor-text appearance-none" @dblclick="ondblclick(2)"
              >
            </div>
          </div>
        </BaseLabel>
      </div>
    </div>
    <input ref="inputRef3" class="h-[0px] w-[0px]" type="text" readonly>
  </div>
</template>

<style lang='scss' scoped>
.flex-col-1em{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }
}
.flex-row-1em{
  > *:not(:first-child) {
    margin-left: var(--tg-spacing-16);
  }
}
.footer-text-box {
  padding: 0.75em 0.5em calc(0.75em + 3px);
  &::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    transform: translateY(calc(100% - 6px));
    background: var(--border-color);
    box-shadow: var(--tg-box-shadow);
    transition-duration: .2s;
    transition-timing-function: ease-out;
    transition-property: transform;
  }

  &.active::before {
    transform: translateY(0);
  }
}

.footer-tips-box {
  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: var(--arrow-position);
    width: 0;
    height: 0;
    font-weight: 600;
    border-style: solid;
    border-width: .5em .5em 0;
    border-color: var(--tg-secondary-grey) transparent transparent transparent;
    transform: translate(-50%);
  }
}
.box {
  @include webTheme('green') {
    --tg-base-button-style-bg: #197B59;
    --tg-secondary-text-color-theme-green:#ffffff;
  }
}
</style>
