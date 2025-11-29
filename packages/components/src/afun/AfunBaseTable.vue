<script setup lang="ts">
import type { Column, CurrencyCode } from '@tg/types'
import type { Ref } from 'vue'
import { IconTaskTip, IconUniTableSort } from '@tg/icons'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AfunBaseEmpty from '../afun/AfunBaseEmpty.vue'
import AfunBaseLoading from '../afun/AfunBaseLoading.vue'
import BaseImage from '../BaseImage.vue'
import BaseSkeleton from '../bc-game/BaseSkeleton.vue'

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
    ? `${item.width}px`
    : item.width
  const temp: any = {
    'width': item.isThLineClamp2 ? 'auto' : width,
    'text-align': item.align,
    'min-width': item.isThLineClamp2 ? width : 'auto',
  }
  if (item.thPaddingX) {
    temp.paddingLeft = typeof item.thPaddingX === 'number' ? `${item.thPaddingX}px` : item.thPaddingX
    temp.paddingRight = typeof item.thPaddingX === 'number' ? `${item.thPaddingX}px` : item.thPaddingX
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
  return randomWidth < colHeadWidth ? `${randomWidth}px` : `${colHeadWidth}px`
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
      <div v-show="showOutLoad && loading" class="w-full h-[200px] flex items-center justify-center">
        <AfunBaseLoading />
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
                    <IconTaskTip style="margin-right: 3px;" />
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
                    v-if="col.isRound === 'left'" height="14px" width="14px" style="--afun-skeleton-border-radius:50%;
                  margin-right: 8px;" animated="ani-opacity"
                  />
                  <BaseSkeleton
                    height="14px" style="--afun-skeleton-border-radius: 3px"
                    :width="col.skeWidth ? col.skeWidth : getWidth(col.title)" animated="ani-opacity"
                  />
                  <BaseSkeleton
                    v-if="col.isRound === 'right'" height="14px" width="14px" style="--afun-skeleton-border-radius:50%;
                  margin-left: 8px;" animated="ani-opacity"
                  />
                </div>
              </template>
              <template v-else>
                <slot v-if="col.slot" v-bind="{ record: data, index, isAmountPopper }" :name="col.slot" :index="index">
                  {{ data[col.dataIndex] || '-' }}
                </slot>

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
                    v-if="col.isRound === 'left'" height="14px" width="14px" style="--afun-skeleton-border-radius:50%;
                  margin-right: 8px;" animated="ani-opacity"
                  />
                  <BaseSkeleton
                    height="14px" style="--afun-skeleton-border-radius: 3px"
                    :width="col.skeWidth ? col.skeWidth : getWidth(col.title)" animated="ani-opacity"
                  />
                  <BaseSkeleton
                    v-if="col.isRound === 'right'" height="14px" width="14px" style="--afun-skeleton-border-radius:50%;
                  margin-left: 8px;" animated="ani-opacity"
                  />
                </div>
              </template>
              <template v-else>
                <slot :name="col.sumSlot" v-bind="{ sums, index, record: col as any }" />
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showEmpty && !loading && !dataSource?.length">
      <slot name="empty">
        <AfunBaseEmpty :description="t('暂无数据')">
          <template #icon>
            <BaseImage class="w-[80px]" url="/m/afun-h5/png/uni-table-empty.png" />
          </template>
        </AfunBaseEmpty>
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --afun-table-th-font-size: 14px;
  --afun-table-th-color: #fff;
  --afun-table-th-font-weight: 600;
  --afun-table-th-background: transparent;
  --afun-table-th-padding-x: 16px;
  --afun-table-th-padding-bottom: 0;
  --afun-table-th-white-space: nowrap;
  --afun-table-th-word-wrap: normal;
  --afun-table-th-height: 55px;
  --afun-table-th-line-height: 20px;

  --afun-table-td-font-size: 14px;
  --afun-table-td-color: #b1bad3;
  --afun-table-td-font-weight: 600;
  --afun-table-td-padding-x: 16px;
  --afun-table-even-background: transparent;
  --afun-table-odd-background: #213743;
  --afun-table-td-height: 55px;
  --afun-table-td-line-height: 20px;

  --afun-table-layout: auto;
  --afun-table-margin-top-empty: 24px;
  --afun-table-line-height: 20px;
  --afun-table-thtd-radius: 6px;
  --afun-table-tr-last-first-padding: 16px;
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
  --afun-skeleton-background-color: #aeb8d6;

  .m-table {
    display: table;
    table-layout: var(--afun-table-layout);
    width: 100%;
    text-align: left;
    border-collapse: separate;
    border-spacing: 0;
    margin: 0;

    .m-th {
      font-size: var(--afun-table-th-font-size);
      height: var(--afun-table-th-height);
      word-wrap: var(--afun-table-th-word-wrap);
      padding: 0 var(--afun-table-th-padding-x) var(--afun-table-th-padding-bottom);
      color: var(--afun-table-th-color);
      font-weight: var(--afun-table-th-font-weight);
      text-align: left;
      border: none;
      line-height: var(--afun-table-th-line-height);
      white-space: var(--afun-table-th-white-space);
      background: var(--afun-table-th-background);
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
          margin-left: 4px;
        }

        .th-sort {
          display: flex;
          flex-direction: column;
          font-size: 6px;
        }
      }
    }

    .m-body {
      position: relative;

      .m-tr:nth-child(odd) {
        background: var(--afun-table-odd-background);
      }

      .m-tr:nth-child(even) {
        background: var(--afun-table-even-background);
      }
    }

    .m-tr {
      border: none;

      .m-td {
        height: var(--afun-table-td-height);
        padding: 0 var(--afun-table-td-padding-x);
        line-height: var(--afun-table-td-line-height);
        font-weight: var(--afun-table-td-font-weight);
        font-size: var(--afun-table-td-font-size);
        color: var(--afun-table-td-color);
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
      border-top-right-radius: var(--afun-table-thtd-radius);
      border-bottom-right-radius: var(--afun-table-thtd-radius);
    }

    th:first-child,
    td:first-child {
      border-top-left-radius: var(--afun-table-thtd-radius);
      border-bottom-left-radius: var(--afun-table-thtd-radius);
    }
  }

  .last-first-padding {
    .m-tr {
      th:last-child,
      td:last-child {
        padding-right: var(--afun-table-tr-last-first-padding);
      }

      th:first-child,
      td:first-child {
        padding-left: var(--afun-table-tr-last-first-padding);
      }
    }
  }
}
</style>
