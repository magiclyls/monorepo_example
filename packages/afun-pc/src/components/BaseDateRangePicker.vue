<script setup lang="ts">
import type { ScrollPickerValue } from './BaseScrollPicker.vue'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isoWeek from 'dayjs/plugin/isoWeek'
import utc from 'dayjs/plugin/utc'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from './BaseButton.vue'
import BaseScrollPicker from './BaseScrollPicker.vue'
import BaseTab from './BaseTab.vue'

defineOptions({ name: 'AfunBaseDatePicker' })
const props = withDefaults(
  defineProps<{
    modelValue: Array<string>
    initStartDate?: string | number | Date
    initEndDate?: string | number | Date
    showTab?: boolean
    isUtc?: boolean
    label?: string
  }>(),
  {
    modelValue: () => [],
    showTab: true,
  },
)
const emit = defineEmits(['update:modelValue', 'change', 'update:label', 'confirm'])
dayjs.extend(advancedFormat)
dayjs.extend(utc)
dayjs.extend(isoWeek)

interface OptionItem {
  label: string
  value: string
  start?: string
  end?: string
}

const { t } = useI18n()
const tab = ref(props.label || t('today'))

// 时间周期选项
const tabList = ref<OptionItem[]>([
  { label: t('today'), value: t('today'), start: dayjs().format('YYYY-MM-DD'), end: dayjs().format('YYYY-MM-DD') },
  { label: t('time_yesterday'), value: t('time_yesterday'), start: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), end: dayjs().subtract(1, 'day').format('YYYY-MM-DD') },
  { label: t('last_7d'), value: t('last_7d'), start: dayjs().subtract(6, 'day').format('YYYY-MM-DD'), end: dayjs().format('YYYY-MM-DD') },
  { label: t('last_30d'), value: t('last_30d'), start: dayjs().subtract(29, 'day').format('YYYY-MM-DD'), end: dayjs().format('YYYY-MM-DD') },
])
const today = dayjs(new Date())
const startDate = ref(dayjs(props.initStartDate) || today)
const endDate = ref(dayjs(props.initEndDate) || today)

const currentYearStart = computed(() => startDate.value.year())
const currentMonthStart = computed(() => startDate.value.month() + 1)
const currentDayStart = computed(() => startDate.value.date())

const currentYearEnd = computed(() => endDate.value.year())
const currentMonthEnd = computed(() => endDate.value.month() + 1)
const currentDayEnd = computed(() => endDate.value.date())

const years = computed(() => {
  const currYear = today.year()
  const lastYear = 1980
  return Array.from(
    { length: currYear - lastYear + 1 },
    (_, index) => ({
      name: `${lastYear + index}${t('year')}`,
      value: lastYear + index,
    }),
  )
})
const months = Array.from({ length: 12 }, (_, index) => ({
  name: `${index + 1}${t('month')}`,
  value: index + 1,
}))
const days = computed(() => {
  const year = currentYearStart.value
  const month = currentMonthStart.value // 1-12
  const lastDay = dayjs(`${year}-${month}-01`).daysInMonth()
  return Array.from({ length: lastDay }, (_, index) => ({
    name: `${index + 1}${t('day')}`,
    value: index + 1,
  }))
})

function changeDate() {
  const st = dayjs(startDate.value).startOf('day')
  const et = dayjs(endDate.value).endOf('day')
  const temp = [
    props.isUtc ? st.utc().format('YYYY-MM-DD') : st.format('YYYY-MM-DD'),
    props.isUtc ? et.utc().format('YYYY-MM-DD') : et.format('YYYY-MM-DD'),
  ]
  emit('update:modelValue', temp)
  emit('change', temp)
  emit('update:label', tab.value)
}

function confirm() {
  const st = dayjs(startDate.value).startOf('day')
  const et = dayjs(endDate.value).endOf('day')
  const temp = [
    props.isUtc ? st.utc().format('YYYY-MM-DD') : st.format('YYYY-MM-DD'),
    props.isUtc ? et.utc().format('YYYY-MM-DD') : et.format('YYYY-MM-DD'),
  ]
  emit('update:modelValue', temp)
  emit('confirm', temp)
  emit('update:label', tab.value)
}

function handleUpdateYear(value: ScrollPickerValue | undefined) {
  startDate.value = dayjs(startDate.value).set('year', value as number)
}

function handleUpdateMonth(value: ScrollPickerValue | undefined) {
  startDate.value = dayjs(startDate.value).set('month', value as number - 1)
}

function handleUpdateDay(value: ScrollPickerValue | undefined) {
  startDate.value = dayjs(startDate.value).set('date', value as number)
}

function handleUpdateYearEnd(value: ScrollPickerValue | undefined) {
  endDate.value = dayjs(endDate.value).set('year', value as number)
}

function handleUpdateMonthEnd(value: ScrollPickerValue | undefined) {
  endDate.value = dayjs(endDate.value).set('month', value as number - 1)
}

function handleUpdateDayEnd(value: ScrollPickerValue | undefined) {
  endDate.value = dayjs(endDate.value).set('date', value as number)
}

watch(tab, () => {
  if (!props.showTab)
    return
  const today = dayjs()
  if (tab.value === t('today')) {
    startDate.value = today
    endDate.value = today
  }
  else if (tab.value === t('time_yesterday')) {
    const yesterday = today.subtract(1, 'day')
    startDate.value = yesterday
    endDate.value = yesterday
  }
  else if (tab.value === t('last_7d')) {
    const startOfWeek = today.subtract(6, 'day') // 默认以周日为第一天
    startDate.value = startOfWeek
    endDate.value = today
  }
  else if (tab.value === t('last_30d')) {
    const startOfMonth = today.subtract(29, 'day')
    startDate.value = startOfMonth
    endDate.value = today
  }
  emit('update:label', tab.value)
}, { immediate: true })

onBeforeMount(() => !props.initStartDate && changeDate())
</script>

<template>
  <div class="flex flex-col gap-[16px] p-[16px] pt-0">
    <div class="text-[#B1BAD3] text-[14px] font-[500]">
      {{ t('transaction_record_time_limit') }}
    </div>
    <BaseTab v-model="tab" class="record-tab" :list="tabList" :center="false" need-scroll-at-init scroll-inline="center" shape="square" style="--tg-tab-style-active-bg: #24EE89;--tg-tab-style-box-padding:0; --tg-tab-style-wrap-bg-color: transparent; --tg-base-tab-background-color: #0F212E"/>
    <div class="bg-[#213743] rounded-[8px] py-[16px] px-[19px]">
      <div class="flex gap-[22px]">
        <div class="flex flex-col justify-center items-center text-[#B1BAD3] text-[14px] font-[600] gap-[4px]">
          <span class="mb-[10px]">{{ t('from') }}</span>
          <span class="bg-[#B1BAD3] w-[1px] h-[3px] rounded-[1.5px]" />
          <span class="bg-[#B1BAD3] w-[1px] h-[6px] rounded-[1.5px]" />
          <span class="bg-[#B1BAD3] w-[1px] h-[6px] rounded-[1.5px]" />
          <span class="bg-[#B1BAD3] w-[1px] h-[6px] rounded-[1.5px]" />
          <span class="mt-[10px]">{{ t('to1') }}</span>
        </div>
        <div class="flex-1">
          <div class="flex mb-[12px]">
            <BaseScrollPicker
              :options="years"
              :model-value="currentYearStart"
              @update:model-value="handleUpdateYear"
            />
            <BaseScrollPicker
              :options="months"
              :model-value="currentMonthStart"
              @update:model-value="handleUpdateMonth"
            />
            <BaseScrollPicker
              :options="days"
              :model-value="currentDayStart"
              @update:model-value="handleUpdateDay"
            />
          </div>
          <div class="flex pt-[12px] border-t border-t-[#2F4553]">
            <BaseScrollPicker
              :options="years"
              :model-value="currentYearEnd"
              @update:model-value="handleUpdateYearEnd"
            />
            <BaseScrollPicker
              :options="months"
              :model-value="currentMonthEnd"
              @update:model-value="handleUpdateMonthEnd"
            />
            <BaseScrollPicker
              :options="days"
              :model-value="currentDayEnd"
              @update:model-value="handleUpdateDayEnd"
            />
          </div>
        </div>
      </div>
      <BaseButton class="w-full mt-[20px]" @click="confirm" bg-style="primary">
        {{ t('confirm') }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.picker-group {
  display: flex;
}
</style>
