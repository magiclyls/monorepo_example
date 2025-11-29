<script setup lang="ts">
import type { CurrencyCode } from '~/composables/useCurrencyData'
import { IconUniTips, IconUniTableSort, IconEmpty1 } from '@tg/icons';

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
  currencyId?: CurrencyCode
  /** 额外提供的总计数据 */
  sumData?: any[]
  /** 内部loading是否全屏 */
  loadingFullScreen?: boolean
  /**显示表头 */
  showHeader?: boolean
  emptyHeight?: string
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
  showHeader: true
})
const emit = defineEmits(['sort', 'rowClick'])

const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())

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
  const w = isMobile.value ? (len * 5 + 12) : (len * 12)
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
    <div class="scroll-x scrollable m-table-wrap">
      <div v-show="showOutLoad && loading">
        <AppLoading :height="outLoadHeight" :full-screen="loadingFullScreen" />
      </div>
      <table v-show="showOutLoad ? loading === false : true" class="m-table"
        :class="[lastFirstPadding ? 'last-first-padding' : '']">
        <thead v-if="props.showHeader">
          <tr class="m-tr">
            <th v-for="(item, index) in columns" :key="index" class="m-th" :style="getThStyle(item)">
              <div class="th-box" :class="item.sort ? 'cursor-pointer' : ''" :style="getThBoxStyle(item)"
                @click="handleSort(item, index)">
                <VTooltip v-if="item.isTips" placement="top" :triggers="['click', 'hover']">
                  <div class="center stealth-box">
                    <IconUniTips name="uni-tips" class="uni-tips" style="  margin-right: var(--tg-spacing-3);" />
                  </div>
                  <template #popper>
                    <div class="tiny-menu-item-title">
                      {{ t('bet_comp_coin') }}
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
                  <IconUniTableSort name="uni-table-sort" :style="`${sortSource[index]
                    === 'asc' ? '--tg-icon-color: #fff' : ''}`" />
                  <IconUniTableSort name="uni-table-sort" :style="`transform: rotate(180deg);
                  ${sortSource[index] === 'desc' ? '--tg-icon-color: #fff' : ''}`" />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="m-body">
          <tr v-for="(data, index) in getSource" :key="index" class="m-tr cursor-pointer"
            @click="$emit('rowClick', data)">
            <td v-for="(col, n) in columns" :key="n" class="m-td"
              :class="{ 'td-loading': loading, 'td-mobile': isMobile, 'overflow-visible': col.visible }"
              :title="data[col.dataIndex]" :style="{
                'text-align': col.align,
                'color': col.color ? col.color : 'inherit',
              }">
              <template v-if="loading">
                <div class="td-skeleton" :class="[col.align]">
                  <BaseSkeleton v-if="col.isRound === 'left'" height="14px" width="14px" style="--tg-skeleton-border-radius:50%;
                  margin-right: var(--tg-spacing-8);" animated="ani-opacity" />
                  <BaseSkeleton height="14px" style="--tg-skeleton-border-radius: 3px"
                    :width="col.skeWidth ? col.skeWidth : getWidth(col.title)" animated="ani-opacity" />
                  <BaseSkeleton v-if="col.isRound === 'right'" height="14px" width="14px" style="--tg-skeleton-border-radius:50%;
                  margin-left: var(--tg-spacing-8);" animated="ani-opacity" />
                </div>
              </template>
              <template v-else>
                <slot v-if="col.slot" v-bind="{ record: data, index, isAmountPopper }" :name="col.slot" :index="index">
                  {{ data[col.dataIndex] || '-' }}
                </slot>
                <AppAmount v-else-if="col.isAmount" popper-clazz="deep-tooltip" style="display: inline-block;"
                  :is-popper="isAmountPopper" :show-color="col.showColor" :amount="data[col.dataIndex]"
                  :currency-type="getCurrencyConfigByCode(data.currency_id)?.name ?? 'USDT'" />
                <span v-else>{{ data[col.dataIndex] || '-' }}</span>
              </template>
            </td>
          </tr>
          <tr v-if="showSummary && dataSource && dataSource.length" class="m-tr">
            <td v-for="(col, n) in columns" :key="n" class="m-td"
              :class="{ 'td-loading': loading, 'td-mobile': isMobile, 'overflow-visible': col.visible }"
              :style="`text-align:${col.align}`">
              <template v-if="loading">
                <div class="td-skeleton" :class="[col.align]">
                  <BaseSkeleton v-if="col.isRound === 'left'" height="14px" width="14px" style="--tg-skeleton-border-radius:50%;
                  margin-right: var(--tg-spacing-8);" animated="ani-opacity" />
                  <BaseSkeleton height="14px" style="--tg-skeleton-border-radius: 3px"
                    :width="col.skeWidth ? col.skeWidth : getWidth(col.title)" animated="ani-opacity" />
                  <BaseSkeleton v-if="col.isRound === 'right'" height="14px" width="14px" style="--tg-skeleton-border-radius:50%;
                  margin-left: var(--tg-spacing-8);" animated="ani-opacity" />
                </div>
              </template>
              <template v-else>
                <slot :name="col.sumSlot" v-bind="{ sums, n, record: col as any }">
                  <AppAmount v-if="col.isAmount" style="display: inline-block;" :is-popper="isAmountPopper"
                    :show-color="col.showColor" :amount="sums[n]"
                    :currency-type="currencyId ? getCurrencyConfigByCode(currencyId)?.name : 'USDT'" />
                  <span v-else>{{ sums[n] || '-' }}</span>
                </slot>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showEmpty && !loading && !dataSource?.length" style="margin-top: var(--tg-table-margin-top-empty);" :style="[{height: props.emptyHeight ? props.emptyHeight : ''}]">
      <BaseEmpty :description="t('data_empty')" icon="empty-1">
        <template #icon>
          <BaseImage class="w-[80px]" url="/png/icon/empty-1.png" />
        </template>
      </BaseEmpty>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --tg-table-font-size: var(--tg-font-size-default);
  --tg-table-even-background: initial;
  --tg-table-odd-background: var(--tg-secondary-grey);
  --tg-table-th-background: initial;
  --tg-table-th-color: var(--tg-text-lightgrey);
  --tg-table-line-height: 1.5;
  --tg-table-th-padding-x: var(--tg-spacing-16);
  --tg-table-th-padding-bottom: 0;
  --tg-table-td-padding-x: var(--tg-spacing-16);
  --tg-table-td-padding-xs: var(--tg-spacing-6);
  --tg-table-th-font-weight: var(--tg-font-weight-semibold);
  --tg-table-td-font-weight: var(--tg-font-weight-semibold);
  --tg-table-margin-top-empty: var(--tg-spacing-24);
  --tg-table-tr-last-first-padding: var(--tg-spacing-16);
  --tg-table-thtd-radius: var(--tg-radius-default);
  --tg-table-layout: auto;
  --tg-table-th-white-space: nowrap;
  --tg-table-th-word-wrap: normal;
  --tg-table-th-height: 53px;
}

[theme="green"] {
  --tg-table-th-color: #3CB389;
  --tg-table-odd-background: #055434;
}

[theme="white"] {
  --tg-table-th-color: #111;
  --tg-table-odd-background: #f5f5f5;
  --tg-table-even-background: #fff;
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
  --tg-skeleton-background-color: var(--tg-skeleton-color2);
  color: var(--tg-text-lightgrey);
  font-size: var(--tg-table-font-size);
  overscroll-behavior: auto;

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
      padding: 0 var(--tg-table-th-padding-x) var(--tg-table-th-padding-bottom);
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
        // flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        vertical-align: bottom;

        >*:not(:first-child) {
          margin-left: var(--tg-spacing-4);
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

      // .m-tr-loading {
      //   height: 40px;
      //   .m-loading {
      //     position: absolute;
      //     width: 100%;
      //     height: 100%;
      //   }
      // }
      // .m-td-empty{
      //   margin-top: 24px;
      // }
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
        padding: 0 var(--tg-table-td-padding-x);
        line-height: var(--tg-table-line-height);
        font-weight: var(--tg-table-td-font-weight);
        border: none;
        overflow: hidden;
        white-space: nowrap;
        // text-overflow: ellipsis;
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

.uni-tips {
  --tg-icon-color: var(--tg-text-grey);

  @include webTheme('green') {
    --tg-icon-color: var(--tg-svg-default-color);
  }
}
</style>
