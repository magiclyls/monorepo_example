<script setup lang='ts'>
import type { CurrencyCode } from '@tg/types'
import { ApiExchangeRateFromTo, ApiMemberRebateSum } from '@tg/apis'
import { AfunBaseAmount, AfunBaseButton, AfunBaseImage } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { useAppStore, useCurrency } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { add, appEventBus, mul } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppSpinLoading from '~/components/AppSpinLoading.vue'

defineOptions({ name: 'AppRebateCenterBanner' })
defineProps<{ showRebateBtn: boolean }>()
const emit = defineEmits(['openReceive'])

const router = useRouter()
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const {
  bool: amountLoading,
  setTrue: amountLoadingTrue,
  setFalse: amountLoadingFalse,
} = useBoolean(false)

const expectAmount = ref(0)

const { runAsync: runAsyncRebateSum } = useRequest(ApiMemberRebateSum, {
  onBefore() {
    isLogin.value ? amountLoadingTrue() : amountLoadingFalse()
    expectAmount.value = 0
  },
  onSuccess(res) {
    if (res && res.length > 0) {
      // 相同币种的分组
      const allArr = res.reduce((acc, item) => {
        const currencyId = item.currency_id
        const rebate = Number.parseFloat(item.rebate_amount)

        if (!acc[currencyId])
          acc[currencyId] = 0

        acc[currencyId] += rebate

        return acc
      }, {} as Record<CurrencyCode, number>)

      const grouped = (Object.entries(allArr) as [CurrencyCode, number][]).map(([currency_id, total_rebate]) => ({
        currency_id,
        total_rebate,
      }))
      // 当前货币
      const arrCurrentCur = grouped.filter(a => a.currency_id === currentGlobalCurrencyMap.value.cur)
      // 其他货币
      const arrExceptCurrentCur = grouped.filter(a => a.currency_id !== currentGlobalCurrencyMap.value.cur)

      if (arrCurrentCur.length > 0)
        expectAmount.value = arrCurrentCur[0].total_rebate

      if (arrExceptCurrentCur.length > 0) {
        const arrPromise = arrExceptCurrentCur.map((a) => {
          return getRateAndCalculate(a)
        })

        Promise.allSettled(arrPromise).then((result) => {
          const arr = result.filter(a => a.status === 'fulfilled').map(a => a.value)
          const total = arr.reduce((acc, item) => {
            return Number.parseFloat(add(acc, item))
          }, 0)

          expectAmount.value = Number.parseFloat(add(expectAmount.value, total))
          amountLoadingFalse()
        })
      }
      else {
        amountLoadingFalse()
      }
    }
    else {
      amountLoadingFalse()
    }
  },
})

// 领取返水
function rebateHandler() {
  emit('openReceive')
}
// 获取汇率并计算返水
function getRateAndCalculate(item: {
  currency_id: CurrencyCode
  total_rebate: number
}) {
  return new Promise<number>((resolve) => {
    ApiExchangeRateFromTo({ from: item.currency_id, to: currentGlobalCurrencyMap.value.cur }).then((rateData) => {
      const amount = Number.parseFloat(mul(item.total_rebate, Number.parseFloat(rateData[item.currency_id])))
      resolve(amount)
    }).catch(() => {
      resolve(0)
    })
  })
}

function eventBusGetData() {
  runAsyncRebateSum()
}

watch(currentGlobalCurrencyMap, () => {
  runAsyncRebateSum()
})

onMounted(() => {
  appEventBus.on(EventBusNames.GET_TIIMEREBATE_SUCCESS, eventBusGetData)
  // 检查登录状态，只有已登录时才执行
  if (isLogin.value) {
    runAsyncRebateSum()
  }
})
onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.GET_TIIMEREBATE_SUCCESS, eventBusGetData)
})
</script>

<template>
  <div class="default-card">
    <div class="flex items-center">
      <div class="mr-[18px] w-[44px]">
        <AfunBaseImage url="/m/afun-h5/png/vip-img3.png" />
      </div>
      <div>
        <span class="text-[14px] font-[600] text-[#B1BAD3] mb-[2px]">
          {{ t('预期返水') }}
        </span>
        <div class="h-[25px] flex items-center mt-[2px]">
          <AppSpinLoading v-if="amountLoading" />
          <AfunBaseAmount v-else :amount="expectAmount" :currency-type="currentGlobalCurrencyMap.type" style="--afun-app-amount-font-weight: 500; color: #fff" />
        </div>
      </div>
    </div>
    <AfunBaseButton v-if="!isLogin" class="mt-[12px] h-[44px]" style="--afun-base-button-font-weight: 500" bg-style="secondary" @click="router.push('/login')">
      {{ t('立即登录') }}
    </AfunBaseButton>
    <AfunBaseButton v-else-if="showRebateBtn" class="mt-[12px] h-[44px]" style="--afun-base-button-font-weight: 500" bg-style="secondary" @click="rebateHandler">
      {{ t('领取返水') }}
    </AfunBaseButton>
  </div>
</template>

<style lang='scss' scoped>
.default-card {
  width: 100%;
  border-radius: 8px;
  /* background: linear-gradient(98deg, #00d4f0 4.29%, #0089ce 99.1%); */
  background: #213743;
  // color: #fff;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  display: flex;
  flex-direction: column;
  padding: 16px 13px 10px;
  --afun-base-amount-font-size: 18px;
  --afun-app-currency-icon-size: 18px;

  h6 {
    color: #c7f8ff;
  }
}
</style>
