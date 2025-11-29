<script setup lang='ts'>
import type { CurrencyCode } from '@tg/types'
import { ApiExchangeRateFromTo, ApiMemberRebateSum } from '@tg/apis'
import { PhBaseAmount, PhBaseButton, PhBaseImage } from '@tg/bccomponents'
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
      <div class="mr-[18rem] w-[44rem]">
        <PhBaseImage url="/ph-h5/png/vip-img3.png" />
      </div>
      <div>
        <span class="text-[14rem] font-[500] text-[#6D7693] mb-[2rem]">
          {{ t('预期返水') }}
        </span>
        <div class="h-[25rem] flex items-center mt-[2rem]">
          <AppSpinLoading v-if="amountLoading" />
          <PhBaseAmount v-else :amount="expectAmount" :currency-type="currentGlobalCurrencyMap.type" style="--ph-app-amount-font-weight: 500; color: #0D2245" />
        </div>
      </div>
    </div>
    <PhBaseButton v-if="!isLogin" class="mt-[12rem] h-[44rem]" style="--ph-base-button-font-weight: 500" bg-style="secondary" @click="router.push('/login')">
      {{ t('立即登录') }}
    </PhBaseButton>
    <PhBaseButton v-else-if="showRebateBtn" class="mt-[12rem] h-[44rem]" style="--ph-base-button-font-weight: 500" bg-style="secondary" @click="rebateHandler">
      {{ t('领取返水') }}
    </PhBaseButton>
  </div>
</template>

<style lang='scss' scoped>
.default-card {
  width: 100%;
  border-radius: 8rem;
  /* background: linear-gradient(98deg, #00d4f0 4.29%, #0089ce 99.1%); */
  background: #ffffff;
  // color: #fff;
  box-shadow: 0 0 12rem 0 rgba(0, 0, 0, 0.15);
  font-size: 14rem;
  font-weight: 500;
  line-height: 20rem;
  display: flex;
  flex-direction: column;
  padding: 16rem 13rem 10rem;
  --ph-base-amount-font-size: 18px;
  --ph-app-currency-icon-size: 18px;

  h6 {
    color: #c7f8ff;
  }
}
</style>
