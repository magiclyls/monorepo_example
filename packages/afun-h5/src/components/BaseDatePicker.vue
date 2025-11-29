<script lang="ts" setup>
import { AfunBaseTabs } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks/useBoolean'
import { IconUniArrowUpBig } from '@tg/icons'
import { getDaIntervalMap, timeToCustomizeFormat } from '@tg/vue-i18n'
import { onClickOutside } from '@vueuse/core'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'BaseDatePicker',
})
const props = withDefaults(defineProps<Props>(), { isUtc: true })
const emit = defineEmits(['update:modelValue', 'change'])
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

type DateLabel = 'start' | 'end'
interface Props {
  modelValue: Array<string>
  initStartDate?: string | number | Date
  initEndDate?: string | number | Date
  min?: string | number | Date
  max?: string | number | Date
  isUtc?: boolean
  showTab?: boolean
}
interface OptionItem {
  label: string
  value: string
  start?: string
  end?: string
}

dayjs.extend(utc)

const { t } = useI18n()
const tab = ref('今天')

// 时间周期选项
const tabList = ref<OptionItem[]>([
  { label: t('今天'), value: '今天', start: dayjs().format('YYYY-MM-DD'), end: dayjs().format('YYYY-MM-DD') },
  { label: t('昨天'), value: '昨天', start: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), end: dayjs().subtract(1, 'day').format('YYYY-MM-DD') },
  { label: t('本周'), value: '本周', start: dayjs().startOf('isoWeek').format('YYYY-MM-DD'), end: dayjs().format('YYYY-MM-DD') },
  { label: t('本月'), value: '本月', start: dayjs().startOf('month').format('YYYY-MM-DD'), end: dayjs().format('YYYY-MM-DD') },
])

const today = dayjs(new Date()).format('YYYY-MM-DD')
const { bool: arrowUp1, setFalse: setUpFalse1, setTrue: setUpTrue1 } = useBoolean(false)
const { bool: arrowUp2, setFalse: setUpFalse2, setTrue: setUpTrue2 } = useBoolean(false)

const startDateEle = ref<HTMLInputElement>()
const endDateEle = ref<HTMLInputElement>()
const startDate = ref(props.initStartDate !== undefined
  ? dayjs(props.initStartDate).format('YYYY-MM-DD')
  : today)
const endDate = ref(props.initEndDate !== undefined
  ? dayjs(props.initEndDate).format('YYYY-MM-DD')
  : today)

const startDateLabel = computed(() => timeToCustomizeFormat(dayjs(startDate.value).valueOf(), 'YYYY-MM-DD'))
const endDateLabel = computed(() => timeToCustomizeFormat(dayjs(endDate.value).valueOf(), 'YYYY-MM-DD'))

// const minDate = computed(() =>
//   props.min === undefined ? undefined : dayjs(props.min).format('YYYY-MM-DD'))
const maxDate = computed(() =>
  props.max === undefined ? today : dayjs(props.max).format('YYYY-MM-DD'))
const maxEnd = computed(() => {
  const time = dayjs(getDaIntervalMap(startDate.value, -90).startTime)
  return time.isBefore(dayjs(props.max)) ? time.format('YYYY-MM-DD') : maxDate.value
})

// const isValid = computed(() => startDate.value <= endDate.value)

onClickOutside(startDateEle, setUpFalse1)
onClickOutside(endDateEle, setUpFalse2)
function togglePicker(ty: DateLabel) {
  if (ty === 'start') {
    if (arrowUp1.value) {
      setUpFalse1()
      startDateEle.value?.blur()
    }
    else {
      setUpTrue1()
      startDateEle.value?.showPicker()
    }
  }

  else {
    if (arrowUp2.value) {
      setUpFalse2()
      endDateEle.value?.blur()
    }
    else {
      setUpTrue2()
      endDateEle.value?.showPicker()
    }
  }
}

function dateChange(e: any, ty: DateLabel) {
  const value = e.target.value
  const valUnix = dayjs(value).unix()
  const { min, max } = e.target
  if (ty === 'start') {
    if (valUnix <= dayjs(max).unix()) {
      startDate.value = value
      e.target.blur()
    }
    else {
      return openError()
    }
    const num = dayjs(endDate.value).diff(dayjs(value), 'days')
    if (num > 90)
      endDate.value = getDaIntervalMap(value, -90).startTime
    else if (num <= 0)
      endDate.value = value
  }
  else {
    const minBool = valUnix >= dayjs(min).unix()
    const maxBool = valUnix <= dayjs(max).unix()
    if (minBool && maxBool) {
      endDate.value = value
      e.target.blur()
    }
    else {
      return openError(!minBool)
    }
  }
  setUpFalse1()
  setUpFalse2()
  const st = dayjs(startDate.value).startOf('day')
  const et = dayjs(endDate.value).endOf('day')
  const temp = [
    props.isUtc ? st.utc().format('YYYY-MM-DD HH:mm:ss') : st.format('YYYY-MM-DD HH:mm:ss'),
    props.isUtc ? et.utc().format('YYYY-MM-DD HH:mm:ss') : et.format('YYYY-MM-DD HH:mm:ss'),
  ]
  emit('update:modelValue', temp)
  emit('change', temp)
}
function openError(bool = false) {
  // openNotify({
  //   type: 'error',
  //   title: t('notify_title_error'),
  //   message: bool ? t('time_error_not_than_start') : t('time_error_not_future'),
  // })
}

function checkIsSelectTab() {
  if (!props.showTab)
    return
  let hasSelect = false
  for (let i = 0; i < tabList.value.length; i++) {
    if (tabList.value[i].start === startDate.value && tabList.value[i].end === endDate.value) {
      tab.value = tabList.value[i].value
      hasSelect = true
      break
    }
  }
  if (!hasSelect)
    tab.value = ''
}

watch(startDate, () => checkIsSelectTab())
watch(endDate, () => checkIsSelectTab())

watch(tab, () => {
  if (!props.showTab)
    return
  const today = dayjs()
  if (tab.value === '今天') {
    startDate.value = today.format('YYYY-MM-DD')
    endDate.value = today.format('YYYY-MM-DD')
  }
  else if (tab.value === '昨天') {
    const yesterday = today.subtract(1, 'day')
    startDate.value = yesterday.format('YYYY-MM-DD')
    endDate.value = yesterday.format('YYYY-MM-DD')
  }
  else if (tab.value === '本周') {
    const startOfWeek = today.startOf('isoWeek') // 默认以周日为第一天
    startDate.value = startOfWeek.format('YYYY-MM-DD')
    endDate.value = today.format('YYYY-MM-DD')
  }
  else if (tab.value === '本月') {
    const startOfMonth = today.startOf('month')
    startDate.value = startOfMonth.format('YYYY-MM-DD')
    endDate.value = today.format('YYYY-MM-DD')
  }
  const st = dayjs(startDate.value).startOf('day')
  const et = dayjs(endDate.value).endOf('day')
  const temp = [
    props.isUtc ? st.utc().format('YYYY-MM-DD HH:mm:ss') : st.format('YYYY-MM-DD HH:mm:ss'),
    props.isUtc ? et.utc().format('YYYY-MM-DD HH:mm:ss') : et.format('YYYY-MM-DD HH:mm:ss'),
  ]
  emit('update:modelValue', temp)
  emit('change', temp)
}, { immediate: true })

onMounted(() => {
  const st = dayjs(startDate.value).startOf('day')
  const et = dayjs(endDate.value).endOf('day')
  const temp = [
    props.isUtc ? st.utc().format('YYYY-MM-DD HH:mm:ss') : st.format('YYYY-MM-DD HH:mm:ss'),
    props.isUtc ? et.utc().format('YYYY-MM-DD HH:mm:ss') : et.format('YYYY-MM-DD HH:mm:ss'),
  ]
  emit('update:modelValue', temp)
  emit('change', temp)
})
</script>

<template>
  <div>
    <AfunBaseTabs v-if="showTab" v-model="tab" :list="tabList" :type="8" class="mb-[8px]" full />
    <div class="date-picker-outer flex gap-[20px]">
      <div class="base-date-picker">
        <label>
          <div
            class="px-[8px] h-[40px] flex justify-between items-center bg-[#0F212E] rounded-[6px] border-[2px] border-[#0F212E]"
            :class="{ 'border-[#557086]': arrowUp1 }"
          >
            <div>
              <span>{{ startDate ? startDateLabel : '' }}</span>
              <input
                ref="startDateEle" type="date" name="startDate" :value="startDate" :max="maxDate"
                @click="togglePicker('start')" @change="e => dateChange(e, 'start')"
              >
            </div>
            <IconUniArrowUpBig class="arrow text-[#B1BAD3]" :class="{ 'arrow-up': arrowUp1 }" />
          </div>
        </label>
      </div>
      <div class="base-date-picker">
        <label class="end">
          <div
            class="px-[8px] h-[40px] flex justify-between items-center bg-[#0F212E] rounded-[6px] border-[2px] border-[#0F212E]"
            :class="{ 'border-[#557086]': arrowUp2 }"
          >
            <div>
              <span>{{ endDate ? endDateLabel : '' }}</span>
              <input
                ref="endDateEle" type="date" name="endDate" :value="endDate" :min="startDate"
                :max="maxEnd" @click="togglePicker('end')" @change="e => dateChange(e, 'end')"
              >
            </div>
            <IconUniArrowUpBig class="arrow text-[#B1BAD3]" :class="{ 'arrow-up': arrowUp2 }" />
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --tg-base-date-picker-width: 220px;
}
</style>

<style lang="scss" scoped>
.date-picker-outer {
  position: relative;
  display: flex;
  align-items: center;

  // gap:16px;
  > * {
    margin-right: var(--tg-base-date-picker-outer-margin-right);
  }

  > :last-child {
    margin-right: 0;
  }

  .error {
    display: flex;
    align-items: center;
    font-size: 18px;
    color: #ed4163;
    line-height: 24px;

    span {
      font-size: 12px;
      margin-left: 4px;
    }
  }
}

.base-date-picker {
  display: flex;
  width: var(--tg-base-date-picker-width);
  border-radius: 4px;
  border: var(--tg-base-date-picker-bother);
  background: var(--tg-base-date-picker-bg);
  // padding: var(--tg-base-date-picker-padding);
  font-size: var(--tg-base-date-picker-font-size);
  font-weight: var(--tg-base-date-picker-font-weight);
  color: var(--tg-base-date-picker-color);
  line-height: 1.5;
  transition: border-color 200ms ease;

  &:hover {
    border-color: #f2ca5c;
  }

  .separator {
    color: #fff;
  }

  label {
    display: block;
    position: relative;
    flex: 1;
    height: 100%;
    cursor: pointer;
    line-height: 21px;
    min-height: 21px;
    text-align: left;
    white-space: nowrap;

    .label-box {
      display: flex;
      align-items: center;
      padding: var(--tg-base-date-picker-padding);
      height: var(--tg-base-date-picker-outer-height);

      > *:not(:first-child) {
        margin-left: 8px;
      }

      div {
        flex: 1;
        min-height: 21px;
        min-width: 64px;
      }
    }

    input {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -10;
      opacity: 0;
    }
  }

  label.end {
    flex: 1;
    text-align: left;
  }

  .arrow {
    transform-origin: center center;
    transition: transform 250ms;
    transform: rotate(180deg);
    font-size: 10px;

    &.arrow-up {
      transform: rotate(360deg);
    }
  }
}

// input::-webkit-clear-button {
//   -webkit-appearance: none;
//   display: none;
//   visibility:hidden;
// }

// input::-webkit-inner-spin-button {

//   -webkit-appearance: none;
//   visibility: hidden;
//   display: none;

//   }
</style>
