<script lang="ts" setup name="AppTrxWinGoDetailItem">
import type { LotteryMyBetRecordItem } from '@tg/types'
import { IconLotCopy } from '@tg/icons'
import { getCurrencyConfig } from '@tg/utils'
import { timeTodateFormat2 } from '@tg/vue-i18n'
import { copy } from 'clipboard'
import { h, ref, watch } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { trxWinGoIdToKindMap } from '../../../utils/lotteryMaps'
import { message } from '../../../utils/message'

const props = defineProps<Props>()
const emits = defineEmits(['update:isClear'])
const { $$t } = useLocale()
interface Props {
  data: LotteryMyBetRecordItem[]
  isClear: boolean
}
const clickedMap = ref(new Map())

function handleExpandDetail(value: string) {
  if (clickedMap.value.has(value))
    clickedMap.value.delete(value)
  else
    clickedMap.value.set(value, true)
}

function RenderResult({ record }: { record: LotteryMyBetRecordItem }) {
  const ballNumber = JSON.parse(record.balls)[0]
  const result: string[] = JSON.parse(record.result)
  if (record.state === 0) {
    return h('span', '--')
  }
  else {
    const ball = h('span', null, ballNumber)
    return h('div', { class: 'flex' }, [
      ball,
      ...result.map(item => h('span', { style: { color: trxWinGoIdToKindMap[Number(item)].color }, class: 'ml-[6rem]' }, $$t(`${trxWinGoIdToKindMap[Number(item)].name}`))),
    ])
  }
}
function stateClass(item: LotteryMyBetRecordItem) {
  switch (item.state) {
    case 0:
      return ''
    case 1:
      return 'Succeed'
    case 2:
      return 'Failed'
    case 3:
      return ''
    default:
      return ''
  }
}
// 结算状态
function statusText(item: LotteryMyBetRecordItem) {
  switch (item.state) {
    case 0:
      return $$t('未支付')
    case 1:
      return $$t('成功')
    case 2:
      return $$t('失败')
    case 3:
      return $$t('失败')
    default:
      return ''
  }
}
function dealSelect(record: LotteryMyBetRecordItem) {
  if (record.play_id === 501) {
    return JSON.parse(record.bet_balls)[0]
  }
  return $$t(`${trxWinGoIdToKindMap[record.play_id]?.name}`)
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
  if (record.play_id === 501) {
    const betBall = Number(JSON.parse(record.bet_balls)[0])
    return betBall === 0 ? 'linear-gradient(to bottom right, #fb4e4e 50%, #eb43dd 0)' : betBall === 5 ? 'linear-gradient(to bottom right, #5cba47 50%, #eb43dd 0)' : betBall % 2 === 0 ? '#f2413b' : '#40ad72'
  }
  return trxWinGoIdToKindMap[record.play_id]?.color
}
function dealAmount(record: LotteryMyBetRecordItem) {
  const currencyDecimal = getCurrencyConfig(record.currency_id)?.decimal ?? 2
  return `${record.state === 1 ? '+' : '-'}${getCurrencyConfig(record.currency_id).prefix}${Math.abs(Number(record.settle_amount) - Number(record.valid_bet_amount)).toFixed(currencyDecimal)}`
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
      <div class="size-[36rem] mr-[12rem] rounded-[10rem] text-white center" :style="{ background: dealBg(item) }">
        {{ dealSelect(item) }}
      </div>
      <div class="flex-1 flex flex-col font-[500] pointer-events-none">
        <h1 class="flex mb-[5rem] items-start">
          <span class="mr-auto text-[14rem] leading-[17rem]">{{ item.issue_id }}</span><span class="w-[82rem] leading-[18rem] rounded-[6rem] border-[1rem] text-center" :class="dealHeadStatus(item)">{{ item.state === 1 ? $$t('成功') : $$t('失败') }}</span>
        </h1>
        <h2 class="flex" style="align-items: end;">
          <span class="detail-time mr-auto leading-[17rem]">{{ timeTodateFormat2(item.created_at) }}</span><span class="text-[14rem] leading-[15.5rem]" :class="dealHeadStatus(item)">{{ dealAmount(item) }}</span>
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
        <span class="mr-auto">{{ $$t('结果1') }}</span>
        <span><RenderResult :record="item" /></span>
      </h2>
      <h2 class="flex detail-bg">
        <span class="mr-auto">{{ $$t('选择') }}</span>
        <span>{{ dealSelect(item) }}</span>
      </h2>
      <h2 class="flex detail-bg">
        <span class="mr-auto">{{ $$t('状态') }}</span>
        <span :class="stateClass(item)">{{ statusText(item) }}</span>
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
