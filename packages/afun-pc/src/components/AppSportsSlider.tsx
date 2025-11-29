import {
  type CSSProperties,
  type ExtractPropTypes,
  computed,
  defineComponent,
  ref,
} from 'vue'

// Composables
import BaseLoading2 from './BaseLoading2.vue'
import { IconSptBetArrrow1 } from '@tg/icons'

const sliderProps = {
  isClosed: {
    type: Boolean,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  appointing: {
    type: Boolean,
    required: true,
  },
  appointingProfit: {
    type: Number,
    required: true,
  },
  profit: {
    type: Number,
    required: true,
  },
  // 复式
  count: Number,
  isMulti: {
    type: Boolean,
    required: true,
  },
  multitotalBet: {
    type: Number,
    required: true,
  },
  multiProfit: {
    type: Number,
    required: true,
  },
  min: {
    type: [Number, String],
    default: 0,
  },
  max: {
    type: [Number, String],
    default: 100,
  },
  step: {
    type: [Number, String],
    default: 1,
  },
  disabled: Boolean,
  readonly: Boolean,
  modelValue: {
    type: Number,
    default: 0,
  },
}

type SliderProps = ExtractPropTypes<typeof sliderProps>

const appStore = useAppStore()
const { currentGlobalCurrency } = storeToRefs(appStore)

export default defineComponent({
  name: 'Slider',

  props: sliderProps,

  emits: ['change', 'dragEnd', 'dragStart', 'update:modelValue', 'toRight'],

  setup(props, { emit, slots }) {
    const suffixLength = computed(() => currencyConfig[currentGlobalCurrency.value].decimal)
    // 预计盈利
    const profit = computed(() => {
      if (props.isMulti)
        return application.formatNumDecimal(props.multiProfit ?? 0, suffixLength.value)
      else if (props.appointing)
        return application.formatNumDecimal(props.appointingProfit ?? 0, suffixLength.value)
      return application.formatNumDecimal(props.profit ?? 0, suffixLength.value)
    },
    )
    // 合计投注
    const multitotalBet = computed(() => application.formatNumDecimal(props.multitotalBet ?? 0, suffixLength.value))
    // 禁止拖动
    const disabledMove = computed(() => {
      return (props.isMulti && Number(props.count) < 2) || props.disabled || props.isClosed || props.loading
    })
    // 拖拽逻辑
    let current: number
    let startValue: number
    const root = ref<HTMLElement>()
    const slider = ref<HTMLElement>()
    const dragStatus = ref<'start' | 'dragging' | ''>()
    const touch = useTouch()

    const scope = computed(() => Number(props.max) - Number(props.min))

    // 计算选中条的长度百分比
    const calcMainAxis = () => {
      const { modelValue, min } = props
      return `${((modelValue - Number(min)) * 100) / scope.value}%`
    }

    const barStyle = computed(() => {
      const style: CSSProperties = {
        left: calcMainAxis(),
      }
      return style
    })

    const format = (value: number) => {
      const min = +props.min
      const max = +props.max
      const step = +props.step

      value = clamp(value, min, max)
      const diff = Math.round((value - min) / step) * step
      return addNumber(min, diff)
    }

    const updateStartValue = () => {
      // to do 优化每次开始可以不是0
      // const current = props.modelValue
      // startValue = format(current)
      startValue = 0
    }

    const updateValue = (value: number, end?: boolean) => {
      value = format(value)

      if (value !== props.modelValue)
        emit('update:modelValue', value)

      if (end && value !== props.modelValue)
        emit('change', value)
    }

    const onTouchStart = (event: TouchEvent | MouseEvent) => {
      if (disabledMove.value)
        return
      touch.start(event)
      current = props.modelValue
      updateStartValue()
      dragStatus.value = 'start'
    }
    const onTouchMove = (event: TouchEvent) => {
      if (disabledMove.value)
        return

      if (dragStatus.value === 'start')
        emit('dragStart', event)
      event.preventDefault()
      touch.move(event)
      dragStatus.value = 'dragging'

      const rect = (root.value as Element).getBoundingClientRect()
      const delta = touch.deltaX.value // 即手指从触摸起点到当前点的水平移动距离
      const total = rect.width

      const diff = (delta / total) * scope.value
      current = startValue + diff
      updateValue(current)
      if (current >= 100)
        emit('toRight')
    }

    const onTouchEnd = (event: TouchEvent) => {
      if (dragStatus.value === 'dragging') {
        updateValue(0, true)
        emit('dragEnd', event)
      }
      dragStatus.value = ''
    }

    const onMouseMove = (event: MouseEvent) => {
      if (disabledMove.value)
        return
      if (dragStatus.value === 'start')
        emit('dragStart', event)
      event.preventDefault()
      touch.move(event)
      dragStatus.value = 'dragging'

      const rect = (root.value as Element).getBoundingClientRect()
      const delta = touch.deltaX.value // 即手指从触摸起点到当前点的水平移动距离
      const total = rect.width
      const diff = (delta / total) * scope.value
      current = startValue + diff
      updateValue(current)
      if (current >= 100)
        emit('toRight')
    }
    const onMouseUp = (event: MouseEvent) => {
      if (dragStatus.value === 'dragging') {
        updateValue(0, true)
        emit('dragEnd', event)
      }
      dragStatus.value = ''
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    const onMouseDown = (event: MouseEvent) => {
      if (disabledMove.value)
        return
      touch.start(event)
      current = props.modelValue
      updateStartValue()
      dragStatus.value = 'start'
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    }

    const renderButton = () => {
      const current = props.modelValue
      return (
        <div
          ref={slider}
          role="slider"
          class={`absolute h-[40px] w-[40px] flex items-center justify-center rounded-[50%] border-[2px] border-[var(--app-sports-slider-border)] border-solid bg-[#000] ${disabledMove.value ? '' : 'cursor-pointer'}`}
          style={barStyle.value}
          tabindex={props.disabled ? undefined : 0}
          aria-valuemin={props.min}
          aria-valuenow={current}
          aria-valuemax={props.max}
          aria-disabled={props.disabled || undefined}
          aria-readonly={props.readonly || undefined}
          aria-orientation="vertical"
          onTouchstartPassive={onTouchStart}
          onTouchmove={onTouchMove}
          onTouchend={onTouchEnd}
          onTouchcancel={onTouchEnd}
          onMousedown={onMouseDown}
        >
          <IconSptBetArrrow1 style={{ fontSize: '20px', color: 'var(--app-sports-slider-iocn1)' }} />
        </div>
      )
    }

    // format initial value
    updateValue(props.modelValue)

    return () => (
      <div
        class={`w-full ${props.isClosed || (props.isMulti && Number(props.count) < 2) ? 'opacity-50 bg-[#24ee89]' : 'bg-[#24ee89]'} rounded-[31px] h-[48px] relative ${{ disabled: props.disabled }}`}
      >
        {props.loading && (<BaseLoading2 style={{ height: '48px' }} />)}
        {!props.loading && (
          <div class="h-full">
            {/* pr = pr - 按钮大小 因为不能移动超过盒子 */}
            <div class="absolute h-full w-full flex pl-[4px] pr-[44px] pt-[4px]">
              <div ref={root} class="relative w-full">
                {renderButton()}
              </div>
            </div>
            <div class="h-full w-full flex items-center justify-between pl-[48px] pr-[22px]">
              {!props.isMulti && !props.isClosed && (
                <div class="flex items-center">
                  <span class="mr-[6px] text-[14px] font-semibold text-[var(--app-sports-slider-text)]">
                    {props.appointing ? '预约' : '投注'}
                  </span>
                  <span class="text-[14px] font-semibold text-[var(--app-sports-slider-text-win)] opacity-50">
                    可赢{profit.value}
                  </span>
                </div>
              )
              }
              {props.isMulti && Number(props.count) >= 2 && (
                <div class="flex items-center">
                  <span class="mr-[6px] text-[14px] font-semibold text-[var(--app-sports-slider-text)]">
                    投注
                  </span>
                  <span class="text-[14px] font-semibold text-[var(--app-sports-slider-text-win)] opacity-50">
                    可赢{profit.value}
                  </span>
                </div>
              )
              }
              {!props.isMulti && props.isClosed && (<div class="text-[14px] font-semibold text-[var(--app-sports-slider-text)]">盘口已暂停</div>)}
              {props.isMulti && Number(props.count) < 2 && (<div class="text-[14px] font-semibold text-[var(--app-sports-slider-text)]">至少选择两场比赛</div>)}
              <div class="flex items-center">
                <IconSptBetArrrow1 style={{ fontSize: '12px', color: 'var(--app-sports-slider-iocn2)', opacity: 0.2 }} />
                <IconSptBetArrrow1 style={{ fontSize: '12px', color: 'var(--app-sports-slider-iocn2)', opacity: 0.6 }} />
                <IconSptBetArrrow1 style={{ fontSize: '12px', color: 'var(--app-sports-slider-iocn2)', }} />
              </div>
            </div>
          </div>
        )}

      </div>
    )
  },

})

// add num and avoid float number
function addNumber(num1: number, num2: number) {
  const cardinal = 10 ** 10
  return Math.round((num1 + num2) * cardinal) / cardinal
}

/** clamps number within the inclusive lower and upper bounds */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max)
}

type Direction = '' | 'vertical' | 'horizontal'
const TAP_OFFSET = 5
function getDirection(x: number, y: number) {
  if (x > y)
    return 'horizontal'

  if (y > x)
    return 'vertical'

  return ''
}

function useTouch() {
  const startX = ref(0)
  const startY = ref(0)
  const deltaX = ref(0)
  const deltaY = ref(0)
  const offsetX = ref(0)
  const offsetY = ref(0)
  const direction = ref<Direction>('')
  const isTap = ref(true)

  const isVertical = () => direction.value === 'vertical'
  const isHorizontal = () => direction.value === 'horizontal'

  const reset = () => {
    deltaX.value = 0
    deltaY.value = 0
    offsetX.value = 0
    offsetY.value = 0
    direction.value = ''
    isTap.value = true
  }
  const start = ((event: TouchEvent | MouseEvent) => {
    reset()
    if ((event as TouchEvent).type === 'touchstart') {
      startX.value = (event as TouchEvent).touches[0].clientX
      startY.value = (event as TouchEvent).touches[0].clientY
    }
    else {
      startX.value = (event as MouseEvent).clientX
      startY.value = (event as MouseEvent).clientY
    }
  }) as EventListener

  const move = ((event: TouchEvent | MouseEvent) => {
    const touch = (event as TouchEvent).type === 'touchmove' ? (event as TouchEvent).touches[0] : event as MouseEvent

    // safari back will set clientX to negative number
    deltaX.value = (touch.clientX < 0 ? 0 : touch.clientX) - startX.value
    deltaY.value = touch.clientY - startY.value
    offsetX.value = Math.abs(deltaX.value)
    offsetY.value = Math.abs(deltaY.value)

    // lock direction when distance is greater than a certain value
    const LOCK_DIRECTION_DISTANCE = 10
    if (
      !direction.value
      || (offsetX.value < LOCK_DIRECTION_DISTANCE
        && offsetY.value < LOCK_DIRECTION_DISTANCE)
    )
      direction.value = getDirection(offsetX.value, offsetY.value)

    if (
      isTap.value
      && (offsetX.value > TAP_OFFSET || offsetY.value > TAP_OFFSET)
    )
      isTap.value = false
  }) as EventListener

  return {
    move,
    start,
    reset,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    isVertical,
    isHorizontal,
    isTap,
  }
}
