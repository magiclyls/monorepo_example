<script setup lang="ts">
import gsap from 'gsap'
import type { EnumCurrencyKey } from '~/apis/types'
import { getCurrencyConfigByCode } from '~/composables/useCurrencyData'

defineOptions({
  name: 'AppRouletteNew',
})

const props = withDefaults(defineProps<Props>(), {
  frequency: 0,
  canRotate: true,
  config: () => ([]),
})

const emit = defineEmits(['startRoll', 'endRoll', 'turned'])

// 转盘段位接口
interface WheelSegment {
  id: string
  currency_id: string | EnumCurrencyKey // 支持数字字符串或货币键
  award_amount: string
  type: number
  color: string
  icon: string
  style: {
    id: string
  }
}

interface Props {
  /** 转盘的宽度 */
  rouletteWidth?: number
  /** 转盘的定位 */
  roulettePosition?: {
    left: number
    right: number
    top: number
    bottom: number
  }
  /** 转盘配置 */
  config?: WheelSegment[]
  /** 次数 */
  frequency?: number
  /** 结果金额 */
  amount?: string
  /** 货币类型 */
  type?: string
  /** 活动状态 */
  state?: number
  /** 是否可旋转 */
  canRotate?: boolean
}
const notLoginReloadDialog = useNotLoginReloadDialog()
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { openNotify } = useNotify()
const closeDialog = inject('closeDialog', () => { })
const { openRegisterDialog } = useRegisterDialog()
// const { openGetMoreRepsDialog } = useDialogGetMoreReps()
// 是否可以抽奖
const { bool: isTurn, setBool: setIsTurnBool } = useBoolean(true)
// 是否在展示选中动画
const { bool: isBox, setBool: setIsBoxBool } = useBoolean(false)
// 模拟数据 - 转盘段位配置
const wheelSegments = computed(() => props.config ?? [])
// 每段位旋转角度
const rotate = 360 / wheelSegments.value?.length // drawOption.length
// 转盘容器
const drawRef = ref<HTMLElement>()
const selectRef = ref<HTMLElement>()

// 闪的灯动画
let rotateLamp: gsap.core.Tween
// 旋转等待动画
let rotateResult: gsap.core.Tween
// 计算BaseImage的半径（基于容器大小）
const baseImageRadius = computed(() => {
  // 容器大小是237px，BaseImage占85.1%，所以BaseImage的半径是 (237 * 0.851) / 2
  return (props.rouletteWidth! * 0.851) / 2
})
// 将数字字符串转换为 EnumCurrencyKey
function convertCurrencyId(currencyId: string | EnumCurrencyKey): EnumCurrencyKey {
  if (typeof currencyId === 'string' && /^\d+$/.test(currencyId)) {
    // 如果是数字字符串，转换为货币键
    const config = getCurrencyConfigByCode(currencyId as any)
    return config?.name || 'BRL' // 默认返回 BRL
  }
  return currencyId as EnumCurrencyKey
}
// 计算每个段位内容的位置
function getSegmentPosition(index: number) {
  // 位置调整：index=0移动到原来index=7的位置
  const positionAngle = ((index + 7) * rotate) * (Math.PI / 180) // 转换为弧度
  const radius = baseImageRadius.value * 0.73 // 距离中心的距离，使用半径的70%

  // 计算x和y坐标（相对于BaseImage中心）
  const x = Math.cos(positionAngle) * radius
  const y = Math.sin(positionAngle) * radius

  // 旋转角度：index=0时旋转45度，后面依次增加45度
  const rotationAngle = (index + 1) * rotate

  return {
    x,
    y,
    angle: rotationAngle,
  }
}

function startRotate() {
  if (isLogin.value) {
    if (props.state === 2) { // 活动已结束
      openNotify({
        type: 'error',
        message: t('activity') + t('sports_status_finished'),
      })
      return
    }
    else if (props.state === 3) { // 活动未开启
      openNotify({
        type: 'error',
        message: t('activity') + t('unopened'),
      })
      return
    }
    if (isTurn.value && props.canRotate)
      emit('startRoll', !props.frequency)
  }
  else {
    closeDialog()
    notLoginReloadDialog.setShowFalse()
    openRegisterDialog()
  }
}
// 默认旋转动画
function play() {
  setIsTurnBool(false)

  if (drawRef.value) {
    rotateResult = gsap.fromTo(drawRef.value, {
      rotation: 0,
    }, {
      duration: 5,
      rotation: 2520 + rotate + 180 * ([0, 1][Math.floor(Math.random() * 2)]), // 上下两个奖品随机
      ease: 'circ.out',
      // repeat: 4,
      onComplete: () => {
        result()
      },
    })
  }
}
// 展示结果动画
function result() {
  emit('turned')
  setIsBoxBool(true)
  if (selectRef.value) {
    gsap.to(selectRef.value, { // 选中框动画
      duration: 0.01,
      repeatDelay: 0.35,
      opacity: 1,
      repeat: 7,
      ease: 'none',
      yoyo: true,
      onComplete: () => {
        emit('endRoll')
        nextTick(() => {
          setIsTurnBool(true)
          setIsBoxBool(false)
        })
      },
    })
  }
}

defineExpose({ play, result, isTurn })

onMounted(() => {
  rotateLamp = gsap.to('.lamp', {
    duration: 0,
    repeatDelay: 0.35,
    ease: 'none',
    rotation: rotate / 3,
    repeat: -1,
    yoyo: true,
  })
})

onUnmounted(() => {
  rotateLamp?.kill()
  rotateResult?.kill()
})
</script>

<template>
  <div class="relative z-[2] pb-[10px]">
    <div
      class="relative m-auto overflow-hidden" :style="{
        width: `${props.rouletteWidth}px`,
        height: `${props.rouletteWidth}px`,
        marginLeft: `${props.roulettePosition?.left !== 0 ? props.roulettePosition?.left : 'auto'}px`,
        marginTop: `${props.roulettePosition?.top}px`,
      }"
      :class="props.roulettePosition?.left === 0 ? 'm-auto' : ''"
    >
      <div class="absolute left-[0] top-[0] h-[100%] w-[100%]">
        <BaseImage class="h-[100%] w-[100%]" url="/png/promotions/ph-h5-zp-border.png" loading="eager" />
      </div>
      <div class="absolute left-[50%] top-[50%] z-[1] translate-x-[-50%] translate-y-[-53%]">
        <BaseImage class="absolute w-[61px] rounded-[50%]" url="/png/promotions/ph-h5-game-select.png" loading="eager" />
      </div>
      <BaseImage class="lamp absolute left-[0%] top-[0%] h-[100%] w-[100%]" url="/png/promotions/ph-h5-flashing_light.png" loading="eager" />
      <div
        class="absolute left-[50%] top-[50%] ml-[-44.6%] mt-[-44.6%] h-[89.1%] w-[89.1%] overflow-hidden rounded-[50%]"
      >
        <!-- 转盘内容 -->
        <div ref="drawRef" class="draw-content h-[100%] w-[100%]">
          <BaseImage class="absolute h-[100%] w-[100%] rounded-[50%]" url="/png/promotions/ph-h5-roulette-bg.png" loading="eager" />
          <!-- 段位内容 -->
          <div
            v-for="(segment, index) in wheelSegments"
            :key="index"
            class="absolute z-10 flex items-center justify-center"
            :style="{
              left: `calc(50% + ${getSegmentPosition(index).x}px)`,
              top: `calc(50% + ${getSegmentPosition(index).y}px)`,
              transform: `translate(-50%, -50%) rotate(${getSegmentPosition(index).angle}deg)`,
            }"
          >
            <!-- 金额显示 -->
            <div v-if="segment.type === 2" class="flex flex-col items-center justify-center text-center">
              <div class="text-[16px] font-bold" :style="{ color: segment.color }">
                {{ segment.award_amount }}
              </div>
              <AppCurrencyIcon style="--tg-app-currency-icon-size:20px;" :currency-type="convertCurrencyId(segment.currency_id)" />
            </div>

            <!-- 图标显示 -->
            <div v-else class="flex items-center justify-center text-center">
              <BaseImage :url="`/png/promotions/roulette-${segment.icon}.png`" class="h-[auto] w-[30px]" loading="eager" style="--tg-base-image-width:30px;" />
            </div>
          </div>
        </div>
        <div ref="selectRef" class="select-box absolute left-[50%] top-[0%] translate-x-[-50%] opacity-[0]">
          <BaseImage class="w-[71px]" url="/png/promotions/ph-h5-uni-game-select.png" loading="eager" />
        </div>
      </div>
      <!-- 抽奖按钮 -->
      <div
        class="absolute left-[50%] top-[50%] z-[1] h-[80px] w-[61px] translate-x-[-50%] translate-y-[-50%] cursor-pointer text-center leading-[90px] text-[#ffffff]"
        @click="startRotate"
      >
        <div v-show="isBox" class="center h-full w-full break-all px-[6px] pt-[10px] text-[14px] leading-[1.1] font-[500]">
          +{{ amount ?? 0 }}
        </div>
        <div v-show="!isBox">
          <div class="font-[500]">
            <span class="text-[24px]">{{ frequency }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
