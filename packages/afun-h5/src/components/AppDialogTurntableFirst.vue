<script setup lang="ts">
import type { CurrencyCode } from '@tg/types'
import { ApiMemberTurntableConfig, ApiMemberTurntableRecord, ApiMemberTurntableRoll } from '@tg/apis'
import { AfunBaseImage } from '@tg/bccomponents'
import { IconForgetClose } from '@tg/icons'
import { useAppStore, useCurrency, useLoginReloadDialog, useNotLoginReloadDialog } from '@tg/stores'
import { application, getCurrencyConfig } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import AppRouletteNew from './AppRouletteNew.vue'

interface Props {
  showRoll?: boolean
  /** 首页弹框转盘配置是，首页弹框接口返回的 */
  data?: any
  state?: number
  pid?: string
  amount?: string
}
// 转盘风格配置接口
interface RouletteStyle {
  /** 风格名称 */
  name: string
  /** 风格标识 */
  id: string
  /** 整个转盘的宽度(px)或(%) */
  width: number | string
  /** 转盘的宽度(px)或(%) */
  rouletteWidth: number
  /** 转盘的定位 */
  roulettePosition: {
    left: number
    right: number
    top: number
    bottom: number
  }
  /** 转盘背景图片 */
  backgroundImage: {
    url: string
    width: number
    left: number
    right: number
    top: number
    bottom: number
  }
  /** 顶部背景图 */
  topBackgroundImage?: {
    url: string
    width: number
    left: number
    right: number
    top: number
    bottom: number
  }
  /** 底部左边背景图 */
  leftBackgroundImage?: {
    url: string
    width: number
    left: number
    right: number
    top: number
    bottom: number
  }
  /** 底部右边背景图 */
  rightBackgroundImage?: {
    url: string
    width: number
    left: number
    right: number
    top: number
    bottom: number
  }
}
// 转盘无数据时：默认数据
interface RollStyle {
  id: number
  currency_id: string
  award_amount: string
  type: number
  color: string
  icon: string
  style: {
    id: string
  }
}
defineOptions({
  name: 'AppDialogTurntableFirst',
})
const props = withDefaults(defineProps<Props>(), {
  showRoll: false,
  amount: '0',
  pid: '',
})
// 转盘风格配置数组
const rouletteStyles = ref<RouletteStyle[]>([
  {
    name: '巴西风',
    id: 'style_1',
    width: '100%',
    rouletteWidth: 200,
    roulettePosition: { left: 0, right: 0, top: 67, bottom: 0 },
    backgroundImage: { url: '/m/afun-h5/png/bottom-background.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    topBackgroundImage: { url: '/m/afun-h5/png/before-top-background.png', width: 49, left: 140, right: 0, top: 60, bottom: 0 },
    leftBackgroundImage: { url: '/m/afun-h5/png/before-left-background.png', width: 70, left: 50, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/m/afun-h5/png/before-right-background.png', width: 95, left: 0, right: 15, top: 0, bottom: 0 },
  },
  {
    name: '中国风',
    id: 'style_2',
    width: '320px',
    rouletteWidth: 230,
    roulettePosition: { left: 37, right: 0, top: 67, bottom: 0 },
    backgroundImage: { url: '/m/afun-h5/png/bottom-background1.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    leftBackgroundImage: { url: '/m/afun-h5/png/before-left-background1.png', width: 111, left: 0, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/m/afun-h5/png/before-right-background1.png', width: 113, left: 0, right: 5, top: 0, bottom: 0 },
  },
  {
    name: '菲律宾风',
    id: 'style_3',
    width: '320px',
    rouletteWidth: 230,
    roulettePosition: { left: 38, right: 0, top: 66, bottom: 0 },
    backgroundImage: { url: '/m/afun-h5/png/bottom-background2.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    leftBackgroundImage: { url: '/m/afun-h5/png/before-left-background2.png', width: 80, left: 10, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/m/afun-h5/png/before-right-background2.png', width: 85, left: 0, right: 20, top: 0, bottom: 0 },
  },
  {
    name: '通用风',
    id: 'style_4',
    width: '320px',
    rouletteWidth: 230,
    roulettePosition: { left: 44, right: 0, top: 63, bottom: 0 },
    backgroundImage: { url: '/m/afun-h5/png/bottom-background3.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    leftBackgroundImage: { url: '/m/afun-h5/png/before-left-background3.png', width: 74, left: 20, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/m/afun-h5/png/before-right-background3.png', width: 84, left: 0, right: 10, top: 0, bottom: 5 },
  },
])
const { isLogin } = storeToRefs(useAppStore())
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const {
  data: rollRecord,
  runAsync: runAsyncTurntableRecord,
} = useRequest(ApiMemberTurntableRecord, {
  ready: isLogin,
})

const { data: resultRoll, loading: loadTurntableRoll, runAsync: runAsyncTurntableRoll } = useRequest(ApiMemberTurntableRoll, {
  ready: isLogin,
})
const { data: turntableConfig, runAsync: runAsyncTurntableConfig } = useRequest(ApiMemberTurntableConfig)
const notLoginReloadDialog = useNotLoginReloadDialog()
const loginReloadDialog = useLoginReloadDialog()
if (props.data)
  turntableConfig.value = props.data
const rouletteRef = ref()
// 当前抽奖币种货币配置 默认USDT
const getCurrencyConfigAll = computed(() => {
  return getCurrencyConfig(turntableConfig.value?.currency_id ?? '706') // 删除领取：rollRecord.value?.currency_id ??
})
// 转盘无数据时：默认数据
const default_roll_style = ref<RollStyle[]>([
  {
    id: 1,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '100',
    type: 1,
    color: '#fff',
    icon: 'face',
    style: {
      id: 'circle2',
    },
  },
  {
    id: 2,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '20',
    type: 2,
    color: '#fff',
    icon: 'face',
    style: {
      id: 'circle3',
    },
  },
  {
    id: 3,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '100',
    type: 1,
    color: '#fff',
    icon: 'money',
    style: {
      id: 'circle4',
    },
  },
  {
    id: 4,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '50',
    type: 2,
    color: '#FFEA00',
    icon: 'face',
    style: {
      id: 'circle5',
    },
  },
  {
    id: 7,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '100',
    type: 1,
    color: '#fff',
    icon: 'gold',
    style: {
      id: 'circle7',
    },
  },
  {
    id: 6,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '30',
    type: 2,
    color: '#fff',
    icon: 'face',
    style: {
      id: 'circle8',
    },
  },
  {
    id: 5,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '20',
    type: 1,
    color: '#fff',
    icon: 'box',
    style: {
      id: 'circle9',
    },
  },
  {
    id: 8,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '100',
    type: 2,
    color: '#FFEA00',
    icon: 'face',
    style: {
      id: 'circle6',
    },
  },
])
const activeCurrency = computed(() => {
  return application.isVirtualCurrency(currentGlobalCurrencyMap.value.type) ? '706' : currentGlobalCurrencyMap.value.cur
})
// 转盘当前风格id
const currentStyleId = computed(() => {
  return turntableConfig.value?.now_style ?? 'style_1'
})
// 转盘配置数据
const wheelConfig = computed(() => {
  return turntableConfig.value?.style?.roll_style ?? default_roll_style.value
})
// 获取指定风格的配置
function getRouletteStyle(styleId: string): RouletteStyle | undefined {
  const id = styleId || 'style_1'
  return rouletteStyles.value.find(style => style.id === id)
}
function handleStartRoll(isZero: boolean) {
  if (isZero) { // 次数为0不可滚动
    return
  }
  rouletteRef.value?.play()
  if (!loadTurntableRoll.value)
    runAsyncTurntableRoll({ pid: props.pid, cur: activeCurrency.value })
}
function handleEndRoll() {
  handleClose()

  let _amount = resultRoll.value?.amount ?? '0'
  if (rollRecord.value?.achieved_prize)
    _amount = (+_amount + +rollRecord.value?.achieved_prize).toString()
  runAsyncTurntableRecord({ pid: props.pid })
}
function handleClose() {
  if (rouletteRef.value?.isTurn) {
    if (isLogin.value)
      loginReloadDialog.next()
    else
      notLoginReloadDialog.next()
  }
}

runAsyncTurntableConfig({ pid: props.pid, cur: activeCurrency.value })
runAsyncTurntableRecord({ pid: props.pid })
</script>

<template>
  <div class="center fixed left-0 top-0 h-[100%] w-[100%]" @click="handleClose" @touchmove.stop.prevent>
    <div class="margin-auto relative h-[386px] w-[332px]">
      <!-- 关闭按钮 -->
      <div
        class="center close-round absolute right-[14px] top-[0] h-[18px] w-[18px] cursor-pointer rounded-full"
        @click="handleClose"
      >
        <IconForgetClose class="text-[12px]" />
      </div>
      <!-- 整个转盘及背景 -->
      <div class="absolute m-auto" :style="{ width: `${getRouletteStyle(currentStyleId)?.width}` }">
        <!-- 转盘彩带 -->
        <div v-if="currentStyleId === 'style_1'" class="absolute bottom-[-24px] left-[30px] z-[4] w-[284px]">
          <AfunBaseImage url="/m/afun-h5/png/before-front-background.png" />
        </div>
        <div
          v-if="getRouletteStyle(currentStyleId)?.topBackgroundImage" class="absolute z-[3]" :style="{
            width: `${getRouletteStyle(currentStyleId)?.topBackgroundImage?.width}px`,
            left: `${getRouletteStyle(currentStyleId)?.topBackgroundImage?.left}px`,
            top: `${getRouletteStyle(currentStyleId)?.topBackgroundImage?.top}px` }"
        >
          <AfunBaseImage :url="getRouletteStyle(currentStyleId)?.topBackgroundImage?.url" />
        </div>
        <div
          class="absolute z-[3]" :style="{
            width: `${getRouletteStyle(currentStyleId)?.leftBackgroundImage?.width}px`,
            left: `${getRouletteStyle(currentStyleId)?.leftBackgroundImage?.left}px`,
            bottom: `${getRouletteStyle(currentStyleId)?.leftBackgroundImage?.bottom}px` }"
        >
          <AfunBaseImage :url="getRouletteStyle(currentStyleId)?.leftBackgroundImage?.url" />
        </div>
        <div
          class="absolute z-[3]" :style="{
            width: `${getRouletteStyle(currentStyleId)?.rightBackgroundImage?.width}px`,
            right: `${getRouletteStyle(currentStyleId)?.rightBackgroundImage?.right}px`,
            bottom: `${getRouletteStyle(currentStyleId)?.rightBackgroundImage?.bottom}px` }"
        >
          <AfunBaseImage :url="getRouletteStyle(currentStyleId)?.rightBackgroundImage?.url" />
        </div>
        <!-- 各种转盘样式 -->
        <AppRouletteNew
          ref="rouletteRef" :config="wheelConfig" :amount="resultRoll?.amount"
          :state="Number(turntableConfig?.state)"
          :roulette-width="getRouletteStyle(currentStyleId)?.rouletteWidth"
          :roulette-position="getRouletteStyle(currentStyleId)?.roulettePosition"
          :frequency="isLogin && rollRecord ? rollRecord.left_roll : turntableConfig?.daily_roll_times"
          :type="getCurrencyConfigAll?.name" @start-roll="handleStartRoll"
          @end-roll="handleEndRoll"
        />
        <div class="absolute top-0 left-0 z-[1] w-[100%] px-[6px]">
          <AfunBaseImage :url="getRouletteStyle(currentStyleId)?.backgroundImage.url" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.close-round {
  border: 1px solid #c1c1c1;
  color: #c1c1c1;
}
</style>
