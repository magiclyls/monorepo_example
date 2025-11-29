<script setup lang="ts" name="AppWinGoBet">
import type { ProjectType } from '../../../hooks/useCurrencyComponentConfig'
import { ApiCpBet } from '@tg/apis'
import { LotteryCheckBox, LotteryCurrencyIcon, LotteryDialog } from '@tg/bccomponents'
import { useCurrency } from '@tg/stores'
import { mul } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import AppPreSaleRules from '../../../components/AppPreSaleRules.vue'
import { useLocale, useProjectName } from '../../../components/LotteryConfigProvider'
import { getInputSelectComponent } from '../../../hooks/useInputComponentConfig'
import { useLogin } from '../../../hooks/useLogin'
import { useWinGoStore } from '../../../stores/useWinGoStore'
import { message } from '../../../utils/message'
import { isLogin } from '../../../utils/tool'

const props = withDefaults(defineProps<Props>(), {
  project: 'ph-h5',
})
const emits = defineEmits(['update:currentMultiply', 'close', 'success'])
const { $$t } = useLocale()
const projectName = useProjectName()
const { winGoTabArr } = storeToRefs(useWinGoStore())
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const { login } = useLogin(close)
const InputComponent = computed(() => {
  return getInputSelectComponent(props.project)
})

interface Props {
  target: { color: string, text: string }
  // 当前倍数
  currentMultiply: number
  // 当前彩种
  currentTab: number
  // playId
  betPlayId: number
  // 当前赔率
  betOdd: string
  period: string
  min: number
  max: number
  project?: ProjectType
}
const textMap: { [key: string]: string } = {
  Red: $$t('红色'),
  Green: $$t('绿色'),
  Big: $$t('大'),
  Small: $$t('小'),
}
const { runAsync: runAsyncBet } = useRequest(params => ApiCpBet(params))

const isCheck = ref(true)
const color = computed(() => props.target.color)
const text = computed(() => props.target.text === 'Purple' ? $$t('紫色') : Number(props.target.text) >= 0 ? props.target.text : textMap[props.target.text])
const isShowRules = ref(false)

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

const total = computed(() => mul(props.currentMultiply, Number(singleBetAmount.value)))
const currentKind = computed(() => winGoTabArr.value.filter(item => item.value === props.currentTab)[0]?.label)
const betId = computed(() => Number(`${props.currentTab}0${[props.betPlayId]}`))

function close() {
  emits('close')
}

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
  const play_id = props.betPlayId
  runAsyncBet({
    lottery_id: props.currentTab,
    issue_id: props.period,
    amount: String(total.value),
    currency_id: currentGlobalCurrencyMap.value.cur,
    bets: [
      {
        id: betId.value,
        play_id,
        bet_balls: play_id === 101 ? JSON.stringify([Number(props.target.text)]) : '[]',
        odds: props.betOdd,
        times: props.currentMultiply,
        price: singleBetAmount.value,
        amount: String(total.value),
      },
    ],
  }).then(() => {
    emits('success')
  }).then(() => {
    message.info($$t('成功下注'))
  }).catch(() => {
    message.info($$t('下注失败'))
  })
}
</script>

<template>
  <div class="relative app-win-go-bet w-full rounded-t-[8rem] overflow-hidden">
    <div class="h-[95rem] pt-[13rem] mb-[28rem]" :class="`header-bg-${color}`">
      <div class="kind-text text-center font-[600] text-[18rem] mb-[7rem]">
        {{ currentKind }}
      </div>
      <div class="w-full center">
        <div class="select-bg h-[25rem] w-[280rem] rounded-[5rem] text-center font-[500] leading-[25rem]">
          <span class="mr-[14rem]">{{ $$t('选择') }}</span><span>{{ text }}</span>
        </div>
      </div>
    </div>
    <div class="px-[12rem] grid gap-y-[15rem]">
      <div class="flex justify-between items-center gap-[40rem]">
        <span class="money-text text-[16rem] leading-[28rem]  font-[500]">{{ $$t('金额') }}</span>

        <component
          :is="InputComponent"
          v-model="singleBetAmount"
          :msg="amountErrorMsg"
          type="number"
          class="flex-1"
          :placeholder="$$t('限额{n}-{m}', { n: min, m: max })"
          style="--ph-base-input-padding-y:9rem; --afun-base-input-padding-y:9rem;"
        >
          <template #right>
            <LotteryCurrencyIcon style="--Lottery-app-currency-icon-size:18rem;" :currency-type="currentGlobalCurrencyMap.type" />
          </template>
        </component>
      </div>
      <h4 class="flex items-center mb-[18rem] h-[28rem] text-[12rem] font-[500]">
        <LotteryCheckBox v-model="isCheck" class="mr-[14rem]" /><span class="note-text leading-[28rem]">{{ $$t('我同意') }} <span class="note-text-link leading-[28rem] cursor-pointer" @click="isShowRules = true">《{{ $$t('预售规则') }}》</span></span>
      </h4>
    </div>
    <div class="w-full h-[36rem] flex text-[14rem] font-[500]">
      <div class="cancel-btn w-1/3 text-center leading-[36rem]" @click="emits('close')">
        {{ $$t('取消') }}
      </div>
      <div class="submit-btn flex-1 text-center leading-[36rem]" @click="onBet">
        {{ $$t('立即投注') }}
      </div>
    </div>
    <LotteryDialog v-model="isShowRules" :close-text="$$t('我知道')" :title="$$t('预售规则')" :max-size="[264, 371]" :project="projectName">
      <AppPreSaleRules />
    </LotteryDialog>
  </div>
</template>
