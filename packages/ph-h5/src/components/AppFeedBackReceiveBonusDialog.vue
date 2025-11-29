<script lang="ts" setup>
import type { FeedBackItem } from '@tg/stores'
import type { CurrencyData, EnumCurrencyKey } from '@tg/types'
import { ApiExchangeRateFromTo, ApiMemberApplyVipBonus, ApiMemberFeedbackBonusDraw } from '@tg/apis'
import { PhBaseAmount, PhBaseButton, PhBaseCurrencyIcon, PhBaseSelectCurrency } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniArrowDown1 } from '@tg/icons'
import { useAppStore, useChatStore, useCurrency } from '@tg/stores'
import { mul, scientificToString, toFixed } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, inject, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { Message } from '~/utils'

interface Props {
  feedBackItem?: FeedBackItem
  totalBonus?: string
  vipBonus?: string
  vipBonusId?: string
}
defineOptions({
  name: 'AppFeedBackReceiveBonusDialog',
})
const props = defineProps<Props>()

const emit = defineEmits(['confirm', 'claimSuccess'])

const closeDialog = inject('closeDialog', () => {})

const { t } = useI18n()
const appStore = useAppStore()
const chatStore = useChatStore()
const currencyStore = useCurrency()
const { currencyList } = storeToRefs(currencyStore)
const currentNetwork = ref('')
const { bool: isMenuShown } = useBoolean(false)
const activeCurrency = ref<CurrencyData | null>()
const rate = ref('0')
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const currentGlobalCurrency = computed(() => currentGlobalCurrencyMap.value.type)
const { runAsync: runGetReateFromTo } = useRequest(ApiExchangeRateFromTo, {
  onSuccess(res, params) {
    const code = params[0].from
    rate.value = scientificToString(toFixed(res[code], 8))
  },
})

const money = computed(() =>
  props.feedBackItem?.amount ?? props.totalBonus ?? props.vipBonus ?? '0')
const ratedMoney = computed(() => {
  if (rate.value && activeCurrency.value)
    return mul(+money.value, +rate.value)
  return +money.value
})

const { run: runDrawBonus, loading } = useRequest(ApiMemberFeedbackBonusDraw, {
  onSuccess: () => {
    if (props.feedBackItem)
      chatStore.setFeedbackItem({ ...props.feedBackItem, bonusState: 2 })
    Message.success(t('领取成功'))
    currencyStore.initCurrencyList()
    closeDialog()
    emit('claimSuccess')
  },
})

const { run: runDrawVipBonus, loading: vipLoading } = useRequest(ApiMemberApplyVipBonus, {
  onSuccess: () => {
    Message.success(t('领取成功'))
    currencyStore.initCurrencyList()
    closeDialog()
    emit('claimSuccess')
  },
})

function receiveBonus() {
  emit('confirm')
  if (props.feedBackItem
    && props.feedBackItem.bonusState === 1
    && props.feedBackItem.feed_id
    && !loading.value) {
    runDrawBonus({ feed_id: props.feedBackItem.feed_id, cur: activeCurrency.value?.cur ?? '706' })
  }

  else if (props.totalBonus && +props.totalBonus > 0) {
    runDrawBonus({ feed_id: '', cur: activeCurrency.value?.cur ?? '706' })
  }

  else if (props.vipBonus) {
    runDrawVipBonus({ cur: activeCurrency.value?.cur ?? '706', id: props.vipBonusId ?? '' })
  }
}

function changeCurrency(item: CurrencyData, network: string) {
  activeCurrency.value = item
  currentNetwork.value = network
}

watch(activeCurrency, (a) => {
  if (a)
    runGetReateFromTo({ from: '706', to: a.cur })
}, { immediate: true })

onMounted(() => {
  runGetReateFromTo({ from: '706', to: currentGlobalCurrencyMap.value.cur })
})
</script>

<template>
  <div class="p-[16rem]">
    <div class="choose-label mb-[16rem] flex gap-[6rem] leading-[20rem]">
      <div class="flex">
        <span class="text-[#F23038] font-[600]">{{ money }}</span>
        <div class="w-[14rem] h-[20rem] flex  flex-none ml-[6rem]">
          <PhBaseImage url="/ph-h5/png/coin-usdt.png" />
        </div>
      </div>
      <span class="text-[#6D7693] font-[500]">{{ t('您可以自由选择您想要的币种进行领取') }}</span>
    </div>
    <div class="flex gap-[8rem] mb-[16rem] items-center">
      <PhBaseSelectCurrency :options="currencyList" class="pr-[10rem]" :t="t" :currency="activeCurrency?.cur" @choose="changeCurrency">
        <div class="flex items-center justify-center bg-[#fff] px-[10rem] mr-[-12rem] rounded-[6rem] h-[42rem] border border-[#EBEBEB]">
          <PhBaseCurrencyIcon :currency-type="(activeCurrency?.type || currentGlobalCurrency) as EnumCurrencyKey" show-name style="--ph-app-currency-icon-size: 14rem; --ph-app-currency-name-weight: 500" />
          <div class="flex items-center ml-[6rem] mr-[5rem]">
            <IconUniArrowDown1 v-if="currencyList.length > 1" class="text-[#9dabc9]" :class="isMenuShown ? 'rotate-[-180deg]' : ''" />
          </div>
        </div>
      </PhBaseSelectCurrency>
      <div class="text-[#0D2245] font-[600]">
        {{ t('当前汇率') }}：{{ rate }}
      </div>
    </div>
    <div v-if="activeCurrency" class="mb-[16rem] text-[#0D2245] font-[600] flex justify-center">
      {{ t('预计可领取') }}：
      <span class="text-[#F23038]">
        <PhBaseAmount :amount="`${ratedMoney}`" :currency-type="activeCurrency?.type" />
      </span>
    </div>
    <div class="flex justify-between">
      <PhBaseButton class="w-[150rem]" type="secondary" style="--ph-base-button-border-color: #F23038; --ph-base-button-secondary-background-color: rgba(242, 48, 56, 0.08); --ph-base-button-secondary-text-color: #F23038" @click="closeDialog">
        {{ t('取消') }}
      </PhBaseButton>
      <PhBaseButton
        class="w-[150rem]"
        type="primary"
        :loading="loading || vipLoading"
        @click="receiveBonus"
      >
        {{ t('确认领取') }}
      </PhBaseButton>
    </div>
  </div>
</template>
