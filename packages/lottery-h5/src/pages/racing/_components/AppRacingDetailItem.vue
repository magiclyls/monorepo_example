<script lang="ts" setup>
import type { LotteryMyBetRecordItem } from '@tg/types'
import type { VNode } from 'vue'
import { LotteryColorfulBalls } from '@tg/bccomponents'
import { IconLotCopy } from '@tg/icons'
import { getCurrencyConfig } from '@tg/utils'
import { timeTodateFormat2 } from '@tg/vue-i18n'
import { copy } from 'clipboard'
import { h, ref, watch } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { message } from '../../../utils/message'

interface Props {
  data: LotteryMyBetRecordItem[]
  isClear: boolean
}
defineOptions({
  name: 'AppRacingDetailItem',
})
const props = defineProps<Props>()
const emits = defineEmits(['update:isClear'])
const { $$t } = useLocale()
const raceMap: { [key: string]: { name: string, color: string, shadow: string, render: VNode | ((num: number) => VNode) } } = {
  1: { name: 'balls', color: '#1d864c', shadow: '0 0 10rem 0 rgba(0, 0, 0, 0.15)', render: (num: number) => h('div', { class: 'h-full center' }, [h(LotteryColorfulBalls, { type: 'race', number: num, class: 'size-[20rem]' })]) },
  2: { name: $$t('大'), color: 'linear-gradient(90deg, #FF9000 0%, #FFD000 100%)', shadow: '0 0 10rem 0 rgba(0, 0, 0, 0.15)', render: h('div', { class: 'h-full center mx-[2rem]' }, [h('div', { class: 'size-[17rem] shadow-[0_0_10rem_0_rgba(0,0,0,0.15)] bg-linear-[90deg,#FF9000_0%,#FFD000_100%] text-white rounded-[2rem] px-[7rem] center font-[700]' }, $$t('racing大'))]) },
  3: { name: $$t('小'), color: 'linear-gradient(90deg, #00BDFF 0%, #5BCDFF 100%)', shadow: '0 0 10rem 0 rgba(0, 0, 0, 0.15)', render: h('div', { class: 'h-full center mx-[2rem]' }, [h('div', { class: 'size-[17rem] shadow-[0_0_10rem_0_rgba(0,0,0,0.15)] bg-linear-[90deg,#00BDFF_0%,#5BCDFF_100%] text-white rounded-[2rem] px-[7rem] center font-[700]' }, $$t('racing小'))]) },
  4: { name: $$t('单'), color: 'linear-gradient(90deg, #FD0261 0%, #FF8A96 100%)', shadow: '0 0 10rem 0 rgba(0, 0, 0, 0.15)', render: h('div', { class: 'h-full center mx-[2rem]' }, [h('div', { class: 'size-[17rem] shadow-[0_0_10rem_0_rgba(0,0,0,0.15)] bg-linear-[90deg,#FD0261_0%,#FF8A96_100%] text-white rounded-[2rem] px-[7rem] center font-[700]' }, $$t('racing单'))]) },
  5: { name: $$t('双'), color: 'linear-gradient(90deg, #00BE50 0%, #9BDF00 100%)', shadow: '0 0 10rem 0 rgba(0, 0, 0, 0.15)', render: h('div', { class: 'h-full center mx-[2rem]' }, [h('div', { class: 'size-[17rem] shadow-[0_0_10rem_0_rgba(0,0,0,0.15)] bg-linear-[90deg,#00BE50_0%,#9BDF00_100%] text-white rounded-[2rem] px-[7rem] center font-[700]' }, $$t('racing双'))]) },
}

const clickedMap = ref(new Map())

function handleExpandDetail(value: string) {
  if (clickedMap.value.has(value))
    clickedMap.value.delete(value)
  else
    clickedMap.value.set(value, true)
}

function RenderResult({ record }: { record: LotteryMyBetRecordItem }) {
  const ballArr: string[] = JSON.parse(record.balls).slice(0, 3)
  if (record.state === 0) {
    return h('span', '--')
  }
  else {
    const ball = (num: number) => h(LotteryColorfulBalls, { type: 'race', number: num, class: 'size-[20rem]' })
    return h('div', { class: 'flex items-center' }, ballArr.map(item => ball(Number(item))))
  }
}
function dealSelect(record: LotteryMyBetRecordItem) {
  const playId = String(record.play_id)
  const last = playId[playId.length - 1]
  if (last === '1') {
    return JSON.parse(record.bet_balls)[0]
  }
  return raceMap[last]?.name
}
function dealHeadStatus(record: LotteryMyBetRecordItem) {
  const state = record.state
  if (state === 0) {
    return 'opacity-0'
  }
  if (state === 1) {
    return 'text-[#47BA7C]'
  }
  if (state === 2) {
    return 'text-[#FD565C]'
  }
}
function dealBg(record: LotteryMyBetRecordItem) {
  const playId = String(record.play_id)
  const last = playId[playId.length - 1]
  if (last === '1') {
    return '#1d864c'
  }
  return raceMap[last]?.color
}
function dealShadow(record: LotteryMyBetRecordItem) {
  const playId = String(record.play_id)
  const last = playId[playId.length - 1]
  if (last === '1') {
    return 'none'
  }
  return raceMap[last]?.shadow
}
function dealAmount(record: LotteryMyBetRecordItem) {
  return `${record.state === 1 ? '+' : '-'}${getCurrencyConfig(record.currency_id).prefix}${Math.abs(Number(record.settle_amount) - Number(record.valid_bet_amount)).toFixed(getCurrencyConfig(record.currency_id).decimal)}`
}
function RenderSelect({ record }: { record: LotteryMyBetRecordItem }) {
  const playId = String(record.play_id)
  const mid = playId[playId.length - 2]
  const last = playId[playId.length - 1]
  let res: any
  if (last === '1') {
    const id = JSON.parse(record.bet_balls)[0]
    const renderFn = raceMap[last]?.render
    res = typeof renderFn === 'function' ? renderFn(Number(id)) : renderFn
  }
  else {
    res = raceMap[last]?.render
  }
  const fir = h('div', { class: 'mr-[3rem] text-[14rem] font-[400]' }, mid === '1' ? $$t('第一名') : mid === '2' ? $$t('第二名') : $$t('第三名'))
  return h('div', { class: 'flex item-center' }, [fir, res])
}
function onCopy(id: string) {
  copy(id)
  message.info($$t('已复制'))
}

watch(() => props.isClear, (n) => {
  if (n) {
    clickedMap.value.clear()
    emits('update:isClear', false)
  }
})
</script>

<template>
  <div v-for="item of data" :key="item.id" class="item-bg font-[400]">
    <!-- 列 -->
    <div class="py-[13rem] text-[12rem] cursor-pointer center " @click="handleExpandDetail(item.id)">
      <div class="size-[36rem] mr-[12rem] rounded-[10rem] text-white center" :style="{ background: dealBg(item), boxShadow: dealShadow(item) }">
        {{ dealSelect(item) }}
      </div>
      <div class="flex-1 flex flex-col font-[500] pointer-events-none">
        <h1 class="flex mb-[5rem] items-start">
          <span class="mr-auto text-[14rem] leading-[17rem]">{{ item.issue_id }}</span><span class="w-[82rem] leading-[18rem] rounded-[6rem] border-[1rem] text-center" :class="dealHeadStatus(item)">{{ item.state === 1 ? $$t('成功') : $$t('失败') }}</span>
        </h1>
        <h2 class="flex" style="align-items: end;">
          <span class="detail-time mr-auto text-[#888] leading-[17rem]">{{ timeTodateFormat2(item.created_at) }}</span><span class="text-[14rem] leading-[15.5rem]" :class="dealHeadStatus(item)">{{ dealAmount(item) }}</span>
        </h2>
      </div>
    </div>
    <!-- 详情 -->
    <div v-if="clickedMap.has(item.id)" class="detail pt-[12rem] pb-[24rem] grid gap-y-[8rem] leading-[25rem] text-[14rem]">
      <h1 class="detail-title font-[500] text-[20rem]">
        {{ $$t('详情') }}
      </h1>
      <h2 class="flex detail-bg">
        <span class="mr-auto">{{ $$t('订单号') }}</span>
        <div class="leading-[25rem] flex">
          <span class="mr-[3.5rem] leading-[25rem]">{{ item.id }}</span><span class="text-[#9DABC8] cursor-pointer center text-[18rem]" @click="onCopy(item.id)"><IconLotCopy /></span>
        </div>
      </h2>
      <h2 class="flex detail-bg">
        <span class="mr-auto">{{ $$t('期号') }}</span>
        <span>{{ item.issue_id }}</span>
      </h2>
      <h2 class="flex detail-bg">
        <span class="mr-auto">{{ $$t('购买金额') }}</span>
        <span>{{ `${getCurrencyConfig(item.currency_id).prefix}${item.bet_amount}` }}</span>
      </h2>
      <h2 class="flex detail-bg">
        <span class="mr-auto">{{ $$t('倍数') }}</span>
        <span>{{ item.times }}</span>
      </h2>
      <h2 class="flex detail-bg">
        <span class="mr-auto">{{ $$t('税后金额') }}</span>
        <span class="text-[#F2413B]">{{ `${getCurrencyConfig(item.currency_id).prefix}${item.valid_bet_amount}` }}</span>
      </h2>
      <h2 class="flex detail-bg">
        <span class="mr-auto">{{ $$t('税') }}</span>
        <span>{{ `${getCurrencyConfig(item.currency_id).prefix}${item.tax_amount}` }}</span>
      </h2>
      <h2 class="flex detail-bg">
        <span class="mr-auto">{{ $$t('开奖结果') }}</span>
        <RenderResult :record="item" />
      </h2>
      <h2 class="flex detail-bg">
        <span class="mr-auto">{{ $$t('选择') }}</span>
        <RenderSelect :record="item" />
      </h2>
      <h2 class="flex detail-bg">
        <span class="mr-auto">{{ $$t('状态') }}</span>
        <span v-if="item.state === 0">{{ $$t('未支付') }}</span>
        <span v-else-if="item.state === 1" class="text-[#47BA7C]">{{ $$t('成功1') }}</span>
        <span v-else-if="item.state === 2" class="text-[#FD565C]">{{ $$t('失败') }}</span>
        <span v-else-if="item.state === 3">{{ $$t('失败') }}</span>
      </h2>
      <h2 class="flex detail-bg">
        <span class="mr-auto">{{ $$t('输赢') }}</span>
        <span v-if="item.state === 0">--</span>
        <span v-else :class="[item.state === 1 ? 'text-[#47BA7C]' : 'text-[#FD565C]']">{{ dealAmount(item) }}</span>
      </h2>
      <h2 class="flex detail-bg">
        <span class="mr-auto">{{ $$t('下单时间') }}</span>
        <span>{{ timeTodateFormat2(item.created_at) }}</span>
      </h2>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-bg {
  padding-left: 2rem;
  padding-right: 2rem;
  background-color: #f9f9f9;
  border-radius: 4rem;
  line-height: 25rem;
}
</style>
