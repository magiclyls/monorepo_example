<script lang="ts" setup>
import { computed } from 'vue'
import BaseEmpty from './BaseEmpty.vue'
import BaseLoading from './BaseLoading.vue'
import BaseSkeleton from './BaseSkeleton.vue'

interface Column {
  title: string
  dataIndex: string
  align?: string
  width?: number | string
  isThLineClamp2?: boolean
  thPaddingX?: number | string
  headerTextColor?: string
  headerSlot?: string
  slot?: string
  isAmount?: boolean
  showColor?: boolean
  skeWidth?: number | string
  isRound?: 'left' | 'right'
  visible?: boolean
}

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
  /** 外部loading的高度 */
  outLoadHeight?: number
  /** 法币金额是否需要前缀 */
  /** 是否展示总计 */
  showSummary?: boolean
  /** 总计文本 */
  sumText?: string
  /** 币种id */
  currencyId?: '701' | '702' | '703' | '704' | '705' | '706' | '707' | '708' | '709' | '710' | '711' | '712' | '713' | '714' | '715' | '716' | '717' | '718' | '719' | '720' | '721' | '722' | '723' | '724' | '725' | '726' | '727' | '728' | '729' | '730' | '731' | '732'
  /** 额外提供的总计数据 */
  sumData?: any[]
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

const thLineClamp2Style: any = {
  'width': 'auto',
  '-webkit-box-orient': 'vertical',
  '-webkit-line-clamp': 2,
  'white-space': 'normal',
  'overflow': 'hidden',
  'display': '-webkit-box',
}

function isMobile() {
  return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)
    || window.matchMedia('(max-width: 768px)').matches
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

function getWidth(colHead?: string) {
  const len = colHead?.length ?? 0
  // 5 是综合各个语言单个字符的最小宽度
  const w = isMobile() ? (len * 5 + 12) : (len * 12)
  const colHeadWidth = len > 0 ? w : 1000
  const randomWidth = props.skeletonMinWidth + props.skeletonWidth
  return randomWidth < colHeadWidth ? `${randomWidth}px` : `${colHeadWidth}px`
}
</script>

<template>
  <div
    class="scroll-x scrollable m-table-wrap rounded-lg justify-center items-center inline-flex"
  >
    <div v-show="showOutLoad && loading">
      <BaseLoading mode="black" />
    </div>
    <table
      v-show="showOutLoad ? loading === false : true" class="m-table"
      :class="[lastFirstPadding ? 'last-first-padding' : '']"
    >
      <thead>
        <tr class="m-tr">
          <th
            v-for="(item, index) in columns" :key="index" class="m-th" :style="getThStyle(item)"
          >
            <div class="th-box" :style="getThBoxStyle(item)">
              <template v-if="item.headerSlot">
                <slot :name="`${item.headerSlot}`" />
              </template>
              <template v-else>
                <span>{{ item.title }}</span>
                <slot :name="`th-${item.slot}`" />
              </template>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="m-body">
        <tr v-if="showEmpty" v-show="(!loading) && (!dataSource?.length)" class="m-tr-empty">
          <td class="m-td-empty" :colspan="columns.length">
            <BaseEmpty />
          </td>
        </tr>
        <tr v-for="(data, index) in getSource" :key="index" class="m-tr cursor-pointer ellipsis">
          <td
            v-for="(col, n) in columns" :key="n" class="m-td"
            :class="{ 'td-loading': loading, 'td-mobile': isMobile(), 'overflow-visible': col.visible }" :title="data[col.dataIndex]"
            :style="`text-align:${col.align}`"
          >
            <template v-if="loading">
              <div class="td-skeleton" :class="[col.align]">
                <BaseSkeleton
                  v-if="col.isRound === 'left'" height="14px" width="14px" style="--tg-skeleton-border-radius:50%;
                  margin-right: 8rem;" animated="ani-opacity"
                />
                <BaseSkeleton
                  height="14px" style="--tg-skeleton-border-radius: 3px"
                  :width="col.skeWidth ? String(col.skeWidth) : getWidth(col.title)" animated="ani-opacity"
                />
                <BaseSkeleton
                  v-if="col.isRound === 'right'" height="14px" width="14px" style="--tg-skeleton-border-radius:50%;
                  margin-left: 8rem;" animated="ani-opacity"
                />
              </div>
            </template>
            <template v-else>
              <slot
                v-if="col.slot"
                v-bind="{ record: data, index, isAmountPopper }"
                :name="col.slot"
                :index="index"
              >
                {{ data[col.dataIndex] || '-' }}
              </slot>
              <span v-else>{{ data[col.dataIndex] || '-' }}</span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">
:root {
  --tg-table-even-background: #3a4142;
  --tg-table-odd-background: #323738;
  --tg-table-th-background: #323738;
  --tg-table-th-color: #b3bec1;
  --tg-table-line-height: 1.5;
  --tg-table-th-padding-x: 1rem;
  --tg-table-th-padding-y: 0.75rem;
  --tg-table-td-padding-x: 1rem;
  --tg-table-td-padding-y: 0.75rem;
  --tg-table-th-font-weight: 700;
  --tg-table-td-font-weight: 700;
  --tg-table-tr-last-first-padding: 1rem;
  --tg-table-thtd-radius: 4rem;
  --tg-table-layout: auto;
  --tg-table-th-white-space: nowrap;
  --tg-table-th-word-wrap: normal;
  --tg-table-th-height: 2.75rem;
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
  color: #b1bad3;
  font-size: 0.875rem;
  .m-table {
    display: table;
    table-layout: var(--tg-table-layout);
    width: 100%;
    text-align: left;
    border-collapse: separate;
    border-spacing: 0;
    margin: 0;
    .m-th {
      height: var(--tg-table-th-height);
      word-wrap: var(--tg-table-th-word-wrap);
      padding: var(--tg-table-th-padding-x) var(--tg-table-th-padding-y);
      color: var(--tg-table-th-color);
      font-weight: var(--tg-table-th-font-weight);
      text-align: left;
      border: none;
      line-height: var(--tg-table-line-height);
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
          font-size: 6px;
        }
      }
    }

    .m-body {
      position: relative;
      .m-td-empty {
        background: var(--tg-table-even-background);
      }
      .tg-mt-mobile {
        margin-top: 24.6vh;
      }
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
        height: var(--tg-table-th-height);
        padding: var(--tg-table-td-padding-x) var(--tg-table-td-padding-y);
        line-height: var(--tg-table-line-height);
        font-weight: var(--tg-table-td-font-weight);
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
