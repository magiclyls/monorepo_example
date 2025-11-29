<script setup lang="ts">
import type { ScrollPickerValue } from './PhBaseScrollPicker.vue'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isoWeek from 'dayjs/plugin/isoWeek'
import utc from 'dayjs/plugin/utc'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PhBaseButton from './PhBaseButton.vue'
import PhBaseScrollPicker from './PhBaseScrollPicker.vue'
import PhBaseTabs from './PhBaseTabs.vue'

defineOptions({ name: 'PhBaseDatePicker' })
const props = withDefaults(
  defineProps<{
    modelValue: Array<string>
    initStartDate?: string | number | Date
    initEndDate?: string | number | Date
    showTab?: boolean
    isUtc?: boolean
  }>(),
  {
    modelValue: () => [],
    showTab: true,
  },
)
const emit = defineEmits(['update:modelValue', 'change', 'update:range'])
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
const tab = ref(t('今日'))

// 时间周期选项
const tabList = ref<OptionItem[]>([
  { label: t('今日'), value: t('今日'), start: dayjs().format('YYYY-MM-DD'), end: dayjs().format('YYYY-MM-DD') },
  { label: t('昨日'), value: t('昨日'), start: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), end: dayjs().subtract(1, 'day').format('YYYY-MM-DD') },
  { label: t('近7日'), value: t('近7日'), start: dayjs().subtract(6, 'day').format('YYYY-MM-DD'), end: dayjs().format('YYYY-MM-DD') },
  { label: t('近30日'), value: t('近30日'), start: dayjs().subtract(29, 'day').format('YYYY-MM-DD'), end: dayjs().format('YYYY-MM-DD') },
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
      name: `${lastYear + index}${t('年')}`,
      value: lastYear + index,
    }),
  )
})
const months = Array.from({ length: 12 }, (_, index) => ({
  name: `${index + 1}${t('月')}`,
  value: index + 1,
}))
const days = computed(() => {
  const year = currentYearStart.value
  const month = currentMonthStart.value // 1-12
  const lastDay = dayjs(`${year}-${month}-01`).daysInMonth()
  return Array.from({ length: lastDay }, (_, index) => ({
    name: `${index + 1}${t('日')}`,
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
  emit('update:range', tab.value)
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
  if (tab.value === t('今日')) {
    startDate.value = today
    endDate.value = today
  }
  else if (tab.value === t('昨日')) {
    const yesterday = today.subtract(1, 'day')
    startDate.value = yesterday
    endDate.value = yesterday
  }
  else if (tab.value === t('近7日')) {
    const startOfWeek = today.subtract(6, 'day') // 默认以周日为第一天
    startDate.value = startOfWeek
    endDate.value = today
  }
  else if (tab.value === t('近30日')) {
    const startOfMonth = today.subtract(29, 'day')
    startDate.value = startOfMonth
    endDate.value = today
  }
  emit('update:range', tab.value)
}, { immediate: true })

onBeforeMount(() => changeDate())
</script>

<template>
  <div class="flex flex-col gap-[16rem]">
    <PhBaseTabs v-if="showTab" v-model="tab" :list="tabList" :type="8" />
    <div class="bg-[#fff] rounded-[8rem] py-[16rem] px-[19rem]">
      <div class="flex gap-[22rem]">
        <div class="flex flex-col justify-center items-center text-[#6D7693] text-[14rem] font-[500] gap-[4rem]">
          <span class="mb-[10rem]">{{ t('起') }}</span>
          <span class="bg-[#6D7693] w-[1rem] h-[3rem] rounded-[1.5rem]" />
          <span class="bg-[#6D7693] w-[1rem] h-[6rem] rounded-[1.5rem]" />
          <span class="bg-[#6D7693] w-[1rem] h-[6rem] rounded-[1.5rem]" />
          <span class="bg-[#6D7693] w-[1rem] h-[6rem] rounded-[1.5rem]" />
          <span class="mt-[10rem]">{{ t('止') }}</span>
        </div>
        <div class="flex-1">
          <div class="flex mb-[12rem]">
            <PhBaseScrollPicker
              :options="years"
              :model-value="currentYearStart"
              @update:model-value="handleUpdateYear"
            />
            <PhBaseScrollPicker
              :options="months"
              :model-value="currentMonthStart"
              @update:model-value="handleUpdateMonth"
            />
            <PhBaseScrollPicker
              :options="days"
              :model-value="currentDayStart"
              @update:model-value="handleUpdateDay"
            />
          </div>
          <div class="flex pt-[12rem] border-t border-t-[#EBEBEB]">
            <PhBaseScrollPicker
              :options="years"
              :model-value="currentYearEnd"
              @update:model-value="handleUpdateYearEnd"
            />
            <PhBaseScrollPicker
              :options="months"
              :model-value="currentMonthEnd"
              @update:model-value="handleUpdateMonthEnd"
            />
            <PhBaseScrollPicker
              :options="days"
              :model-value="currentDayEnd"
              @update:model-value="handleUpdateDayEnd"
            />
          </div>
        </div>
      </div>
      <PhBaseButton class="w-full mt-[20rem]" @click="changeDate">
        {{ t('确认') }}
      </PhBaseButton>
    </div>
  </div>
</template>

<style scoped>
.picker-group {
  display: flex;
}
</style>
