<script setup lang="ts">
import { BaseImage } from '@tg/bccomponents'
import { ref, toRefs } from 'vue'

const props = defineProps({
  dateRangeValue: {
    type: String,
  },
})
const emit = defineEmits(['update:date-range-value'])
const { dateRangeValue } = toRefs(props)
const currentDate = ref(new Date())
const showCalendar = ref(false)
const startDate = ref<number | null>(null)
const endDate = ref<number | null>(null)
const selectionMode = ref<'start' | 'end'>('start')

interface OptionItem {
  label: string
  value: string
}

// 自定义日期范围选项
const dateRangeOptions = ref<OptionItem[]>([

])

const showDateRangeSelect = ref(false)

// 日历相关数据
const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// 获取月份天数数组
function getMonthDays() {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()

  // 获取当月第一天是星期几
  const firstDay = new Date(year, month, 1).getDay()

  // 获取当月总天数
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // 获取上个月总天数
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const days = []

  // 填充上个月的日期
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      current: false,
    })
  }

  // 填充当月的日期
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      current: true,
    })
  }

  // 填充下个月的日期
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      current: false,
    })
  }

  return days
}

// 选择日期
function selectDay(day: number): void {
  if (selectionMode.value === 'start') {
    startDate.value = day
    endDate.value = null
    selectionMode.value = 'end'
  }
  else {
    // 确保结束日期不早于开始日期
    if (startDate.value !== null && day < startDate.value) {
      endDate.value = startDate.value
      startDate.value = day
    }
    else {
      endDate.value = day
    }
    selectionMode.value = 'start'

    // 自动应用选择并关闭日历
    applySelectedDate()
  }
}

// 切换月份
function changeMonth(increment: number): void {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + increment)
  currentDate.value = newDate
}

// 格式化当前显示的年月
function formatYearMonth(): string {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  const day = currentDate.value.getDate()
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

// 应用选择的日期
function applySelectedDate(): void {
  // 确保两个日期都已选择
  if (startDate.value !== null && endDate.value !== null) {
    const year = currentDate.value.getFullYear()
    const month = (currentDate.value.getMonth() + 1).toString().padStart(2, '0')
    const startDay = startDate.value.toString().padStart(2, '0')
    const endDay = endDate.value.toString().padStart(2, '0')
    emit('update:date-range-value', `${year}-${month}-${startDay} 到 ${year}-${month}-${endDay}`)
    showCalendar.value = false
  }
}

// 检查日期是否被选中或在选中范围内
function isDateSelected(day: number): boolean {
  return day === startDate.value || day === endDate.value
}

// 检查日期是否在选中的范围内
function isDateInRange(day: number): boolean {
  if (startDate.value === null || endDate.value === null)
    return false
  const min = Math.min(startDate.value, endDate.value)
  const max = Math.max(startDate.value, endDate.value)
  return day > min && day < max
}

// 打开日历选择器
function openCalendar(): void {
  showCalendar.value = true
}

// 选择日期范围
function selectDateRange(option: OptionItem): void {
  emit('update:date-range-value', option.value)
  showDateRangeSelect.value = false
}
</script>

<template>
  <!-- 日期选择部分 -->

  <div class="date-range" @click="openCalendar">
    <span>{{ dateRangeValue }}</span>
    <div class="arrow-icon">
      <BaseImage width="12px" url="/img/h5/affiliate-program/arrow-down.png" />
    </div>
  </div>

  <!-- 日期范围选择器弹出层 -->
  <div v-if="showDateRangeSelect" class="select-popup-container">
    <div class="popup-mask" @click.stop="showDateRangeSelect = false" />
    <div class="select-popup date-range-popup animated">
      <div class="popup-content">
        <div class="close-area">
          <div class="popup-handle" />
          <div class="close-btn" @click="showDateRangeSelect = false">
            <span class="close-icon">×</span>
          </div>
        </div>
        <div class="popup-inner">
          <div
            v-for="option in dateRangeOptions"
            :key="option.value"
            class="select-option"
            :class="{ active: option.value === dateRangeValue }"
            @click="selectDateRange(option)"
          >
            {{ option.label }}
            <div class="circle-container">
              <div v-if="option.value === dateRangeValue" class="select-indicator" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 日期选择器日历弹出层 -->
  <div v-if="showCalendar" class="select-popup-container">
    <div class="popup-mask" @click.stop="showCalendar = false" />
    <div class="select-popup calendar-popup animated">
      <div class="popup-content">
        <div class="calendar-header">
          <div class="close-btn" @click="showCalendar = false">
            <span class="close-icon">×</span>
          </div>
          <div class="calendar-title">
            选择日期
          </div>
        </div>

        <div class="calendar-navigation">
          <div class="nav-button" @click="changeMonth(-1)">
            <BaseImage width="8px" height="13px" url="/img/h5/affiliate-program/arrow-left.png" />
          </div>
          <div class="current-month">
            {{ formatYearMonth() }}
          </div>
          <div class="nav-button" @click="changeMonth(1)">
            <BaseImage width="8px" height="13px" url="/img/h5/affiliate-program/arrow-right.png" />
          </div>
        </div>

        <div class="calendar-content">
          <div class="weekdays">
            <div v-for="day in weekdays" :key="day" class="weekday">
              {{ day }}
            </div>
          </div>

          <div class="days-grid">
            <div
              v-for="(dayObj, index) in getMonthDays()"
              :key="index"
              class="day-cell"
              :class="{
                'current-month': dayObj.current,
                'other-month': !dayObj.current,
                'selected': dayObj.current && isDateSelected(dayObj.day),
                'in-range': dayObj.current && isDateInRange(dayObj.day),
              }"
              @click="dayObj.current && selectDay(dayObj.day)"
            >
              {{ dayObj.day }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.my-data-container {
  background-color: #1a1d1e;
  color: white;
  min-height: 100vh;
  padding: 0;
  overflow-y: scroll;
  position: relative;
}

.date-select,
.date-range {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #232626;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;

  .icon-arrow-down {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-left: 5px;
  }
}

.date-select {
  width: 100px;
  flex: 0 0 auto;
}

.date-range {
  flex: 1;
}

// 弹出动画
.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

// 弹出选择器容器
.select-popup-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;

  .popup-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
}

// 弹出选择器样式
.select-popup {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 101;

  &.animated {
    animation: slideUp 0.3s ease-out forwards;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .popup-content {
    background-color: #232626;
    border-radius: 12px 12px 0 0;
    position: relative;

    .close-area {
      display: flex;
      justify-content: end;
      padding: 16px;
      position: relative;

      .popup-handle {
        width: 36px;
        height: 4px;
        background-color: #5d6163;
        border-radius: 2px;
      }

      .close-btn {
        width: 28px;
        height: 28px;
        background: #4a5354;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        margin-bottom: 10px;

        .close-icon {
          font-size: 14px;
          flex-wrap: 700;
          color: #fff;
        }
      }
    }
  }

  .popup-inner {
    max-height: 40vh;
    overflow-y: scroll;
    padding: 0 0 20px;
  }

  .select-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    font-size: 16px;
    position: relative;

    &.active {
      color: white;
      font-weight: 500;
      background-color: #323738;
    }

    .circle-container {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border: 1px solid #e4eaf030;
        border-radius: 50%;
      }
    }

    .select-indicator {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #24ee89;
      position: absolute;
      &::before {
        content: '';
        position: absolute;
        width: 10px;
        height: 10px;
        background: #323738;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
      }
    }
  }
}

.commission-section {
  margin: 0 16px;
  padding: 16px;
  background-color: #323738;
  border-radius: 8px;
  margin-bottom: 16px;

  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 600;

    .icon {
      margin-right: 8px;
    }
  }

  .commission-cards {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;

    .commission-card {
      flex: 1;
      background-color: #3a4142;
      border-radius: 8px;
      padding: 8px;
    }
  }

  .total-commission {
    background-color: #3a4142;
    border-radius: 8px;
    padding: 8px;
  }

  .card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;

    span {
      margin-left: 5px;
      font-size: 10px;
      font-weight: 600;
      color: #b3bec1;
    }
  }

  .amount {
    display: flex;
    align-items: center;
    justify-content: center;

    .value {
      font-size: 12px;
      font-weight: 700;
      color: #24ee89;
      margin-right: 5px;
    }
  }
}

.data-section {
  margin: 0 16px;
  padding: 16px;
  background-color: #292d2e;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid var(---border-black-23A4142, #3a4142);

  .data-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;

    .label {
      color: #b3bec1;
      font-size: 10px;
    }

    .value {
      color: white;
      font-weight: 500;
      font-size: 12px;
    }

    .value-with-icon {
      display: flex;
      align-items: center;

      .value {
        color: #24ee89;
        margin: 0 5px;
      }

      .unit {
        color: white;
        font-size: 12px;
      }
    }
  }
}

// 日历选择器样式
.calendar-popup {
  .popup-content {
    background-color: #232626;
    padding-bottom: 20px;
    border-radius: 12px 12px 0 0;
  }

  .calendar-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    position: relative;
    margin-bottom: 20px;

    .close-btn {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      width: 28px;
      height: 28px;
      background: #4a5354;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;

      .close-icon {
        font-size: 14px;
        font-weight: 700;
        color: #fff;
      }
    }

    .calendar-title {
      font-size: 16px;
      font-weight: 500;
      color: #fff;
    }
  }

  .selection-status {
    padding: 0 16px 16px;
    text-align: center;

    .status-label {
      font-size: 14px;
      color: #b3bec1;
      margin-bottom: 8px;
    }

    .selected-range {
      font-size: 14px;
      color: #24ee89;
      background-color: #292d2e;
      padding: 8px 12px;
      border-radius: 6px;
      display: inline-block;
    }
  }

  .calendar-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px 16px;

    .nav-button {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .nav-icon {
        color: #fff;
        font-weight: 700;
      }
    }

    .current-month {
      font-size: 12px;
      color: #fff;
    }
  }

  .calendar-content {
    padding: 0 16px;

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      margin-bottom: 10px;

      .weekday {
        color: #b3bec1;
        font-size: 14px;
        padding: 8px 0;
      }
    }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;

      .day-cell {
        height: 40px;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6.98px;
        font-size: 14px;
        cursor: pointer;
        margin: 0 auto;

        &.current-month {
          color: #fff;
        }

        &.other-month {
          color: #5d6163;
        }

        &.selected {
          background-color: #24ee89;
          color: #1e2121;
          border-radius: 6.98px;
          font-weight: 500;
        }

        &.in-range {
          background-color: #24ee8933;
          color: #ffffff;
          border-radius: 0;
          border-radius: 6.98px;
        }

        // 第一个选中的日期（左边）
        &.selected:first-of-type:not(:last-of-type),
        &.selected:first-child {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        // 最后一个选中的日期（右边）
        &.selected:last-of-type:not(:first-of-type),
        &.selected:last-child {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }
  }
}
.arrow-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3a4142;
  border-radius: 4px;
}
</style>
