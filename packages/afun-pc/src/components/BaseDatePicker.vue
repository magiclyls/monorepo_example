<script lang="ts" setup>
import utc from 'dayjs/plugin/utc'
import { IconUniArrowDown, IconUniWarning } from '@tg/icons';

type DateLabel = 'start' | 'end'
interface Props {
  modelValue: Array<string>
  initStartDate?: string | number | Date
  initEndDate?: string | number | Date
  min?: string | number | Date
  max?: string | number | Date
  isUtc?: boolean
}

defineOptions({
  name: 'BaseDatePicker',
})
const props = withDefaults(defineProps<Props>(), { isUtc: true })
const emit = defineEmits(['update:modelValue', 'change'])

dayjs.extend(utc)

const { t } = useI18n()
const { openNotify } = useNotify()

const today = dayjs(new Date()).format('YYYY-MM-DD')
const { bool: arrowUp1, setFalse: setUpFalse1, setTrue: setUpTrue1 } = useBoolean(false)
const { bool: arrowUp2, setFalse: setUpFalse2, setTrue: setUpTrue2 } = useBoolean(false)

const startDateEle = ref()
const endDateEle = ref()
const startDate = ref(props.initStartDate !== undefined
  ? dayjs(props.initStartDate).format('YYYY-MM-DD')
  : today)
const endDate = ref(props.initEndDate !== undefined
  ? dayjs(props.initEndDate).format('YYYY-MM-DD')
  : today)

const startDateLabel = computed(() => timeToCustomizeFormat(dayjs(startDate.value), 'YYYY-MM-DD'))
const endDateLabel = computed(() => timeToCustomizeFormat(dayjs(endDate.value), 'YYYY-MM-DD'))

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
    startDateEle.value.showPicker()
    setUpTrue1()
  }

  else {
    endDateEle.value.showPicker()
    setUpTrue2()
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
  openNotify({
    type: 'error',
    title: t('notify_title_error'),
    message: bool ? t('time_error_not_than_start') : t('time_error_not_future'),
  })
}

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
  <div class="date-picker-outer">
    <div class="base-date-picker">
      <label>
        <div class="label-box">
          <div>
            <span>{{ startDate ? startDateLabel : '' }}</span>
            <input ref="startDateEle" type="date" name="startDate" :value="startDate" :max="maxDate"
              @click="togglePicker('start')" @change="e => dateChange(e, 'start')">
          </div>
          <IconUniArrowDown class="arrow" :class="{ 'arrow-up': arrowUp1 }" name="uni-arrow-down" />
        </div>
      </label>
    </div>
    <div class="base-date-picker">
      <label class="end">
        <div class="label-box">
          <div>
            <span>{{ endDate ? endDateLabel : '' }}</span>
            <input ref="endDateEle" type="date" name="endDate" :value="endDate" :min="startDate" :max="maxEnd"
              @click="togglePicker('end')" @change="e => dateChange(e, 'end')">
          </div>
          <IconUniArrowDown class="arrow" :class="{ 'arrow-up': arrowUp2 }" name="uni-arrow-down" />
        </div>
      </label>
    </div>
    <!-- <div v-if="!isValid" class="error">
      <IconUniWarning name="uni-warning" /><span>{{ $t('date_picker_error') }}</span>
    </div> -->
  </div>
</template>

<style lang="scss">
:root {
  --tg-base-date-picker-width: 220px;
  --tg-base-date-picker-bother: 2px solid var(--tg-secondary-main);
  --tg-base-date-picker-font-size: var(--tg-font-size-default);
  --tg-base-date-picker-padding: var(--tg-spacing-8) var(--tg-spacing-12);
  --tg-base-date-picker-font-weight: var(--tg-font-weight-semibold);
  --tg-base-date-picker-color: var(--tg-text-lightgrey);
  --tg-base-date-picker-bg: var(--tg-secondary-dark);
  --tg-base-date-picker-outer-margin-right: var(--tg-spacing-16);
  --tg-base-date-picker-outer-height: auto;
}

[theme="white"] {
  --tg-base-date-picker-bother: 2px solid #e3e3e3;
  --tg-base-date-picker-bg: var(--tg-text-lightgrey);
  --tg-base-date-picker-bg: #ffffff;
}

[theme="green"] {
  --tg-base-green-border: #197B59;
}
</style>

<style lang="scss" scoped>
.date-picker-outer {
  position: relative;
  display: flex;
  align-items: center;

  // gap: var(--tg-spacing-16);
  >* {
    margin-right: var(--tg-base-date-picker-outer-margin-right);
  }

  >:last-child {
    margin-right: 0;
  }

  .error {
    display: flex;
    align-items: center;
    font-size: var(--tg-font-size-md);
    color: var(--tg-text-error);
    line-height: var(--tg-spacing-24);

    span {
      font-size: var(--tg-font-size-xs);
      margin-left: var(--tg-spacing-4);
    }
  }
}

.base-date-picker {
  display: flex;
  width: var(--tg-base-date-picker-width);
  border-radius: var(--tg-radius-default);
  border: var(--tg-base-date-picker-bother);
  background: var(--tg-base-date-picker-bg);
  // padding: var(--tg-base-date-picker-padding);
  font-size: var(--tg-base-date-picker-font-size);
  font-weight: var(--tg-base-date-picker-font-weight);
  color: var(--tg-base-date-picker-color);
  line-height: 1.5;
  transition: border-color 200ms ease;

  &:hover {
    border-color: var(--tg-border-color-deep-grey);
  }

  .separator {
    color: var(--tg-text-white);
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

      >*:not(:first-child) {
        margin-left: var(--tg-spacing-8);
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

  .app-svg-icon {
    transform-origin: center center;
    transition: transform 250ms;
    transform: rotate(0deg);

    &.arrow-up {
      transform: rotate(180deg);
    }
  }

  @include webTheme('white') {
    background: #f5f5f5;
  }
}

.arrow {
  @include webTheme('green') {
    // color: var(--tg-popper-hover-color-default)
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

//   }</style>
