<script setup lang="ts">
import { BaseCurrencyIcon, BaseImage } from '@tg/bccomponents'
import { ref } from 'vue'
import AppDatePicker from '../../components/AppDatePicker.vue'

const selectedPeriod = ref('今天')
const dateRange = ref('2024-12-18 到 2024-12-25')
const selectedType = ref('全部类型')
const currentPage = ref(1)
const totalPages = ref(20)

// 控制显示选择器
const showPeriodSelect = ref(false)
const showTypeSelect = ref(false)

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

// 类型选项
const typeOptions = ref<OptionItem[]>([
  { label: '全部类型', value: '全部类型' },
  { label: '佣金转出', value: '佣金转出' },
  { label: '代理返佣', value: '代理返佣' },
])

// 选择时间周期
function selectPeriod(option: OptionItem): void {
  selectedPeriod.value = option.value
  showPeriodSelect.value = false
}

// 选择类型
function selectType(option: OptionItem): void {
  selectedType.value = option.value
  showTypeSelect.value = false
}

// 佣金记录数据
const recordList = ref([
  {
    type: '佣金转出',
    time: '04/18 12:00:24',
    amount: 978000,
  },
  {
    type: '佣金转出',
    time: '04/18 12:00:24',
    amount: 978000,
  },
  {
    type: '代理返佣',
    time: '04/18 12:00:24',
    amount: 978000,
  },
  {
    type: '佣金转出',
    time: '04/18 12:00:24',
    amount: 978000,
  },
  {
    type: '代理返佣',
    time: '04/18 12:00:24',
    amount: 978000,
  },
])

// 切换页码
function changePage(direction: 'prev' | 'next') {
  if (direction === 'prev' && currentPage.value > 1) {
    currentPage.value--
  }
  else if (direction === 'next' && currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>

<template>
  <div class="commission-record-container">
    <!-- 筛选器部分 -->
    <div class="filter-section">
      <!-- 日期筛选器 -->
      <div class="date-filters">
        <div class="date-select" @click="showPeriodSelect = true">
          <span>{{ selectedPeriod }}</span>
          <div class="arrow-icon">
            <BaseImage width="12px" url="/img/h5/affiliate-program/arrow-down.png" />
          </div>
        </div>
        <AppDatePicker v-model:date-range-value="dateRange" />
      </div>

      <!-- 类型筛选器 -->
      <div class="type-filter">
        <div class="type-select" @click="showTypeSelect = true">
          <span>{{ selectedType }}</span>
          <div class="arrow-icon">
            <BaseImage width="12px" url="/img/h5/affiliate-program/arrow-down.png" />
          </div>
        </div>
      </div>
    </div>

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

    <!-- 类型选择器弹出层 -->
    <div v-if="showTypeSelect" class="select-popup-container">
      <div class="popup-mask" @click.stop="showTypeSelect = false" />
      <div class="select-popup type-popup animated">
        <div class="popup-content">
          <div class="close-area">
            <div class="close-btn" @click="showTypeSelect = false">
              <span class="close-icon">×</span>
            </div>
          </div>
          <div class="popup-inner">
            <div
              v-for="option in typeOptions"
              :key="option.value"
              class="select-option"
              :class="{ active: option.value === selectedType }"
              @click="selectType(option)"
            >
              {{ option.label }}
              <div class="circle-container">
                <div v-if="option.value === selectedType" class="select-indicator" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 记录列表 -->
    <div class="record-list">
      <div
        v-for="(record, index) in recordList"
        :key="index"
        class="record-item"
      >
        <div class="record-row">
          <div class="record-label">
            类型
          </div>
          <div class="record-value" :class="{ 'type-commission': record.type === '佣金转出', 'type-agent': record.type === '代理返佣' }">
            {{ record.type }}
          </div>
        </div>
        <div class="record-row">
          <div class="record-label">
            时间
          </div>
          <div class="record-value time-value">
            {{ record.time }}
          </div>
        </div>
        <div class="record-row">
          <div class="record-label">
            金额
          </div>
          <div class="record-value amount-value">
            <BaseCurrencyIcon cur="USDT" />
            <span>{{ record.amount.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页控制 -->
    <div class="pagination">
      <button
        class="page-button prev"
        :disabled="currentPage === 1"
        @click="changePage('prev')"
      >
        &lt;
      </button>
      <div class="page-info">
        <span class="current-page">{{ currentPage.toString().padStart(2, '0') }}</span>
        <span class="page-divider">的</span>
        <span class="total-pages">{{ totalPages }}</span>
      </div>
      <button
        class="page-button next"
        :disabled="currentPage === totalPages"
        @click="changePage('next')"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.commission-record-container {
  background-color: #1a1d1e;
  color: white;
  min-height: 100vh;
  padding-bottom: 20px;
  overflow-y: scroll;
}

.filter-section {
  padding: 16px;

  .date-filters {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  .date-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #232626;
    border-radius: 8px;
    padding: 10px 15px;
    width: 100px;
    font-size: 14px;

    .icon-arrow-down {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-style: solid;
      border-width: 0 2px 2px 0;
      padding: 2px;
      transform: rotate(45deg);
    }
  }

  .date-range {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #232626;
    border-radius: 8px;
    padding: 10px 15px;
    font-size: 14px;
  }

  .type-filter {
    .type-select {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #232626;
      border-radius: 8px;
      padding: 10px 15px;
      font-size: 14px;
    }
  }
}

.record-list {
  margin: 0 16px;

  .record-item {
    background-color: #292d2e;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 8px;
    border: 1px solid var(---border-black-23A4142, #3a4142);

    .record-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px 0;

      .record-label {
        font-size: 10px;
        color: #b3bec1;
      }

      .record-value {
        font-size: 10px;

        &.type-commission {
          color: #ffe175;
        }

        &.type-agent {
          color: #5ac8fa;
        }

        &.time-value {
          color: white;
        }

        &.amount-value {
          display: flex;
          font-size: 12px;
          align-items: center;
          color: #24ee89;

          span {
            margin-left: 4px;
            font-weight: 500;
          }
        }
      }
    }
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  .page-button {
    width: 32px;
    height: 38px;
    border-radius: 4px;
    background-color: #292d2e;
    border: none;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .page-info {
    display: flex;
    align-items: center;
    margin: 0 4px;
    background-color: #292d2e;
    border-radius: 4px;
    padding: 4px;

    .current-page {
      color: white;
      font-weight: 500;
      background: #3a4142;
      padding: 5px 12px;
      border-radius: 5.23px;
    }

    .page-divider {
      margin: 0 6px;
      color: #666;
    }

    .total-pages {
      color: white;
      padding: 5px 12px;
    }
  }
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
    background-color: #1e2122;
    border-radius: 12px 12px 0 0;
    position: relative;

    .close-area {
      display: flex;
      justify-content: end;
      padding: 16px;
      position: relative;

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
          font-weight: 700;
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
