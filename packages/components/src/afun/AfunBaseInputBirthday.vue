<script setup lang="ts">
import { IconBirArrow } from '@tg/icons'
import dayjs from 'dayjs'
import { useField } from 'vee-validate'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue?: string
  must?: boolean
  layout?: 'horizontal' | 'vertical'
  label?: string
}
defineOptions({
  name: 'AfunBaseInputBirthday',
})
const props = withDefaults(defineProps<Props>(), {
  layout: 'vertical',
})
const emit = defineEmits(['update:modelValue'])
const { t: $t } = useI18n()
const dayInputRef = ref()
const yearInputRef = ref()
const showAllRed = ref(false)

const monthList = [
  { label: '一月', value: 1 },
  { label: '二月', value: 2 },
  { label: '三月', value: 3 },
  { label: '四月', value: 4 },
  { label: '五月', value: 5 },
  { label: '六月', value: 6 },
  { label: '七月', value: 7 },
  { label: '八月', value: 8 },
  { label: '九月', value: 9 },
  { label: '十月', value: 10 },
  { label: '十一月', value: 11 },
  { label: '十二月', value: 12 },
]
const {
  value: month,
  setValue: setMonth,
  errorMessage: errorMonthMsg,
  validate: valiMonth,
  resetField: resetMonthField,
} = useField<number>('month', (value) => {
  showAllRed.value = false
  if (!value)
    return $t('请输入您的出生日期')

  return ''
}, { initialValue: 0, validateOnValueUpdate: false })
const {
  value: year,
  setValue: setYear,
  errorMessage: errorYearMsg,
  validate: valiYear,
  resetField: resetYearField,
} = useField<number>('year', (value) => {
  showAllRed.value = false
  if (!value)
    return $t('请输入您的出生日期')
  if (value < 1900)
    return $t('请输入您的出生日期')

  return ''
}, { validateOnValueUpdate: false })

const dayMax = computed(() => {
  const have31 = [1, 3, 5, 7, 8, 10, 12]
  const have30 = [4, 6, 9, 11]

  if (month.value) {
    if (have31.includes(month.value))
      return 31

    if (have30.includes(month.value))
      return 30

    if (month.value === 2)
      return year.value && dayjs(`${year.value}-01-01`).isLeapYear() ? 29 : 28
  }

  return 31
})
const {
  value: day,
  setValue: setDay,
  errorMessage: errorDayMsg,
  validate: valiDay,
  resetField: resetDay,
} = useField<number>('day', (value) => {
  showAllRed.value = false
  if (!value)
    return $t('请输入您的出生日期')
  if (value > dayMax.value)
    return $t('日期不能超过{delta}号', { delta: dayMax.value })
  if (!(month.value >= 1 && month.value <= 12))
    resetMonthField()
  if (!year.value)
    resetYearField()

  return ''
}, { validateOnValueUpdate: false })

if (props.modelValue) {
  const temp = props.modelValue.split('-')
  setYear(+temp[0])
  setMonth(+temp[1])
  setDay(+temp[2])
}

const curYear = dayjs().year()
const curMonth = dayjs().month() + 1
const curDay = dayjs().date()
const isOver120 = computed(() => {
  if (+year.value > 0 && +day.value > 0
    && +day.value <= +dayMax.value && +month.value > 0) {
    if (curYear - year.value >= 120) {
      if (curYear - year.value > 120) {
        return true
      }
      else {
        if (curMonth >= month.value) {
          if (curMonth > month.value) {
            return true
          }
          else {
            if (curDay > day.value)
              return true
            else return false
          }
        }
        else {
          return false
        }
      }
    }
    return false
  }
  return undefined
})

// 是否满足18岁
const isEnough = computed(() => {
  const yearStr = year.value ? year.value : ''
  const monthStr = month.value ? `-${month.value}` : ''
  const dayStr = day.value ? `-${day.value}` : ''

  if (year.value && +year.value >= 1900 && !errorDayMsg.value && !errorMonthMsg.value) {
    const birthDayjs = dayjs(month.value ? yearStr + monthStr + dayStr : yearStr)
    const currentDate = dayjs()
    const age = currentDate.diff(birthDayjs, 'year')

    if (month.value && age === 18) {
      const birthMonth = birthDayjs.month()
      const currentMonth = currentDate.month()

      if (day.value && currentMonth === birthMonth) {
        const birthDay = birthDayjs.date()
        const currentDay = currentDate.date()

        return currentDay >= birthDay
      }

      if (currentMonth >= birthMonth)
        return true
    }
    return month.value ? age > 18 : age >= 18
  }
  return false
})

const msg = computed(() => {
  if (day.value > dayMax.value)
    return $t('日期不能超过{delta}号', { delta: dayMax.value })
  if (!day.value || !month.value || !year.value)
    return $t('请输入您的出生日期')
  if (isOver120.value === true)
    return $t('您的年龄不能超过 {delta} 岁', { delta: 120 })
  if (!isEnough.value)
    return $t('您必须年满 18 岁以上')

  return errorDayMsg.value || errorMonthMsg.value || errorYearMsg.value
})

const isValid = computed(() => {
  return !!(!isOver120.value && isEnough.value && +month.value >= 1
    && +month.value <= 12
    && +day.value > 0 && +day.value <= +dayMax.value && +year.value >= 1900)
})

function onInput() {
  console.log(year.value, 'year.value')
  console.log(month.value, 'month.value')
  console.log(day.value, 'day.value.value')
  // if (day.value > 0 && day.value <= dayMax.value)
  //   checkValidTip(dayInputRef.value, '')

  // if (year.value >= 1900)
  //   checkValidTip(yearInputRef.value, '')

  setTimeout(() => {
    if (year.value && month.value && day.value && !msg.value) {
      emit('update:modelValue', `${year.value}-${month.value > 9
        ? month.value
        : `0${month.value}`}-${day.value > 9
        ? day.value
        : `0${day.value}`}`)
    }
  }, 0)
}
async function valiBirthday() {
  await valiMonth()
  await valiYear()
  await valiDay()
  // 注释掉的这些是能够触发input的原生提示，有需要再放开
  // if (+day.value <= 0)
  //   checkValidTip(dayInputRef.value, $t('max_value', { delta: 1 }))

  // else if (+year.value < 1900)
  //   checkValidTip(yearInputRef.value, $t('max_value', { delta: 1900 }))

  // if (!isValid.value)
  //   showAllRed.value = true

  return msg.value
}

// function checkValidTip(el: HTMLObjectElement, msg: string) {
//   el?.checkValidity()
//   el?.setCustomValidity(msg) // 如果是 '', 会提示原生的校验提示
//   el?.reportValidity()
// }
function resetBirthday() {
  resetMonthField()
  resetYearField()
  resetDay()
  emit('update:modelValue', '')
}

onMounted(() => {
  if (props.modelValue) {
    const arr = props.modelValue.split('-')
    setYear(+arr[0])
    setMonth(+arr[1])
    setDay(+arr[2])
  }
})
watch(() => month.value, () => {
  onInput()
})
defineExpose({ valiBirthday, msg, isValid, resetBirthday })
</script>

<template>
  <div class="base-input-birthday">
    <div :class="[layout]">
      <label>{{ props?.label }} <span v-if="must">*</span></label>
      <div class="input-wrap">
        <!-- 日 -->
        <input
          ref="dayInputRef" v-model="day" type="number" :max="dayMax" autocomplete="on"
          :placeholder="$t('DD')" @input="onInput"
        >
        <!-- 月 -->
        <div class="w-full relative">
          <select
            v-model="month"
            :class="{
              'placeholder-select': monthList.filter(m => m.value === month).length === 0,
            }"
            class="appearance-none w-full h-full text-[#0d2245] font-[600] rounded-[8px] flex justify-between items-center" required @change="onInput();valiDay()"
          >
            <option value="0" disabled selected>
              Month
            </option>
            <option v-for="m, i in monthList" :key="i" :value="m.value">
              {{ $t(m.label) }}
            </option>
          </select>
          <div class="absolute right-[12px] top-[50%] -translate-y-[50%] size-[14px] center pointer-events-none">
            <IconBirArrow class="text-[14px] text-[#9dabc9]" />
          </div>
        </div>
        <!-- 年 -->
        <input
          ref="yearInputRef" v-model="year" type="number"
          :placeholder="$t('YYYY')" @input="onInput"
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-input-birthday {
  .input-wrap {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0 8px;
    height: 44px;

    input,
    select {
      width: 100%;
      border-radius: 8px;
      background: #0f212e;
      border-width: 1px;
      border-style: solid;
      border-color: #2f4553;
      color: #fff;
      outline: none;
      transition: all ease 0.25s;
      line-height: 1;
      font-weight: 600;
      padding-left: 12px;
      padding-right: 12px;

      &:focus:not(.error) {
        border-color: #24ee89;
      }

      &::placeholder {
        font-weight: 600;
        color: #566771;
      }
    }
    .placeholder-select {
      color: #566771 !important;
      font-weight: 600;
    }
  }
}
</style>
