<script setup lang="ts" name="AppTableWithLines">
import { onMounted, ref, watch } from 'vue'
import { useLocale } from '../components/LotteryConfigProvider'

const props = defineProps<Props>()
const { $$t } = useLocale()
interface Props {
  columns: any[]
  sourceData: { [key: string]: string | number }[]
  lastPeriod?: any[]
  numberKey: string
  staticColor?: boolean
}
const targetKey = props.numberKey
const refs = ref<any[]>([])
const lines = ref<{ x1: number, y1: number, x2: number, y2: number }[]>([])

function dealColor(value: number) {
  if (props.staticColor)
    return 'static-ball-color'

  if (value === 0)
    return 'zero'
  if (value === 5)
    return 'five'
  if (value % 2 === 0)
    return 'even'
  else return 'odd'
}

function getRef(row: number, numberIndex: number, el: any) {
  if (!refs.value[row]) {
    refs.value[row] = []
  }
  refs.value[row][numberIndex] = el
}

function updateLines() {
  lines.value = []
  const container = document.querySelector('.table-wrapper')
  if (!container)
    return
  const svgBox = container?.getBoundingClientRect()

  for (let i = 0; i < props.sourceData.length - 1; i++) {
    const cur = props.sourceData[i]
    const next = props.sourceData[i + 1]

    const startEl = refs.value[i]?.[cur[targetKey]]
    const endEl = refs.value[i + 1]?.[next[targetKey]]

    if (!startEl || !endEl)
      continue

    const sBox = startEl.getBoundingClientRect()
    const eBox = endEl.getBoundingClientRect()

    const r = sBox.width / 2

    const sCenter = {
      x: sBox.left + r - svgBox.left,
      y: sBox.top + r - svgBox.top,
    }

    const eCenter = {
      x: eBox.left + r - svgBox.left,
      y: eBox.top + r - svgBox.top,
    }

    const sEdge = getEdgePosition(sCenter.x, sCenter.y, eCenter.x, eCenter.y, r)
    const eEdge = getEdgePosition(eCenter.x, eCenter.y, sCenter.x, sCenter.y, r)

    lines.value.push({
      x1: sEdge.x,
      y1: sEdge.y,
      x2: eEdge.x,
      y2: eEdge.y,
    })
  }
}
function getEdgePosition(x1: number, y1: number, x2: number, y2: number, r: number) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len === 0)
    return { x: x1, y: y1 }
  const ratio = r / len
  return {
    x: x1 + dx * ratio,
    y: y1 + dy * ratio,
  }
}

onMounted(() => {
  updateLines()
})
watch(() => props.sourceData, () => {
  updateLines()
}, { deep: true })
</script>

<template>
  <div class="table-wrapper relative">
    <table>
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.dataIndex">
            {{ col.title }}
          </th>
        </tr>
      </thead>
      <tbody v-if="lastPeriod" last-body class="border-b-[1rem] border-[#E1E1E1]">
        <tr>
          <td class="w-full pl-[10rem] h-[60rem] whitespace-nowrap ">
            <div class="size-full flex items-end pb-[5rem] relative">
              <div class="absolute top-45 left-0">
                {{ $$t('近期统计') }}
              </div>
              {{ $$t('开奖号码') }}
            </div>
          </td>
          <td class="w-full">
            <div class="flex justify-end items-end size-full pb-[5rem]">
              <span
                v-for="(_, index) in 10"
                :key="index"
                class="number-list mr-[2rem] last:mr-[8rem] rounded-[100rem] size-[18rem] shrink-0 flex items-center justify-center text-[13rem]"
              >
                {{ index }}
              </span>
            </div>
          </td>
        </tr>
        <tr v-for="row, rowIndex of lastPeriod" :key="rowIndex">
          <td class="pl-[10rem]">
            {{ row.label }}
          </td>
          <td class="flex justify-end">
            <div class="grid grid-cols-10 justify-items-center w-[210rem] items-center">
              <span v-for="item, index of row.value" :key="index" class="last:mr-[8rem] text-[#9DA7B3] text-[13rem]">
                {{ item }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody number-body>
        <tr v-for="(row, rowIndex) in sourceData" :key="rowIndex">
          <td class="pl-[10rem]">
            {{ row.id }}
          </td>
          <td>
            <div class="flex justify-center items-center">
              <span
                v-for="(_, index) in 10"
                :key="index"
                :ref="(el) => getRef(rowIndex, index, el)"
                class="border-[1rem] border-[#BBB] text-[#bbb] mr-[4rem] last:mr-0 rounded-[100rem] size-[16rem] shrink-0 flex items-center justify-center text-[12rem]"
                :class="[index === Number(row[targetKey]) ? dealColor(index) : '']"
              >

                {{ index }}
              </span>
              <slot :record="row[targetKey]">
                <span class="w-[11rem] h-[16rem] text-white rounded-[8rem] text-[10rem] mx-[8rem] center" :class="[Number(row[targetKey]) > 4 ? 'bg-[#F3BD14]' : 'bg-[#6DA7F4]']">
                  {{ Number(row[targetKey]) > 4 ? $$t('racing大') : $$t('racing小') }}
                </span>
              </slot>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <svg class="svg-overlay">
      <line
        v-for="(line, i) in lines"
        :key="i"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        stroke="red"
        stroke-width="2"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
</style>
