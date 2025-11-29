<script setup lang="ts">
import type { CurrencyCode } from '@tg/types'
import { AfunBaseCurrencyIcon, AfunBaseLabel } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { getCurrencyConfig, mul, sub } from '@tg/utils'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMiniGameLockCurrency } from '~/pages/original-game/composables'

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
    return getCurrencyConfig(currencyId.value)?.name
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
  <div class="h-[214px] w-full pt-[168px]">
    <div class="box align-items-end relative grid gap-[10px]">
      <div
        v-for="item, index in gameFooterList"
        :key="item.color" :style="{ '--border-color': item.color }"
        :class="{ active: index === gameFooterListActiveIndex || index === gameFooterListresIndex }"
        class="text-[#fff] footer-text-box shadow-tg-box-shadow bg-[#304554] relative row-start-1 row-end-auto flex cursor-help items-center justify-center overflow-hidden rounded-[8px] font-semibold text-shadow-lg"
        @click="changeIndex(index)" @mouseenter="changeIndex(index)"
        @mouseleave="changeIndex(-1)"
      >
        <span class="relative leading-[1.5]" style="font-size: 14px;"><span>{{ item.oddsString
        }}</span></span>
      </div>
      <!-- 提示框 -->
      <div
        v-show="showTipsBox"
        class="bg-[#fff] footer-tips-box p-[16px] absolute right-0 w-full flex justify-between rounded-[4px] flex-col gap-[10px]"
        style="bottom:calc(100% + 1em)"
        :style="{
          '--arrow-position': arrowPosition,
          '--column-count': gameFooterList.length,
          'animation': showTipsBox ? '300ms linear 0ms 1 normal both gameFooterTips' : '',
        }"
      >
        <AfunBaseLabel id="inputWrapRef1" class="order-2 flex-1" :label="t('获胜利润')" style="--afun-base-label-margin-bottom: 2px;" @click="selectAll($event, 1)">
          <div class="bg-[#fff] shadow-tg-box-shadow flex items-center justify-between rounded-[4px]">
            <div
              class="text-[#6D7693] border-[#EBEBEB] bg-[#F6F7F8] hover:border-tg-text-grey flex flex-1 items-center justify-between border-1 rounded-[4px] border-solid p-[0.5em] font-semibold leading-[1.5] h-[40px]"
              :class="{ 'border-tg-text-grey': isinput1Select }"
            >
              <input
                ref="inputRef1" :value="winningProfit" type="text" autocomplete="on" readonly
                class="text-[#0D2245] bg-[##F6F7F8] leading[1.5] cursor-text appearance-none" @dblclick="ondblclick(1)"
              >
              <AfunBaseCurrencyIcon style="--tg-app-currency-icon-size:16px" :currency-type="orderCurrencyType" />
            </div>
          </div>
        </AfunBaseLabel>
        <AfunBaseLabel id="inputWrapRef2" class="order-2 flex-1" :label="t('胜算')" style="--afun-base-label-margin-bottom: 2px;" @click="selectAll($event, 2)">
          <div class="bg-[#F6F7F8] shadow-tg-box-shadow flex items-center justify-between rounded-[4px] font-semibold">
            <div
              class="text-[#6D7693] border-[#EBEBEB] hover:border-tg-text-grey flex flex-1 items-center justify-between border-1 rounded-[4px] border-solid p-[0.5em] h-[40px] font-semibold leading-[1.5]"
              :class="{ 'border-tg-text-grey': isinput2Select }"
            >
              <input
                ref="inputRef2" :value="winningChance" type="text" autocomplete="on" readonly
                class="leading[1.5] text-[#0D2245] bg-[#F6F7F8] cursor-text appearance-none" @dblclick="ondblclick(2)"
              >
            </div>
          </div>
        </AfunBaseLabel>
      </div>
    </div>
    <input ref="inputRef3" class="h-0 w-0" type="text" readonly>
  </div>
</template>

<style lang='scss' scoped>
.flex-col-1em {
  > *:not(:first-child) {
    margin-top: 16px;
  }
}
.flex-row-1em {
  > *:not(:first-child) {
    margin-left: 16px;
  }
}
.footer-text-box {
  padding: 0.75em 0.5em calc(0.75em + 3px);
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    transform: translateY(calc(100% - 6px));
    background: var(--border-color);
    box-shadow: var(--tg-box-shadow);
    transition-duration: 0.2s;
    transition-timing-function: ease-out;
    transition-property: transform;
  }

  &.active::before {
    transform: translateY(0);
  }
}

.footer-tips-box {
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: var(--arrow-position);
    width: 0;
    height: 0;
    font-weight: 500;
    border-style: solid;
    border-width: 0.5em 0.5em 0;
    border-color: #304554 transparent transparent transparent;
    transform: translate(-50%);
  }
}

// 小游戏wheel footer弹出
</style>

<style>
@keyframes gameFooterTips {
  0% {
    transform: translate(0px, -15px);
    opacity: 0;
  }

  5.55533% {
    transform: translate(0px, -12.6364px);
    opacity: 0.157573;
  }

  11.1107% {
    transform: translate(0px, -10.5351px);
    opacity: 0.297658;
  }

  16.666% {
    transform: translate(0px, -8.68076px);
    opacity: 0.421282;
  }

  22.2213% {
    transform: translate(0px, -7.05786px);
    opacity: 0.529476;
  }

  27.7767% {
    transform: translate(0px, -5.65098px);
    opacity: 0.623268;
  }

  33.332% {
    transform: translate(0px, -4.44471px);
    opacity: 0.703686;
  }

  38.8873% {
    transform: translate(0px, -3.42362px);
    opacity: 0.771759;
  }

  44.4427% {
    transform: translate(0px, -2.57226px);
    opacity: 0.828516;
  }

  49.998% {
    transform: translate(0px, -1.87523px);
    opacity: 0.874985;
  }

  55.5533% {
    transform: translate(0px, -1.31707px);
    opacity: 0.912195;
  }

  61.1087% {
    transform: translate(0px, -0.882368px);
    opacity: 0.941175;
  }

  66.664% {
    transform: translate(0px, -0.555689px);
    opacity: 0.962954;
  }

  72.2193% {
    transform: translate(0px, -0.321602px);
    opacity: 0.97856;
  }

  77.7747% {
    transform: translate(0px, -0.164678px);
    opacity: 0.989021;
  }

  83.33% {
    transform: translate(0px, -0.0694861px);
    opacity: 0.995368;
  }

  88.8853% {
    transform: translate(0px, -0.0205959px);
    opacity: 0.998627;
  }

  94.4407% {
    transform: translate(0px, -0.00257727px);
    opacity: 0.999828;
  }

  99.996% {
    transform: translate(0px, -9.59233e-13px);
    opacity: 1;
  }

  100% {
    transform: translate(0px, 0px);
    opacity: 1;
  }
}
</style>
