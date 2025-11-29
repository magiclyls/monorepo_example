<script setup lang="ts">
import { IconUniGameSelect } from '@tg/icons'
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
  name: 'AppRoulettePt',
})
const props = withDefaults(defineProps<Props>(), {
  frequency: 0,
  // amount: '',
})

const emit = defineEmits(['startRoll', 'endRoll', 'turned'])

const notLoginReloadDialog = useNotLoginReloadDialog()
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { userLanguage } = storeToRefs(useLanguageStore())
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
    notLoginReloadDialog.setShowFalse()
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
  <div class="relative max-w-[375px] w-full pb-[35px]">
    <BaseImage url="/png/promotions/game-back-ground-pt.png" loading="eager" />
    <!-- 转盘中间部分 -->
    <div class="absolute left-[50%] translate-x-[-50%]" style="width:60.05%;top:23%;">
      <!-- 边框 -->
      <div class="w-full">
        <BaseImage url="/png/promotions/zp-border-pt.png" loading="eager" />
      </div>
      <!-- 奖品 -->
      <div
        class="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-[50%]" style="width: 89%;"
      >
        <div ref="drawRef" class="draw-content h-[100%] w-[100%]">
          <BaseImage class="absolute h-[100%] w-[100%] rounded-[50%]" url="/png/promotions/roulette-pt.png" loading="eager" />
        </div>
        <div ref="selectRef" class="select-box absolute left-[50%] top-[0%] translate-x-[-50%] opacity-[0]">
          <IconUniGameSelect class="text-[108px]" style="color: var(--tg-text-white)" />
        </div>
      </div>
      <!-- 灯光 -->
      <div class="lamp w-ful absolute left-0 top-0 h-full">
        <BaseImage url="/png/promotions/flashing-light-pt.png" loading="eager" />
      </div>
      <!-- 指针 -->
      <div
        class="absolute left-[50%] top-[50%] z-[1]"
        style="width: 30.86%;transform: translate(-50%,-58%);"
      >
        <BaseImage url="/png/promotions/game-select-pt.png" loading="eager" />
        <div
          style="padding-top: 56%;"
          class="absolute left-[50%] top-[50%] z-[1] h-full w-full translate-x-[-50%] translate-y-[-50%] cursor-pointer text-center text-[#ffffff]"
          @click="startRotate"
        >
          <div v-show="isBox" class="break-all text-[14px] leading-[2] font-[600]">
            +{{ amount ?? 0 }}
          </div>
          <div v-show="!isBox">
            <div class="font-[600]">
              <span class="text-[24px]">{{ frequency }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 前面的装饰 -->
    <div class="pointer-events-none absolute bottom-0 left-[50%]" style="width:86.94%;transform: translateX(-47%);">
      <BaseImage url="/png/promotions/game-font-ground-pt.png" loading="eager" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
