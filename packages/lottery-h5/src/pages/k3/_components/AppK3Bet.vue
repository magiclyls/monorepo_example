<script setup lang="ts" name="AppK3Bet">
import type { LotteryBetItem } from '@tg/types'
import type { ProjectType } from '../../../hooks/useCurrencyComponentConfig'
import { ApiCpBet } from '@tg/apis'
import { LotteryCheckBox, LotteryCurrencyIcon } from '@tg/bccomponents'
import { useCurrency } from '@tg/stores'
import { mul } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, inject, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { getInputSelectComponent } from '../../../hooks/useInputComponentConfig'
import { useLogin } from '../../../hooks/useLogin'
import { useK3Store } from '../../../stores/useK3Store'
import { message } from '../../../utils/message'
import { isLogin } from '../../../utils/tool'
import AppBetView from './AppBetView.vue'

const props = withDefaults(defineProps<Props>(), {
  project: 'ph-h5',
})
const emits = defineEmits(['success'])
const { $$t } = useLocale()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const { login } = useLogin(close)
const k3Store = useK3Store()
const { K3BetData, K3BetType, K3BetParams } = storeToRefs(k3Store)

interface Props {
  min: number
  max: number
  project?: ProjectType
}

const { runAsync: runAsyncBet } = useRequest(params => ApiCpBet(params))
const currentMultiply = ref(1)
const isCheck = ref(true)

const currentTab = inject('currentTab', ref(1001))
const curPeriod = inject('curPeriod', ref(''))

const {
  value: singleBetAmount,
  errorMessage: amountErrorMsg,
  validate: valiAmount,
} = useField<string>('amount', (value) => {
  const n = Number(value)
  if (!n) {
    return `${$$t('请输入投注金额')}`
  }
  else if (n > Number(currentGlobalCurrencyMap.value.balance)) {
    return $$t('您的投注额不能大于余额')
  }
  else if (n > props.max) {
    return `${$$t('最大投注额')} ${props.max}`
  }
  else if (n < props.min) {
    return `${$$t('最小投注额')} ${props.min}`
  }

  return ''
}, { initialValue: '' })

const total = computed(() => mul(Number(singleBetAmount.value), (K3BetParams.value?.length || 0)))

async function onBet() {
  if (!isLogin()) {
    login()
    return
  }
  if (!isCheck.value) {
    message.info($$t('请勾选我同意预售规则'))
    return
  }
  await valiAmount()
  if (amountErrorMsg.value) {
    return
  }
  runAsyncBet({
    lottery_id: currentTab.value, // 1001 彩种（win go 30s）
    issue_id: curPeriod.value, // 2025073100001期号
    amount: total.value,
    currency_id: currentGlobalCurrencyMap.value.cur,
    bets: K3BetParams.value?.map((item: LotteryBetItem) => {
      const betId = Number(`${currentTab.value}0${item.play_id}`)
      return {
        id: betId,
        play_id: item.play_id, // 玩法(指定号码，可以多选)
        bet_balls: item.balls ? JSON.stringify(item.balls) : '[]', // 投注号码
        odds: item.odds, // 赔率
        times: currentMultiply.value, // 投注倍数
        price: singleBetAmount.value, // 单注价格
        amount: singleBetAmount.value, // 单注投注金额
      }
    }),
  }).then(() => {
    emits('success')
    message.info($$t('成功下注'))
  }).catch(() => {
    message.info($$t('下注失败'))
  })
}

// 根据项目选择对应的输入框组件
const InputSelectComponent = computed(() => {
  return getInputSelectComponent(props.project)
})

function close() {
  k3Store.closePop()
  k3Store.clearBet()
}
</script>

<template>
  <div class="app-k3-bet relative k3-bet-bg w-full rounded-t-[8rem] overflow-hidden">
    <div class="px-[12rem] py-[18rem] grid gap-y-[15rem]">
      <AppBetView :k3-bet-data="K3BetData" :k3-bet-type="K3BetType" :vertical="true" />
      <div class="flex justify-between gap-[40rem]">
        <span class="text-[16rem] leading-[28rem] font-[500] k3-bet-text">{{ $$t('金额') }}</span>

        <component
          :is="InputSelectComponent"
          v-model="singleBetAmount"
          :msg="amountErrorMsg"
          type="number"
          class="flex-1"
          :placeholder="$$t('限额{n}-{m}', { n: min, m: max })"
          style="--ph-base-input-padding-y:9rem; --afun-base-input-padding-y:9px; --afun-base-input-style-placeholder-color:#57646D;"
        >
          <template #right>
            <LotteryCurrencyIcon style="--Lottery-app-currency-icon-size:18rem;" :currency-type="currentGlobalCurrencyMap.type" />
          </template>
        </component>
      </div>
      <h4 class="flex items-center h-[28rem] text-[12rem] font-[500]">
        <LotteryCheckBox v-model="isCheck" class="mr-[14rem]" /><span class="leading-[28rem] k3-bet-text3">{{ $$t('我同意') }} <span class="k3-bet-text4 leading-[28rem] cursor-pointer">《{{ $$t('预售规则') }}》</span></span>
      </h4>
    </div>
    <div class="w-full h-[36rem] flex text-[14rem] font-[500]">
      <div class="w-1/3 text-center leading-[36rem] k3-bet-bg2 k3-bet-text" @click="close">
        {{ $$t('取消') }}
      </div>
      <div class="flex-1 text-center leading-[36rem] k3-bet-bg1 k3-bet-text2" @click="onBet">
        {{ $$t('立即投注') }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-k3-bet {
  input {
    text-align: center;
    line-height: 26rem;
    width: 79rem;
    font-size: 15rem;
  }
}
</style>
