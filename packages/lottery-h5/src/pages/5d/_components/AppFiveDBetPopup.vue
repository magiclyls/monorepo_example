<script setup lang='ts'>
import type { ILotteryOddsData } from '@tg/types'
import type { ProjectType } from '../../../hooks/useCurrencyComponentConfig'
import { ApiCpBet } from '@tg/apis'
import { LotteryCheckBox, LotteryCurrencyIcon, LotteryDialog } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { useCurrency } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import AppPreSaleRules from '../../../components/AppPreSaleRules.vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { getInputSelectComponent } from '../../../hooks/useInputComponentConfig'
import { useLogin } from '../../../hooks/useLogin'
import { use5DStore } from '../../../stores/use5DStore'
import { message } from '../../../utils/message'
import { isLogin as getLogin } from '../../../utils/tool'
import AppFiveDBetPanel from './AppFiveDBetPanel.vue'

interface BetOptionsItem {
  label: string
  play_id: number
  id: number
  odd: string
}

interface Props {
  data: ILotteryOddsData
  lotteryId: number
  issueId: string
  betLimitData: string[]
  project?: ProjectType
}

defineOptions({ name: 'AppFiveDBetPopup' })
const props = defineProps<Props>()
const emit = defineEmits(['close', 'success'])

const { bool: isCheck } = useBoolean(true)
const { bool: isShowRules } = useBoolean(false)
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const { login } = useLogin(() => emit('close'))
const { $$t } = useLocale()
const { selectedBSOE, selectedNumArr } = storeToRefs(use5DStore())

const { run: runBet } = useRequest(ApiCpBet, {
  onSuccess() {
    emit('success')
    emit('close')
    message.info($$t('成功下注'))
  },
  onError() {
    message.info($$t('下注失败'))
  },
})

const isLogin = ref(getLogin())

// 下注选项Ref
const betOptionsPanelRef = ref()
// 倍数
const currentMultiply = 1

// 最小投注额
const betLimitMin = computed(() => {
  if (selectedBSOE.value) {
    return Number(props.betLimitData[0])
  }
  return Number(props.betLimitData[0]) * selectedNumArr.value.length
})
// 最大投注额
const betLimitMax = computed(() => {
  if (selectedBSOE.value) {
    return Number(props.betLimitData[1])
  }
  return Number(props.betLimitData[1]) * selectedNumArr.value.length
})

const min = computed(() => betLimitMin.value)
const max = computed(() => betLimitMax.value)
const {
  value: amount,
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
  else if (n > betLimitMax.value) {
    return `${$$t('最大投注额')} ${betLimitMax.value}`
  }
  else if (n < betLimitMin.value) {
    return `${$$t('最小投注额')} ${betLimitMin.value}`
  }

  return ''
}, { initialValue: '' })

const totalAmount = computed(() => {
  if (selectedBSOE.value) {
    return Number(amount.value) * currentMultiply
  }
  return Number(amount.value) * currentMultiply
})
const params = computed(() => {
  return {
    lottery_id: props.lotteryId,
    issue_id: props.issueId, // 期号，例如 "2025072301293"
    amount: totalAmount.value.toString(),
    currency_id: currentGlobalCurrencyMap.value.cur,
    bets: [], // 投注项列表
  }
})

// function changeCurrentMultiply(v: number) {
//   currentMultiply.value = v
// }
// function decrease() {
//   if (currentMultiply.value > 0)
//     currentMultiply.value = currentMultiply.value - 1
// }
// function increase() {
//   currentMultiply.value = currentMultiply.value + 1
// }
// function onAmountClick(v: string) {
//   amount.value = v
// }
// 下注
async function onBet() {
  if (!isLogin.value)
    return login()
  if (!isCheck.value) {
    message.info($$t('请勾选我同意预售规则'))
    return
  }
  const bsoe = betOptionsPanelRef.value.selectBSOEObj as BetOptionsItem
  const nums = betOptionsPanelRef.value.selectNumObjArr as BetOptionsItem[]
  console.log('🚸🚸🚸 ~ onBet ~ 下注选项:', bsoe, nums)

  if (bsoe || (nums && nums.length > 0)) {
    // 限额拦截
    await valiAmount()
    if (amountErrorMsg.value) {
      return
    }
  }

  // 大小单双
  if (bsoe) {
    runBet({
      ...params.value,
      bets: [{
        id: bsoe.id,
        play_id: bsoe.play_id,
        bet_balls: '',
        odds: bsoe.odd,
        times: currentMultiply,
        price: amount.value.toString(),
        amount: totalAmount.value.toString(),
      }],
    })
  }
  // 号码
  else if (nums && nums.length > 0) {
    runBet({
      ...params.value,
      bets: [{
        id: nums[0].id,
        play_id: nums[0].play_id,
        bet_balls: `[${nums.map(a => a.label)}]`,
        odds: nums[0].odd,
        times: currentMultiply,
        price: amount.value.toString(),
        amount: totalAmount.value.toString(),
      }],
    })
  }
}

// 根据项目选择对应的输入框组件
const InputSelectComponent = computed(() => {
  return getInputSelectComponent(props.project)
})
</script>

<template>
  <div class="pt-[16rem] lottery-5d-bg rounded-t-[8rem] ">
    <div class="px-[13rem] pb-[18rem]">
      <AppFiveDBetPanel ref="betOptionsPanelRef" :data="data.odds" is-in-pop />
      <!-- 下注金额 -->
      <div class="flex my-[12rem] items-center justify-between">
        <label class="text-[16rem] lottery-5d-text mr-[40rem]">{{ $$t('金额') }}</label>
        <component
          :is="InputSelectComponent"
          v-model="amount"
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

      <!-- 快捷金额 -->
      <!-- <div class="flex  justify-between mt-[4rem] mb-[15rem]">
        <span class="lottery-5d-text text-[16rem] leading-[28rem]">{{ $$t('金额') }}</span>
        <div class="flex">
          <div
            v-for="num in data.price" :key="num"
            class=" ml-[6rem] px-[8rem] h-[28rem] flex items-center justify-center rounded-[4rem] text-[16rem] "
            :class="amount === num ? 'bg-[#47BA7C] lottery-5d-text2' : 'bg-[#EBEBEB] text-[#0D2245]'"
            @click="onAmountClick(num)"
          >
            {{ num }}
          </div>
        </div>
      </div> -->
      <!-- 数量 -->
      <!-- <div class="flex  justify-between  mb-[15rem]">
        <span class="lottery-5d-text text-[16rem] leading-[28rem]">{{ $$t('倍数') }}</span>
        <div class="flex">
          <div
            class="w-[28rem] h-[28rem] lottery-5d-text2 text-[25rem] flex  justify-center bg-[#47BA7C] rounded-[6rem]"
            @click="decrease"
          >
            <span class="leading-[25rem]">-</span>
          </div>
          <input
            id="" v-model.number="currentMultiply"
            class="inline-block mx-[6rem] w-[79rem] border-[1rem] border-solid border-[#EBEBEB] text-[#0D2245] text-[15rem] text-center rounded-[6rem]"
            type="number" inputmode="numeric" name=""
          >
          <div
            class="w-[28rem] h-[28rem] lottery-5d-text2 text-[25rem] flex  justify-center bg-[#47BA7C] rounded-[6rem]"
            @click="increase"
          >
            <span class="leading-[25rem]">+</span>
          </div>
        </div>
      </div> -->
      <!-- 倍数 -->
      <!-- <div class="flex justify-end mb-[15rem]">
        <div
          v-for="item of multiplyArr" :key="item" class="px-[8rem] last:mr-0 text-[16rem] rounded-[6rem] mr-[6rem]"
          :class="currentMultiply === item ? 'bg-[#47BA7C] lottery-5d-text2' : 'bg-[#ebebeb] text-[#0D2245]'"
          @click="changeCurrentMultiply(item)"
        >
          <span class="leading-[28rem] text-[16rem]">X{{ item }}</span>
        </div>
      </div> -->

      <h4 class="flex items-center h-[28rem] text-[12rem] font-[500]">
        <LotteryCheckBox v-model="isCheck" class="mr-[14rem]" />
        <span class="leading-[28rem] lottery-5d-text3">{{ $$t('我同意') }}
          <span class="lottery-5d-text4 leading-[28rem] cursor-pointer" @click="isShowRules = true">
            《{{ $$t('预售规则') }}》
          </span>
        </span>
      </h4>
    </div>

    <!-- 取消、下注 -->
    <div class="w-full h-[36rem] flex text-[14rem] font-[500]">
      <div class="w-1/3 text-center leading-[36rem] lottery-5d-bg2 lottery-5d-text" @click="emit('close')">
        {{ $$t('取消') }}
      </div>
      <div
        class="flex-1 text-center lottery-5d-text2 leading-[36rem] lottery-5d-bg1"
        @click="onBet"
      >
        {{ $$t('立即投注') }}
      </div>
    </div>

    <LotteryDialog v-model="isShowRules" :close-text="$$t('我知道')" :title="$$t('预售规则')" :max-size="[264, 371]" :project="project">
      <AppPreSaleRules />
    </LotteryDialog>
  </div>
</template>

<style lang='scss' scoped>

</style>
