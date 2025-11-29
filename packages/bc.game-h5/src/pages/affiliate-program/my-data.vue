<script setup lang="ts">
import { BaseCurrencyIcon, BaseImage } from '@tg/bccomponents'
import { ref } from 'vue'
import AppDatePicker from '../../components/AppDatePicker.vue'

const dateRange = ref('2024-12-18 到 2024-12-25')
const selectedPeriod = ref('今天')

interface OptionItem {
  label: string
  value: string
}
// 时间周期选项
const periodOptions = ref<OptionItem[]>([
  { label: '今天', value: '今天' },
  { label: '昨天', value: '昨天' },
  { label: '本周', value: '本周' },
  { label: '上周', value: '上周' },
  { label: '本月', value: '本月' },
  { label: '上月', value: '上月' },
])

// 控制显示选择器
const showPeriodSelect = ref(false)
</script>

<template>
  <div class="my-data-container">
    <!-- 日期选择部分 -->
    <div class="date-filter">
      <div class="date-select" @click="showPeriodSelect = true">
        <span>{{ selectedPeriod }}</span>
        <div class="arrow-icon">
          <BaseImage width="12px" url="/img/h5/affiliate-program/arrow-down.png" />
        </div>
      </div>

      <AppDatePicker v-model:date-range-value="dateRange" />

      <!-- 时间周期选择器弹出层 -->
      <div v-if="showPeriodSelect" class="select-popup-container">
        <div class="popup-mask" @click.stop="showPeriodSelect = false" />
        <div class="select-popup period-popup animated">
          <div class="popup-content">
            <div class="close-area">
              <div class="close-btn" @click="showPeriodSelect = false">
                <span class="close-icon">×</span>
              </div>
            </div>
            <div class="popup-inner">
              <div
                v-for="option in periodOptions"
                :key="option.value"
                class="select-option"
                :class="{ active: option.value === selectedPeriod }"
                @click="selectPeriod(option)"
              >
                {{ option.label }}
                <div class="circle-container">
                  <div v-if="option.value === selectedPeriod" class="select-indicator" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 佣金数据部分 -->
    <div class="commission-section">
      <div class="section-title">
        <span class="icon">
          <BaseImage width="18px" url="/img/h5/affiliate-program/my-commission-icon.png" />
        </span>
        <span>我的佣金</span>
      </div>

      <div class="commission-cards">
        <div class="commission-card">
          <div class="card-icon">
            <BaseCurrencyIcon cur="USDT" />
            <span>直属佣金</span>
          </div>
          <div class="amount">
            <span class="value">80.00</span>
            <BaseCurrencyIcon cur="USDT" />
          </div>
        </div>

        <div class="commission-card">
          <div class="card-icon">
            <BaseCurrencyIcon cur="USDT" />
            <span>团队佣金</span>
          </div>
          <div class="amount">
            <span class="value">148.67</span>
            <BaseCurrencyIcon cur="USDT" />
          </div>
        </div>
      </div>

      <div class="total-commission">
        <div class="card-icon">
          <BaseCurrencyIcon cur="USDT" />
          <span>总佣金</span>
        </div>
        <div class="amount">
          <span class="value" style=" font-size:18px">465.23</span>
          <BaseCurrencyIcon cur="USDT" style="width: 18px; height: 18px" />
        </div>
      </div>
    </div>

    <!-- 投注数据部分 -->
    <div class="data-section">
      <div class="data-row">
        <span class="label">总投注</span>
        <div class="value-with-icon">
          <BaseCurrencyIcon cur="USDT" />
          <span class="value">8800.00</span>
          <span class="unit">/ 16人</span>
        </div>
      </div>
      <div class="data-row">
        <span class="label">直属投注</span>
        <div class="value-with-icon">
          <BaseCurrencyIcon cur="USDT" />
          <span class="value">560.00</span>
          <span class="unit">/ 6人</span>
        </div>
      </div>
      <div class="data-row">
        <span class="label">团队投注</span>
        <div class="value-with-icon">
          <BaseCurrencyIcon cur="USDT" />
          <span class="value">4554.00</span>
          <span class="unit">/ 10人</span>
        </div>
      </div>
    </div>

    <!-- 注册数据部分 -->
    <div class="data-section">
      <div class="data-row">
        <span class="label">总注册</span>
        <span class="value">88人</span>
      </div>
      <div class="data-row">
        <span class="label">直属注册</span>
        <span class="value">12人</span>
      </div>
      <div class="data-row">
        <span class="label">团队注册</span>
        <span class="value">76人</span>
      </div>
    </div>

    <!-- 首次存款数据部分 -->
    <div class="data-section">
      <div class="data-row">
        <span class="label">首次存款总额</span>
        <div class="value-with-icon">
          <BaseCurrencyIcon cur="USDT" />
          <span class="value">100.00</span>
          <span class="unit">/ 1人</span>
        </div>
      </div>
      <div class="data-row">
        <span class="label">直属首次存款</span>
        <div class="value-with-icon">
          <BaseCurrencyIcon cur="USDT" />
          <span class="value">100.00</span>
          <span class="unit">/ 1人</span>
        </div>
      </div>
      <div class="data-row">
        <span class="label">团队首次存款</span>
        <div class="value-with-icon">
          <BaseCurrencyIcon cur="USDT" />
          <span class="value">0.00</span>
          <span class="unit">/ 0人</span>
        </div>
      </div>
    </div>

    <!-- 存款总额数据部分 -->
    <div class="data-section">
      <div class="data-row">
        <span class="label">存款总额</span>
        <div class="value-with-icon">
          <BaseCurrencyIcon cur="USDT" />
          <span class="value">1000.00</span>
          <span class="unit">/ 10人</span>
        </div>
      </div>
      <div class="data-row">
        <span class="label">直属存款</span>
        <div class="value-with-icon">
          <BaseCurrencyIcon cur="USDT" />
          <span class="value">500.00</span>
          <span class="unit">/ 5人</span>
        </div>
      </div>
      <div class="data-row">
        <span class="label">团队存款</span>
        <div class="value-with-icon">
          <BaseCurrencyIcon cur="USDT" />
          <span class="value">500.00</span>
          <span class="unit">/ 5人</span>
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

.date-filter {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  gap: 12px;
  position: relative;

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
