<script setup lang="ts">
import { IconUniClose } from '@tg/icons'
import { ApiMemberTurntableConfig, ApiMemberTurntableRecord, ApiMemberTurntableRoll } from '@tg/apis'

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
    backgroundImage: { url: '/png/promotions/bottom-background.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    topBackgroundImage: { url: '/png/promotions/before-top-background.png', width: 49, left: 140, right: 0, top: 60, bottom: 0 },
    leftBackgroundImage: { url: '/png/promotions/before-left-background.png', width: 70, left: 50, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/png/promotions/before-right-background.png', width: 95, left: 0, right: 15, top: 0, bottom: 0 },
  },
  {
    name: '中国风',
    id: 'style_2',
    width: '320px',
    rouletteWidth: 230,
    roulettePosition: { left: 37, right: 0, top: 67, bottom: 0 },
    backgroundImage: { url: '/png/promotions/bottom-background1.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    leftBackgroundImage: { url: '/png/promotions/before-left-background1.png', width: 111, left: 0, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/png/promotions/before-right-background1.png', width: 113, left: 0, right: 5, top: 0, bottom: 0 },
  },
  {
    name: '菲律宾风',
    id: 'style_3',
    width: '320px',
    rouletteWidth: 230,
    roulettePosition: { left: 38, right: 0, top: 66, bottom: 0 },
    backgroundImage: { url: '/png/promotions/bottom-background2.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    leftBackgroundImage: { url: '/png/promotions/before-left-background2.png', width: 80, left: 10, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/png/promotions/before-right-background2.png', width: 85, left: 0, right: 20, top: 0, bottom: 0 },
  },
  {
    name: '通用风',
    id: 'style_4',
    width: '320px',
    rouletteWidth: 230,
    roulettePosition: { left: 44, right: 0, top: 63, bottom: 0 },
    backgroundImage: { url: '/png/promotions/bottom-background3.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    leftBackgroundImage: { url: '/png/promotions/before-left-background3.png', width: 74, left: 20, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/png/promotions/before-right-background3.png', width: 84, left: 0, right: 10, top: 0, bottom: 5 },
  },
])
const closeDialog = inject('closeDialog', () => { })
const { openFreeGetManyDialog } = useDialogFreeGetMany()
const { isLogin, currentGlobalCurrency } = storeToRefs(useAppStore())
const { isPtbr } = storeToRefs(useLanguageStore())
const rouletteRef = ref()
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

const activeCurrency = computed(() => {
  const val = application.isVirtualCurrency(currentGlobalCurrency.value) ? 'USDT' : currentGlobalCurrency.value
  return currencyConfig[isLogin.value ? val : (languageConfig[getCurrentLanguageForFrontend()].currency)]
})
// 转盘当前风格id
const currentStyleId = computed(() => {
  return turntableConfig.value?.now_style ?? 'style_1'
})
// 转盘配置数据
const wheelConfig = computed(() => {
  return turntableConfig.value?.style?.roll_style ?? []
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
    runAsyncTurntableRoll({ pid: props.pid, cur: turntableConfig.value?.currency_id })
}
function handleEndRoll() {
  closeDialog()

  let _amount = resultRoll.value?.amount ?? '0'
  if (rollRecord.value?.achieved_prize)
    _amount = (+_amount + +rollRecord.value?.achieved_prize).toString()

  openFreeGetManyDialog({
    data: turntableConfig.value,
    pid: props.pid,
    amount: _amount,
  })
  runAsyncTurntableRecord({ pid: props.pid, cur: activeCurrency.value.cur })
}
function handleClose() {
  if (rouletteRef.value?.isTurn) {
    closeDialog()
    if (isLogin.value)
      loginReloadDialog.next()
    else
      notLoginReloadDialog.next()
  }
}
runAsyncTurntableConfig({ pid: props.pid, cur: activeCurrency.value.cur })
runAsyncTurntableRecord({ pid: props.pid })
</script>

<template>
  <div class="center fixed left-0 top-0 h-[100%] w-[100%]" @click="handleClose" @touchmove.stop.prevent>
    <div class="margin-auto relative h-[386px] w-[332px]">
      <div
        class="center close-round absolute right-[14px] top-[0] h-[18px] w-[18px] cursor-pointer rounded-full"
        @click="handleClose"
      >
        <IconUniClose class="text-[12px]" />
      </div>
      <!-- 整个转盘及背景 -->
      <div v-if="wheelConfig.length > 0" class="absolute m-auto" :style="{ width: `${getRouletteStyle(currentStyleId)?.width}` }">
        <!-- 转盘彩带 -->
        <div v-if="currentStyleId === 'style_1'" class="absolute bottom-[-24px] left-[30px] z-[4] w-[284px]">
          <BaseImage url="/png/promotions/before-front-background.png" />
        </div>
        <div
          v-if="getRouletteStyle(currentStyleId)?.topBackgroundImage" class="absolute z-[3]" :style="{
            width: `${getRouletteStyle(currentStyleId)?.topBackgroundImage?.width}px`,
            left: `${getRouletteStyle(currentStyleId)?.topBackgroundImage?.left}px`,
            top: `${getRouletteStyle(currentStyleId)?.topBackgroundImage?.top}px`,
          }"
        >
          <BaseImage :url="getRouletteStyle(currentStyleId)?.topBackgroundImage?.url" />
        </div>
        <div
          class="absolute z-[3]" :style="{
            width: `${getRouletteStyle(currentStyleId)?.leftBackgroundImage?.width}px`,
            left: `${getRouletteStyle(currentStyleId)?.leftBackgroundImage?.left}px`,
            bottom: `${getRouletteStyle(currentStyleId)?.leftBackgroundImage?.bottom}px`,
          }"
        >
          <BaseImage :url="getRouletteStyle(currentStyleId)?.leftBackgroundImage?.url" />
        </div>
        <div
          class="absolute z-[3]" :style="{
            width: `${getRouletteStyle(currentStyleId)?.rightBackgroundImage?.width}px`,
            right: `${getRouletteStyle(currentStyleId)?.rightBackgroundImage?.right}px`,
            bottom: `${getRouletteStyle(currentStyleId)?.rightBackgroundImage?.bottom}px`,
          }"
        >
          <BaseImage :url="getRouletteStyle(currentStyleId)?.rightBackgroundImage?.url" />
        </div>
        <!-- 各种转盘样式 -->
        <AppRouletteNew
          ref="rouletteRef" :config="wheelConfig" :amount="resultRoll?.amount"
          :state="Number(turntableConfig?.state)"
          :roulette-width="getRouletteStyle(currentStyleId)?.rouletteWidth"
          :roulette-position="getRouletteStyle(currentStyleId)?.roulettePosition"
          :frequency="isLogin && rollRecord ? rollRecord.left_roll : turntableConfig?.daily_roll_times"
          :type="activeCurrency.cur" @start-roll="handleStartRoll"
          @end-roll="handleEndRoll"
        />
        <div class="absolute left-0 top-0 z-[1] w-[100%] px-[6px]">
          <BaseImage :url="getRouletteStyle(currentStyleId)?.backgroundImage.url" />
        </div>
      </div>
      <!-- 兼容老的转盘样式 -->
      <div v-else>
        <!-- 葡语不需要上面这张图 -->
        <div v-if="!isPtbr" class="absolute left-[10px] top-[18px]">
          <BaseImage width="309px" is-network :url="`/images/promo/pop/${getCurrentLanguageForBackend()}/1_t.webp`" />
        </div>
        <!-- 各种转盘样式 -->
        <div v-if="isPtbr" class="absolute bottom-[25px] w-full">
          <AppRoulettePt
            ref="rouletteRef"
            :frequency="isLogin && rollRecord ? rollRecord.left_roll : turntableConfig?.daily_roll_times" :state="Number(turntableConfig?.state)"
            :amount="resultRoll?.amount" @start-roll="handleStartRoll" @end-roll="handleEndRoll"
          />
        </div>
        <AppRoulette2
          v-else-if="isStyle2()"
          ref="rouletteRef" class="absolute bottom-[50px] left-[42px] scale-[0.84]"
          :frequency="isLogin && rollRecord ? rollRecord.left_roll : turntableConfig?.daily_roll_times" :state="Number(turntableConfig?.state)"
          :amount="resultRoll?.amount" @start-roll="handleStartRoll" @end-roll="handleEndRoll"
        />
        <AppRoulette
          v-else
          ref="rouletteRef" class="absolute bottom-[50px] left-[42px] scale-[0.84]"
          :frequency="isLogin && rollRecord ? rollRecord.left_roll : turntableConfig?.daily_roll_times" :state="Number(turntableConfig?.state)"
          :amount="resultRoll?.amount" @start-roll="handleStartRoll" @end-roll="handleEndRoll"
        />
        <div class="absolute bottom-0" style="pointer-events: none;">
          <BaseImage width="332px" is-network :url="`/images/promo/pop/${getCurrentLanguageForBackend()}/1.webp`" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.close-round {
  border: 1px solid #b1bad3;
  --tg-icon-color: #b1bad3;
  @include webTheme('white') {
    border: 1px solid #c1c1c1;
    --tg-icon-color: #c1c1c1;
  }
  @include webTheme('green') {
    border: 1px solid #5ecea6;
    --tg-icon-color: #5ecea6;
  }
}
</style>
