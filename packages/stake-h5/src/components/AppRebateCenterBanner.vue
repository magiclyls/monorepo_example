<script setup lang='ts'>
import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiExchangeRateFromTo, ApiMemberRebateSum } from '@tg/apis'

defineOptions({ name: 'AppRebateCenterBanner' })

defineProps<{ showRebateBtn: boolean }>()

const { t } = useI18n()
const { theme, currentGlobalCurrency } = storeToRefs(useAppStore())
const { openRealTimeRebateDialog } = useDialogRealTimeRebate()
const {
  bool: amountLoading,
  setTrue: amountLoadingTrue,
  setFalse: amountLoadingFalse,
} = useBoolean(false)

const expectAmount = ref(0)

const currentGlobalCurrencyCode = computed(() => getCurrencyConfig(currentGlobalCurrency.value).cur)

const { runAsync: runAsyncRebateSum } = useRequest(ApiMemberRebateSum, {
  onBefore() {
    amountLoadingTrue()
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
      const arrCurrentCur = grouped.filter(a => a.currency_id === currentGlobalCurrencyCode.value)
      // 其他货币
      const arrExceptCurrentCur = grouped.filter(a => a.currency_id !== currentGlobalCurrencyCode.value)

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
  openRealTimeRebateDialog()
}
// 获取汇率并计算返水
function getRateAndCalculate(item: {
  currency_id: CurrencyCode
  total_rebate: number
}) {
  return new Promise<number>((resolve) => {
    ApiExchangeRateFromTo({ from: item.currency_id, to: currentGlobalCurrencyCode.value }).then((rateData) => {
      const amount = Number.parseFloat(mul(item.total_rebate, Number.parseFloat(rateData[item.currency_id])))
      resolve(amount)
    }).catch(() => {
      resolve(0)
    })
  })
}
watch(currentGlobalCurrency, () => {
  runAsyncRebateSum()
})
runAsyncRebateSum()
</script>

<template>
  <!-- 绿 -->
  <div v-if="theme === 'green'" class="green-card">
    <div class="absolute right-[5px] top-[-21px] w-[90px]">
      <BaseImage url="/png/vip-club/img2.png" />
    </div>
    <div>
      <h6>{{ t('vip_expect_rebate') }}</h6>
      <div class="h-[25px] flex items-center">
        <AppSpinLoading v-if="amountLoading" />
        <AppAmount v-else :amount="expectAmount" :currency-type="currentGlobalCurrency" />
      </div>
    </div>

    <BaseButton class="mt-[15px] h-[34px]" bg-style="primary" @click="rebateHandler">
      {{ t('vip_get_rebates') }}
    </BaseButton>
  </div>
  <!-- 白 -->
  <div v-else-if="theme === 'white'" class="white-card">
    <div class="flex items-center">
      <div class="w-[46px]">
        <BaseImage url="/png/vip-club/img4.png" />
      </div>
      <div>
        <h6>
          {{ t('vip_expect_rebate') }}
        </h6>
        <div class="h-[25px] flex items-center">
          <AppSpinLoading v-if="amountLoading" />
          <AppAmount v-else :amount="expectAmount" :currency-type="currentGlobalCurrency" />
        </div>
      </div>
    </div>
    <BaseButton class="mt-[15px] h-[34px]" bg-style="primary" @click="rebateHandler">
      {{ t('vip_get_rebates') }}
    </BaseButton>
  </div>
  <!-- 默认 -->
  <div v-else class="default-card">
    <div class="flex items-center">
      <div class="mr-[18px] w-[44px]">
        <BaseImage url="/png/vip-club/img3.png" />
      </div>
      <div>
        <h6>
          {{ t('vip_expect_rebate') }}
        </h6>
        <div class="h-[25px] flex items-center">
          <AppSpinLoading v-if="amountLoading" />
          <AppAmount v-else :amount="expectAmount" :currency-type="currentGlobalCurrency" />
        </div>
      </div>
    </div>
    <BaseButton v-if="showRebateBtn" class="mt-[12px] h-[34px]" bg-style="secondary" @click="rebateHandler">
      {{ t('vip_get_rebates') }}
    </BaseButton>
  </div>
</template>

<style lang='scss' scoped>
.green-card {
  position: relative;
  background: linear-gradient(277deg, #007948 3.22%, #209465 102.53%), url('/webp/vip-club/green_card_bg.webp');
  background-blend-mode: exclusion;
  background-size: 100%;
  margin-top: 8px;
  width: 100%;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  --tg-app-amount-font-size: 18px;
  --tg-app-currency-icon-size: 18px;
  padding: 16px 13px 10px;
  display: flex;
  flex-direction: column;

  h6 {
    opacity: 0.8;
  }
}

.white-card {
  background: linear-gradient(97deg, #2e2c2d -1.79%, #332d2f 49.26%, #262626 100%),
    url('/webp/vip-club/white_card_bg.webp');
  background-blend-mode: exclusion;
  background-size: 100%;
  width: 100%;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  --tg-app-amount-font-size: 18px;
  --tg-app-currency-icon-size: 18px;
  padding: 12px 13px 10px;
  display: flex;
  flex-direction: column;
}

.default-card {
  width: 100%;
  border-radius: 4px;
  background: #213743;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  display: flex;
  flex-direction: column;
  padding: 16px 13px 10px;
  --tg-app-amount-font-size: 18px;
  --tg-app-currency-icon-size: 18px;
  h6 {
    color: #b1bad3;
  }
}
</style>
