<script setup lang="ts" name="LotteryTable">
import type { LotteryColumns } from '@tg/types'
import type { VNode } from 'vue'
import LotteryEmpty from './LotteryEmpty.vue'

export interface RenderProps<T extends any[] = any[]> {
  fn: (...args: any[]) => VNode
  args: any[]
}
interface Props {
  columns: LotteryColumns[]
  sourceData: Array<Record<string, any>>
  rowId?: string
  noLeftRightBorder?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  noLeftRightBorder: true,
})
function Render(props: RenderProps) {
  return props.fn(...props.args)
}
</script>

<template>
  <div class="base-table">
    <table :class="{ 'no-left-right-border': noLeftRightBorder }">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.dataIndex"
            :style="col.titleStyle"
          >
            <template v-if="col.renderTitle">
              <Render :fn="col.renderTitle" :args="[col]" />
            </template>
            <template v-else>
              {{ col.title }}
            </template>
          </th>
        </tr>
      </thead>
      <tbody v-if="sourceData && sourceData.length > 0">
        <tr v-for="(row, rowIndex) in sourceData" :key="rowId ? row[rowId] : rowIndex">
          <td
            v-for="col in columns"
            :key="col.dataIndex"
            :style="[col.colStyle, { textAlign: col.colAlign || 'center' }]"
          >
            <template v-if="col.renderCol">
              <Render :fn="col.renderCol" :args="[row, col.dataIndex]" />
            </template>
            <template v-else>
              {{ row[col.dataIndex] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <template v-if="!sourceData || sourceData.length < 1">
      <div class="bg-[#fff] rounded-b-[8rem]">
        <LotteryEmpty />
      </div>
    </template>
  </div>
</template>
