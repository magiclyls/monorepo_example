<script setup lang="ts">
import gsap from 'gsap'

interface Props {
  /** 次数 */
  frequency?: number
  /** 结果金额 */
  amount?: string
  /** 货币类型 */
  type?: string
  /** 活动状态 */
  state?: number
}
defineOptions({
  name: 'AppRoulette2',
})
const props = withDefaults(defineProps<Props>(), {
  frequency: 0,
  // amount: '',
})

const emit = defineEmits(['startRoll', 'endRoll', 'turned'])

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

const drawOption = 8
//   [
//   { bg: '#254252', icon: 'uni-money-unknown' },
//   { bg: '#48667C', icon: 'uni-money-not', size: 'text-[30px]' },
//   { bg: '#254252', icon: 'uni-money-not2' },
//   { bg: '#48667C', text: '1', icon: '' },
//   { bg: '#254252', icon: 'uni-money-unknown' },
//   { bg: '#48667C', text: '1000', icon: '' },
//   { bg: '#254252', text: '50', icon: '' },
//   { bg: '#48667C', icon: 'uni-money-coin' },
// ]
const rotate = 360 / drawOption // drawOption.length
const drawRef = ref()
const selectRef = ref()
// 闪的灯动画
let rotateLamp: gsap.core.Tween
// 旋转等待动画
let rotateResult: gsap.core.Tween
// 计算奖品角度
// const calcAngle = computed(() => {
//   const amount = props?.amount ?? 0
//   if (Number(amount))
//     return rotate

//   else
//     return -rotate
// })

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
    if (isTurn.value)
      emit('startRoll', !props.frequency)
    // if (!props.frequency)
    //   openGetMoreRepsDialog()
  }
  else {
    closeDialog()
    openRegisterDialog()
  }
}
// 默认旋转动画
function play() {
  setIsTurnBool(false)
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
// 展示结果动画
function result() {
  emit('turned')
  setIsBoxBool(true)
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

defineExpose({ play, result, isTurn })

onMounted(() => {
  rotateLamp = gsap.to('.lamp', { duration: 0, repeatDelay: 0.35, ease: 'none', rotation: rotate / 3, repeat: -1, yoyo: true })
})

onUnmounted(() => {
  rotateLamp?.kill()
  rotateResult?.kill()
})
</script>

<template>
  <div>
    <div class="relative m-auto h-[237px] w-[237px] overflow-hidden">
      <div class="absolute left-[0] top-[0] h-[100%] w-[100%]">
        <BaseImage class="h-[100%] w-[100%]" url="/png/promotions/zp-border2.png" loading="eager" />
      </div>
      <div class="absolute left-[50%] top-[50%] z-[1] translate-x-[-50%] translate-y-[-53%]">
        <BaseImage class="absolute w-[66px] rounded-[50%]" url="/png/promotions/game-select2.png" loading="eager" />
      </div>
      <BaseImage class="lamp absolute left-[0] top-[0] h-[100%] w-[100%]" url="/png/casino/flashing_light2.png" loading="eager" />
      <div
        class="absolute left-[50%] top-[50%] ml-[-44.6%] mt-[-44.6%] h-[89.1%] w-[89.1%] overflow-hidden rounded-[50%]"
      >
        <div ref="drawRef" class="draw-content h-[100%] w-[100%]">
          <BaseImage class="absolute h-[100%] w-[100%] rounded-[50%]" url="/png/promotions/roulette2.png" loading="eager" />
        </div>
        <div ref="selectRef" class="select-box absolute left-[50.5%] top-[0.5%] flex translate-x-[-50%] justify-center opacity-[0]">
          <BaseImage class="w-[78%]" url="/png/promotions/result2.png" loading="eager" />
        </div>
      </div>
      <div
        class="text-tg-text-white absolute left-[50%] top-[50%] z-[1] h-[74px] w-[66px] translate-x-[-50%] translate-y-[-50%] cursor-pointer text-center leading-[74px]"
        @click="startRotate"
      >
        <div v-show="isBox" class="center h-full w-full break-all px-[6px] pt-[15px] text-[14px] leading-[1.1] font-[600]">
          +{{ amount ?? 0 }}
        </div>
        <div v-show="!isBox">
          <div class="font-[600]">
            <span class="relative top-[7px] text-[24px]">{{ frequency }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
