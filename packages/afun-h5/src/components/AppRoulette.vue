<script setup lang="ts">
import { AfunBaseImage } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { useAppStore } from '@tg/stores'
import gsap from 'gsap'
import { storeToRefs } from 'pinia'
import { computed, inject, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

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
  name: 'AppRoulette',
})
const props = withDefaults(defineProps<Props>(), {
  frequency: 0,
  // amount: '',
})

const emit = defineEmits(['startRoll', 'endRoll', 'turned'])

const { isLogin } = storeToRefs(useAppStore())
const closeDialog = inject('closeDialog', () => { })
const router = useRouter()
// 是否可以抽奖
const { bool: isTurn, setBool: setIsTurnBool } = useBoolean(true)
// 是否在展示选中动画
const { bool: isBox, setBool: setIsBoxBool } = useBoolean(false)

const drawOption = 8
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
// 当前的货币
const currency = computed(() => {
  return props.type
})

function startRotate() {
  if (isLogin.value) {
    if (props.state === 2) { // 活动已结束
      /* openNotify({
        type: 'error',
        message: t('activity') + t('sports_status_finished'),
      }) */
      return
    }
    else if (props.state === 3) { // 活动未开启
      /* openNotify({
        type: 'error',
        message: t('activity') + t('unopened'),
      }) */
      return
    }
    if (isTurn.value)
      emit('startRoll', !props.frequency)
    // if (!props.frequency)
    //   openGetMoreRepsDialog()
  }
  else {
    closeDialog()
    // notLoginReloadDialog.setShowFalse()
    // openRegisterDialog()
    router.push('/login')
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
  <div class="relative pb-[10px] z-[2]">
    <div class="relative m-auto mt-[67px] h-[200px] w-[200px] overflow-hidden">
      <div class="absolute left-[0] top-[0] h-[100%] w-[100%]">
        <AfunBaseImage class="h-[100%] w-[100%]" url="/m/afun-h5/png/zp-border.png" loading="eager" />
      </div>
      <div class="absolute left-[50%] top-[50%] z-[1] translate-x-[-50%] translate-y-[-53%]">
        <AfunBaseImage class="absolute w-[61px] rounded-[50%]" url="/m/afun-h5/png/game-select.png" loading="eager" />
      </div>
      <AfunBaseImage class="lamp absolute left-[0%] top-[0%] h-[100%] w-[100%]" url="/m/afun-h5/png/flashing_light.png" loading="eager" />
      <div
        class="absolute left-[50%] top-[50%] ml-[-44.6%] mt-[-44.6%] h-[89.1%] w-[89.1%] overflow-hidden rounded-[50%]"
      >
        <div ref="drawRef" class="draw-content h-[100%] w-[100%]">
          <AfunBaseImage class="absolute h-[100%] w-[100%] rounded-[50%]" :url="`/m/afun-h5/png/roulette-${currency}.png`" loading="eager" />
        </div>
        <div ref="selectRef" class="select-box absolute left-[50%] top-[0%] translate-x-[-50%] opacity-[0]">
          <AfunBaseImage class="w-[71px]" url="/m/afun-h5/png/uni-game-select.png" loading="eager" />
        </div>
      </div>
      <div
        class="absolute left-[50%] top-[50%] z-[1] h-[80px] w-[61px] translate-x-[-50%] translate-y-[-50%] cursor-pointer text-center leading-[90px] text-[#ffffff]"
        @click="startRotate"
      >
        <div v-show="isBox" class="center h-full w-full break-all px-[6px] pt-[10px] text-[14px] leading-[1.1] font-[600]">
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
</template>

<style lang="scss" scoped>

</style>
