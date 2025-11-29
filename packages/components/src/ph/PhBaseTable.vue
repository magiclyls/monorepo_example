<script setup lang="ts">
import type { Column, CurrencyCode } from '@tg/types'
import type { Ref } from 'vue'
import { IconTaskTip, IconUniTableSort } from '@tg/icons'
import { getCurrencyConfig } from '@tg/utils'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseImage from '../BaseImage.vue'
import BaseSkeleton from '../bc-game/BaseSkeleton.vue'
import PhBaseAmount from '../ph/PhBaseAmount.vue'
import PhBaseEmpty from '../ph/PhBaseEmpty.vue'
import PhBaseLoading from '../ph/PhBaseLoading.vue'

interface Props {
  /** 表格列的配置项 */
  columns: Column[]
  /** 表格数据数组 */
  dataSource?: any[]
  /** 是否显示骨架屏 */
  loading?: boolean
  /** 是否设置每行第一个和最后一个左padding，右padding */
  lastFirstPadding?: boolean
  /** 数据为空是否显示空状态 */
  showEmpty?: boolean
  /** 骨架屏行数 */
  skeletonRow?: number
  /** 骨架屏随机宽度最小值 */
  skeletonWidth?: number
  /** 骨架屏最小宽度 */
  skeletonMinWidth?: number
  /** 金额是否显示Popper */
  isAmountPopper?: boolean
  /** 显示整个loading */
  showOutLoad?: boolean
  /** 法币金额是否需要前缀 */
  /** 是否展示总计 */
  showSummary?: boolean
  /** 总计文本 */
  sumText?: string
  /** 币种id */
  currencyId?: CurrencyCode
  /** 额外提供的总计数据 */
  sumData?: any[]
  /** 隐藏thead */
  hideHeader?: boolean
}
defineOptions({
  name: 'BaseTable',
})
const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  dataSource: () => [],
  loading: false,
  showEmpty: true,
  skeletonRow: 10,
  skeletonWidth: 30,
  skeletonMinWidth: 50,
  showOutLoad: false,
  showSummary: false,
})
const emit = defineEmits(['sort', 'rowClick'])

const { t } = useI18n()

const sortSource: Ref<(string | undefined)[]> = ref(props.columns.map(item => item.sortDirections))

const thLineClamp2Style: any = {
  'width': 'auto',
  '-webkit-box-orient': 'vertical',
  '-webkit-line-clamp': 2,
  'white-space': 'normal',
  'overflow': 'hidden',
  'display': '-webkit-box',
}

function getThStyle(item: any) {
  const width = typeof item.width === 'number'
    ? `${item.width}rem`
    : item.width
  const temp: any = {
    'width': item.isThLineClamp2 ? 'auto' : width,
    'text-align': item.align,
    'min-width': item.isThLineClamp2 ? width : 'auto',
  }
  if (item.thPaddingX) {
    temp.paddingLeft = typeof item.thPaddingX === 'number' ? `${item.thPaddingX}rem` : item.thPaddingX
    temp.paddingRight = typeof item.thPaddingX === 'number' ? `${item.thPaddingX}rem` : item.thPaddingX
  }
  if (item.headerTextColor)
    temp.color = item.headerTextColor
  return temp
}

function getThBoxStyle(item: any) {
  return item.isThLineClamp2 ? thLineClamp2Style : undefined
}

const getSource = computed(() => {
  return props.loading
    ? Array.from({ length: props.skeletonRow }).fill({})
    : props.dataSource
})

// 排序变化
function handleSort(item: Column, index: number) {
  if (item.sort) {
    const str = sortSource.value[index] === 'desc' ? 'asc' : 'desc'
    sortSource.value = []
    sortSource.value[index] = str
    emit('sort', {
      col: item,
      sortDirections: str,
    })
  }
}
function getWidth(colHead?: string) {
  const len = colHead?.length ?? 0
  // 5 是综合各个语言单个字符的最小宽度
  const w = len * 5 + 12
  const colHeadWidth = len > 0 ? w : 1000
  const randomWidth = props.skeletonMinWidth + props.skeletonWidth
  return randomWidth < colHeadWidth ? `${randomWidth}rem` : `${colHeadWidth}rem`
}

const sums = computed(() => {
  if (props.sumData)
    return props.sumData
  const data = getSource.value
  const sums: string[] = []
  props.columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = t('sum_label')
      return
    }
    const values = data.map((item: any) => Number(item[column.dataIndex]))
    if (!values.every(value => Number.isNaN(value))) {
      sums[index] = `$ ${values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value))
          return prev + curr
        else
          return prev
      }, 0)}`
    }
    else {
      sums[index] = 'N/A'
    }
  })

  return sums
})

watch(() => props.columns, () => {
  sortSource.value = props.columns.map(item => item.sortDirections)
})
</script>

<template>
  <div class="w-full" style="display:block !important;">
    <div class="overflow-x-scroll scrollable m-table-wrap hide-scroll-bar">
      <div v-show="showOutLoad && loading" class="w-full h-[200rem] flex items-center justify-center">
        <PhBaseLoading />
      </div>
      <table
        v-show="showOutLoad ? loading === false : true" class="m-table"
        :class="[lastFirstPadding ? 'last-first-padding' : '']"
      >
        <thead v-if="!hideHeader">
          <tr class="m-tr">
            <th v-for="(item, index) in columns" :key="index" class="m-th" :style="getThStyle(item)">
              <div
                class="th-box" :class="item.sort ? 'cursor-pointer' : ''" :style="getThBoxStyle(item)"
                @click="handleSort(item, index)"
              >
                <VTooltip v-if="item.isTips" placement="top" :triggers="['click', 'hover']">
                  <div class="center stealth-box">
                    <IconTaskTip style="margin-right: 3rem;" />
                  </div>
                  <template #popper>
                    <div class="tiny-menu-item-title">
                      {{ t('您下注使用的所有货币会标准化为竞赛货币') }}
                    </div>
                  </template>
                </VTooltip>
                <template v-if="item.headerSlot">
                  <slot :name="`${item.headerSlot}`" />
                </template>
                <template v-else>
                  <span>{{ item.title }}</span>
                  <slot :name="`th-${item.slot}`" />
                </template>

                <div v-if="item.sort" class="th-sort">
                  <IconUniTableSort
                    :style="`${sortSource[index]
                      === 'asc' ? 'color: #fff' : ''}`"
                  />
                  <IconUniTableSort
                    :style="`transform: rotate(180deg);
                  ${sortSource[index] === 'desc' ? 'color: #fff' : ''}`"
                  />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="m-body">
          <tr
            v-for="(data, index) in getSource" :key="index" class="m-tr cursor-pointer"
            @click="$emit('rowClick', data)"
          >
            <td
              v-for="(col, n) in columns" :key="n" class="m-td"
              :class="{ 'td-loading': loading, 'overflow-visible': col.visible }" :title="data[col.dataIndex]" :style="{
                'text-align': col.align,
              }"
            >
              <template v-if="loading">
                <div class="td-skeleton" :class="[col.align]">
                  <BaseSkeleton
                    v-if="col.isRound === 'left'" height="14px" width="14px" style="--tg-skeleton-border-radius:50%;
                  margin-right: 8rem;" animated="ani-opacity"
                  />
                  <BaseSkeleton
                    height="14px" style="--tg-skeleton-border-radius: 3px"
                    :width="col.skeWidth ? col.skeWidth : getWidth(col.title)" animated="ani-opacity"
                  />
                  <BaseSkeleton
                    v-if="col.isRound === 'right'" height="14px" width="14px" style="--tg-skeleton-border-radius:50%;
                  margin-left: 8rem;" animated="ani-opacity"
                  />
                </div>
              </template>
              <template v-else>
                <slot v-if="col.slot" v-bind="{ record: data, index, isAmountPopper }" :name="col.slot" :index="index">
                  {{ data[col.dataIndex] || '-' }}
                </slot>
                <PhBaseAmount
                  v-else-if="col.isAmount" popper-clazz="deep-tooltip" style="display: inline-block;"
                  :is-popper="isAmountPopper" :show-color="col.showColor" :amount="data[col.dataIndex]"
                  :currency-type="getCurrencyConfig(data.currency_id)?.name ?? 'USDT'"
                />
                <span v-else>{{ data[col.dataIndex] || '-' }}</span>
              </template>
            </td>
          </tr>
          <tr v-if="showSummary && dataSource && dataSource.length" class="m-tr">
            <td
              v-for="(col, index) in columns" :key="index" class="m-td"
              :class="{ 'td-loading': loading, 'overflow-visible': col.visible }" :style="`text-align:${col.align}`"
            >
              <template v-if="loading">
                <div class="td-skeleton" :class="[col.align]">
                  <BaseSkeleton
                    v-if="col.isRound === 'left'" height="14px" width="14px" style="--tg-skeleton-border-radius:50%;
                  margin-right: 8rem;" animated="ani-opacity"
                  />
                  <BaseSkeleton
                    height="14px" style="--tg-skeleton-border-radius: 3px"
                    :width="col.skeWidth ? col.skeWidth : getWidth(col.title)" animated="ani-opacity"
                  />
                  <BaseSkeleton
                    v-if="col.isRound === 'right'" height="14px" width="14px" style="--tg-skeleton-border-radius:50%;
                  margin-left: 8rem;" animated="ani-opacity"
                  />
                </div>
              </template>
              <template v-else>
                <slot :name="col.sumSlot" v-bind="{ sums, index, record: col as any }">
                  <PhBaseAmount
                    v-if="col.isAmount" style="display: inline-block;" :is-popper="isAmountPopper"
                    :show-color="col.showColor" :amount="sums[index]"
                    :currency-type="currencyId ? getCurrencyConfig(currencyId)?.name : 'USDT'"
                  />
                  <span v-else>{{ sums[index] || '-' }}</span>
                </slot>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showEmpty && !loading && !dataSource?.length">
      <slot name="empty">
        <PhBaseEmpty :description="t('暂无数据')">
          <template #icon>
            <BaseImage url="/ph-h5/png/uni-table-empty.png" />
          </template>
        </PhBaseEmpty>
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --tg-table-th-font-size: 14rem;
  --tg-table-th-color: #6d7693;
  --tg-table-th-font-weight: 600;
  --tg-table-th-background: transparent;
  --tg-table-th-padding-x: 16rem;
  --tg-table-th-padding-bottom: 0;
  --tg-table-th-white-space: nowrap;
  --tg-table-th-word-wrap: normal;
  --tg-table-th-height: 55rem;
  --tg-table-th-line-height: 20rem;

  --tg-table-td-font-size: 14rem;
  --tg-table-td-color: #6d7693;
  --tg-table-td-font-weight: 600;
  --tg-table-td-padding-x: 16rem;
  --tg-table-even-background: transparent;
  --tg-table-odd-background: #fff;
  --tg-table-td-height: 55rem;
  --tg-table-td-line-height: 20rem;

  --tg-table-layout: auto;
  --tg-table-margin-top-empty: 24rem;
  --tg-table-line-height: 20rem;
  --tg-table-thtd-radius: 6rem;
  --tg-table-tr-last-first-padding: 16rem;
}
</style>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 80ms linear;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.td-skeleton {
  display: flex;

  &.right {
    justify-content: flex-end;
  }

  &.left {
    justify-content: flex-start;
  }

  &.center {
    justify-content: center;
  }
}

.m-table-wrap {
  width: 100%;
  --tg-skeleton-background-color: #aeb8d6;

  .m-table {
    display: table;
    table-layout: var(--tg-table-layout);
    width: 100%;
    text-align: left;
    border-collapse: separate;
    border-spacing: 0;
    margin: 0;

    .m-th {
      font-size: var(--tg-table-th-font-size);
      height: var(--tg-table-th-height);
      word-wrap: var(--tg-table-th-word-wrap);
      padding: 0 var(--tg-table-th-padding-x) var(--tg-table-th-padding-bottom);
      color: var(--tg-table-th-color);
      font-weight: var(--tg-table-th-font-weight);
      text-align: left;
      border: none;
      line-height: var(--tg-table-th-line-height);
      white-space: var(--tg-table-th-white-space);
      background: var(--tg-table-th-background);
      vertical-align: middle;

      .stealth-box {
        cursor: help;
      }

      .th-box {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: bottom;

        > *:not(:first-child) {
          margin-left: 4rem;
        }

        .th-sort {
          display: flex;
          flex-direction: column;
          font-size: 6rem;
        }
      }
    }

    .m-body {
      position: relative;

      .m-tr:nth-child(odd) {
        background: var(--tg-table-odd-background);
      }

      .m-tr:nth-child(even) {
        background: var(--tg-table-even-background);
      }
    }

    .m-tr {
      border: none;

      .m-td {
        height: var(--tg-table-td-height);
        padding: 0 var(--tg-table-td-padding-x);
        line-height: var(--tg-table-td-line-height);
        font-weight: var(--tg-table-td-font-weight);
        font-size: var(--tg-table-td-font-size);
        color: var(--tg-table-td-color);
        border: none;
        overflow: hidden;
        white-space: nowrap;
        vertical-align: middle;

        &.overflow-visible {
          overflow: visible;
        }
      }
    }

    th:last-child,
    td:last-child {
      border-top-right-radius: var(--tg-table-thtd-radius);
      border-bottom-right-radius: var(--tg-table-thtd-radius);
    }

    th:first-child,
    td:first-child {
      border-top-left-radius: var(--tg-table-thtd-radius);
      border-bottom-left-radius: var(--tg-table-thtd-radius);
    }
  }

  .last-first-padding {
    .m-tr {
      th:last-child,
      td:last-child {
        padding-right: var(--tg-table-tr-last-first-padding);
      }

      th:first-child,
      td:first-child {
        padding-left: var(--tg-table-tr-last-first-padding);
      }
    }
  }
}
</style>
