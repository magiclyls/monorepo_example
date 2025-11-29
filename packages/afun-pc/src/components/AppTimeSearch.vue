<script setup lang="ts">
import dayjs from 'dayjs'

defineOptions({
  name: 'AppTimeSearch',
})
const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    required: true,
  },
  // 唯一新增代码 start
  type: {
    type: Number,
    default: 1,
  },
  defaultType: {
    type: String,
    default: 'today',
  },
})
const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()
const active = ref(props.defaultType)
// 修改类型定义 start
interface TimeButton {
  type: 'today' | 'yesterday' | 'week' | 'month' | 'lastMonth'
  label: string
}
// 修改类型定义 end
const { isZhcn, currentLangZone } = storeToRefs(useLanguageStore())

const timeButtons = computed<TimeButton[]>(() => {
  if (props.type == 2) {
    return [
      { type: 'yesterday', label: t('time_yesterday') },
      { type: 'week', label: t('this_week') },
      { type: 'month', label: t('this_month') },
      { type: 'lastMonth', label: t('last_month') },
    ]
  }
  return [
    { type: 'today', label: t('today_text') },
    { type: 'yesterday', label: t('time_yesterday') },
    { type: 'week', label: t('this_week') },
    { type: 'month', label: t('this_month') },
  ]
})

const curTabRef = ref<Array<Element | null>>([])
const lastIndex = ref(timeButtons.value.findIndex((a: any) => a.value === props.modelValue))
const maxIndex = ref(timeButtons.value.length - 1)

function selectTimeRange(type: TimeButton['type'], i: number) {
  let start: dayjs.Dayjs
  let end: dayjs.Dayjs

  // 仅添加 lastMonth 处理 start
  switch (type) {
    case 'today':
      start = dayjs().tz(currentLangZone.value).startOf('day')
      end = dayjs().tz(currentLangZone.value).endOf('day')
      break
    case 'yesterday':
      start = dayjs().tz(currentLangZone.value)
        .subtract(1, 'day')
        .startOf('day')
      end = dayjs().tz(currentLangZone.value)
        .subtract(1, 'day')
        .endOf('day')
      break
    case 'week':
      start = dayjs().tz(currentLangZone.value).startOf('isoWeek')
      end = dayjs().tz(currentLangZone.value).endOf('day')
      break
    case 'month':
      start = dayjs().tz(currentLangZone.value).startOf('month')
      end = dayjs().tz(currentLangZone.value).endOf('day')
      break
    case 'lastMonth': // 新增 case
      start = dayjs().tz(currentLangZone.value)
        .subtract(1, 'month')
        .startOf('month')
      end = dayjs().tz(currentLangZone.value)
        .subtract(1, 'month')
        .endOf('month')
      break
  }

  active.value = type

  const format = 'YYYY-MM-DD HH:mm:ss'
  console.log(type, end.format(format), 'typetypetype')

  emit('update:modelValue', [
    start.format(format),
    end.format(format),
  ])

  // 自动滚入视口
  nextTick(() => {
    // 点击之后第二个元素要进入视口
    let nextOneIndex = i
    // 右边
    if (i > lastIndex.value) {
      if (i === maxIndex.value)
        nextOneIndex = i
      else
        nextOneIndex = i + 1
    }
    // 左边
    else {
      if (i === 0)
        nextOneIndex = i
      else
        nextOneIndex = i - 1
    }
    curTabRef.value[nextOneIndex]?.scrollIntoView({
      behavior: 'smooth', block: 'nearest', inline: props.scrollInline,
    })
    // 记录下标
    lastIndex.value = i
  })
}

selectTimeRange(timeButtons.value[0].type, 0)
</script>

<!-- 模板和样式保持完全不变 -->
<template>
  <div class="time-range-container">
    <button
      v-for="btn, i in timeButtons" :key="btn.label" :ref="(el:any) => curTabRef[i] = (el as Element)" class="time-button"
      :class="{ active: active === btn.type, isZhcn }" @click.stop="selectTimeRange(btn.type, i)"
    >
      {{ btn.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.time-range-container {
  height: 40px;
  display: grid;
  grid-template-columns: repeat(4, minmax(55px, 200px));
  gap: 8px;
}

.time-button {
  padding: 8px 13px;
  font-size: 14px;
  font-weight: 600 !important;
  border-radius: 4px;
  background: var(--tg-secondary-dark);
  cursor: pointer;
  transition: all 0.3s;
  color: #ffffff;

  &.isZhcn{
    font-weight: 500 !important;
  }

  @include webTheme('white') {
    color: #111111;
  }

  &.active {
    background: var(--tg-sport-btn-hover);

    @include webTheme('green') {
      background: #197B59;
    }

    @include webTheme('white') {
      color: #111111;
    }
  }
}
</style>
