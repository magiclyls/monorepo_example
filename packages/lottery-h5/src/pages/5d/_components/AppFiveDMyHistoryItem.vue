<script setup lang='ts'>
import type { LotteryMyBetRecordItem } from '@tg/types'
import { useBoolean } from '@tg/hooks'
import { IconLotCopy } from '@tg/icons'
import { getCurrencyConfig } from '@tg/utils'
import { timeTodateFormat2 } from '@tg/vue-i18n'
import { copy } from 'clipboard'
import { computed } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { message } from '../../../utils/message'

interface Props {
  data: LotteryMyBetRecordItem
}

defineOptions({ name: 'AppFiveDMyHistoryItem' })
const props = defineProps<Props>()

const { $$t } = useLocale()

// 位置
const posArr = [
  {
    pos: 'A',
    ids: [401, 402, 403, 404, 405],
  },
  {
    pos: 'B',
    ids: [406, 407, 408, 409, 410],
  },
  {
    pos: 'C',
    ids: [411, 412, 413, 414, 415],
  },
  {
    pos: 'D',
    ids: [416, 417, 418, 419, 420],
  },
  {
    pos: 'E',
    ids: [421, 422, 423, 424, 425],
  },
  {
    pos: $$t('总和'),
    ids: [426, 427, 428, 429],
  },
]
// 大小单双
const bsoeArr = [
  {
    label: $$t('大'),
    name: 'Big',
    ids: [402, 407, 412, 417, 422, 426],
  },
  {
    label: $$t('小'),
    name: 'Small',
    ids: [403, 408, 413, 418, 423, 427],
  },
  {
    label: $$t('单'),
    name: 'Odd',
    ids: [404, 409, 414, 419, 424, 428],
  },
  {
    label: $$t('双'),
    name: 'Even',
    ids: [405, 410, 415, 420, 425, 429],
  },
]
// 号码
const ballArr = [401, 406, 411, 416, 421]

const { bool: isExpand, toggle } = useBoolean(false)

// 状态
const stateText = computed(() => {
  switch (props.data.state) {
    case 0:
      return ''
    case 1:
      return $$t('成功')
    case 2:
      return $$t('失败')
    case 3:
      return $$t('失败')
    default:
      return ''
  }
})
const stateClass = computed(() => {
  switch (props.data.state) {
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
})
// 结算状态
const statusText = computed(() => {
  switch (props.data.state) {
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
})
// 货币符号
const currencyPrefix = computed(() => {
  return getCurrencyConfig(props.data.currency_id)?.prefix
})
// 货币位数
const currencyDecimal = computed(() => {
  return getCurrencyConfig(props.data.currency_id)?.decimal ?? 2
})
// 输赢
const amountText = computed(() => {
  const diff
    = Number(props.data.settle_amount) - Number(props.data.valid_bet_amount)

  if (props.data.state > 0) {
    const sign = diff > 0 ? '+' : diff < 0 ? '-' : ''
    return `${sign}${currencyPrefix.value}${Math.abs(diff).toFixed(currencyDecimal.value)}`
  }

  return '--'
})
// 下注位置
const betPos = computed(() => {
  return posArr.find(a => a.ids.includes(props.data.play_id))?.pos
})
// 下注内容
const betContent = computed(() => {
  const str = bsoeArr.find(a => a.ids.includes(props.data.play_id))?.label
  return str || props.data.bet_balls.replace(/[[\]]/g, '').replace(/,/g, '|')
})
// 下注内容的样式
const betContentClass = computed(() => {
  const str = bsoeArr.find(a => a.ids.includes(props.data.play_id))?.name
  return str || 'Ball'
})
// 是否下注号码
const isBall = computed(() => ballArr.includes(props.data.play_id))
const betSelect = computed(() => {
  if (isBall.value) {
    return betContent.value.split('|')
  }

  return betContent.value.slice(0, 1)
})
const balls = computed(() => JSON.parse(props.data.balls))
function onCopy(value: string) {
  copy(value)
  message.info($$t('已复制'))
}
</script>

<template>
  <div class="item-bg font-[400]">
    <!-- 列 -->
    <div class="py-[13rem] text-[12rem] cursor-pointer center " @click="toggle">
      <div
        class="size-[36rem] mr-[11rem] rounded-[10rem] text-white flex-none leading-[36rem] text-center overflow-hidden"
        :class="betContentClass"
      >
        {{ betContent }}
      </div>
      <div class="flex-1 flex flex-col font-[500]">
        <div class="flex mb-[8rem] items-start justify-between">
          <span class="text-[14rem] leading-[17rem]">{{ data.issue_id }}</span>
          <span
            v-if="stateText" :class="stateClass"
            class="w-[82rem] h-[18rem] rounded-[6rem] border-[1rem] text-center"
          >
            {{ stateText }}
          </span>
        </div>
        <div class="flex" style="align-items: end;">
          <span class="detail-time mr-auto leading-[17rem]">{{ timeTodateFormat2(data.created_at) }}</span>
          <span v-if="stateText" :class="stateClass" class="text-[14rem] leading-[15.5rem] text-center">
            {{ amountText }}
          </span>
        </div>
      </div>
    </div>
    <!-- 详情 -->
    <div v-if="isExpand" class="detail pt-[12rem] pb-[24rem] grid gap-y-[8rem] leading-[25rem] text-[14rem]">
      <div class="detail-title font-[500] text-[20rem] leading-[28rem]">
        {{ $$t('详情') }}
      </div>
      <div class="detail-bg">
        <span>{{ $$t('订单号') }}</span>
        <div class="leading-[25rem] flex">
          <span class="mr-[3.5rem] leading-[25rem]">{{ data.id }}</span><span
            class="text-[#9DABC8] cursor-pointer center text-[18rem]" @click="onCopy(data.id)"
          >
            <IconLotCopy />
          </span>
        </div>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('期号') }}</span>
        <span>{{ data.issue_id }}</span>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('购买金额') }}</span>
        <span>{{ currencyPrefix }}{{ data.bet_amount }}</span>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('倍数') }}</span>
        <span>{{ data.times }}</span>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('税后金额') }}</span>
        <span class="text-[#F2413B]">{{ currencyPrefix }}{{ data.valid_bet_amount }}</span>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('税') }}</span>
        <span>{{ currencyPrefix }}{{ data.tax_amount }}</span>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('开奖结果') }}</span>
        <div class="flex items-center">
          <span v-if="balls.length === 0">--</span>
          <span
            v-for="num, i in balls" :key="`${num}-${i}`"
            class="detail-ball w-[18rem] h-[18rem] ml-[3rem] flex items-center justify-center rounded-[50%] text-[12rem]"
          >
            {{ num }}
          </span>
        </div>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('选择') }}</span>
        <div class="flex items-center">
          <span class="select-text text-[14rem]">{{ betPos }}</span>
          <template v-if="isBall">
            <span
              v-for="num, i in betSelect" :key="`${num}-${i}`"
              class="detail-ball w-[18rem] h-[18rem] ml-[3rem] flex items-center justify-center rounded-[50%] text-[12rem]"
            >
              {{ num }}
            </span>
          </template>
          <span
            v-else
            class="detail-ball w-[18rem] h-[18rem] ml-[3rem] flex items-center justify-center rounded-[50%] text-[12rem]"
          >
            {{ betSelect }}
          </span>
        </div>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('状态') }}</span>
        <span :class="stateClass">{{ statusText }}</span>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('输赢') }}</span>
        <span :class="stateClass">{{ amountText }}</span>
      </div>
      <div class="detail-bg">
        <span>{{ $$t('下单时间') }}</span>
        <span>{{ timeTodateFormat2(data.created_at) }}</span>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
</style>
