<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'

import type { CurrencyData } from '~/composables/useCurrencyData'
import { ApiMemberInterestConfig } from '@tg/apis'

// const AppSafeDialog = defineAsyncComponent(() => import('./AppSafeDialog.vue'))

defineOptions({
  name: 'AppVaultDescription',
})

const props = withDefaults(defineProps<{
  needAwait: boolean
}>(), {
  needAwait: true,
})

const { t } = useI18n()

const appStore = useAppStore()
const { currentGlobalCurrency, isLogin } = storeToRefs(appStore)
const { isMobile } = useWindowStore()

const _curGlobalCurrency = computed(() => isLogin.value ? currentGlobalCurrency.value : appStore.getLanguageCurrency())

const currentGlobalCurrencyCode = computed(() => currencyConfig[_curGlobalCurrency.value].cur)
const { data, runAsync: runAsyncInterestConfig } = useRequest(ApiMemberInterestConfig, {
  debounceInterval: 1000,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
})
const rate = computed(() => data.value?.rate)
const rule = computed(() => data.value?.rule)
const { runAsyncFrontLang } = useFrontLang()
const localCurrency = ref<EnumCurrencyKey>()

const minDepositAmount = computed(() => {
  if (rate.value)
    return rate.value.min_deposit // data.value.find(a => a.currency_name === curType.value)?.min_deposit ?? 0

  return 0
})
const interestRate = computed(() => {
  if (rate.value)
    return rate.value.interest_rate // data.value.find(a => a.currency_name === curType.value)?.interest_rate ?? 0
  return 0
})
const billTime = computed(() => {
  if (rate.value && rate.value.bill_time) {
    const _billTime = +(rate.value.bill_time || 0) // 秒
    const hour = Math.floor(_billTime / 60 / 60)
    const day = Math.floor(hour / 24)

    if (hour < 24)
      return t('time_hour', { delta: hour })

    return t('quantos_dias', { delta: day })
  }

  return 0
})

const detailTitle = computed(() => {
  if (rule.value) {
    return rule.value.detail.split(/[\r\n]+/).map((item) => {
      const detail = { title: item.split('：')[0].trim(), content: item.split('：')[1] }
      console.log(detail)
      return detail
    })
  }
  return null
})

const renderCurrency = computed(() => {
  if (localCurrency.value)
    return localCurrency.value

  return _curGlobalCurrency.value
})

function changeCurrency(item: CurrencyData) {
  const config = getCurrencyConfig(_curGlobalCurrency.value)
  item = item ?? { type: _curGlobalCurrency.value, balance: '0.00', balanceWithSymbol: '0.00', cur: config.cur, prefix: config.prefix } as CurrencyData
  localCurrency.value = item?.type
  runAsyncInterestConfig({ cur: item.cur })
}

watch(currentGlobalCurrencyCode, (val) => {
  localCurrency.value = getCurrencyConfigByCode(val).name
  console.log('currentGlobalCurrencyCode', val)
  runAsyncInterestConfig({ cur: val })
})

onMounted(() => {
  if (!props.needAwait) {
    runAsyncInterestConfig({ cur: currentGlobalCurrencyCode.value })
    runAsyncFrontLang('vault_des')
  }
})

if (props.needAwait)
  await application.allSettled([runAsyncInterestConfig({ cur: currentGlobalCurrencyCode.value }), runAsyncFrontLang('vault_des')])
</script>

<template>
  <div class="text-tg-text-white mx-auto max-w-[650px] pt-[16px]">
    <AppSafeDialog :show-bottom="false" :need-await="false" @change="changeCurrency" />
    <!-- <component :is="AppSafeDialog" :show-bottom="false" :need-await="false" @change="changeCurrency" /> -->
    <hr class="hr-coustomer mx-auto max-w-[650px]">
  </div>

  <div
    class="mx-auto max-w-[650px] select-none @md:my-[16px] @md:rounded-[8px] @md:p-[20px] @md:pb-[24px]" :class="{
      'bg-rule-h5': isMobile,
      'bg-rule-pc': !isMobile,
    }"
  >
    <div class="text-tg-text-white mt-[10px] text-center text-[28px] font-semibold">
      {{ t('vault_rules') }}
    </div>
    <div class="scroll-x">
      <div
        class="rate-value-table bg-container flex whitespace-nowrap px-[2px] pb-[5px] pt-[10px]" :class="{
          'bg-container-h5': isMobile,
          'bg-container-pc': !isMobile,
        }"
      >
        <div class="text-tg-secondary-light desc-item w-fit shrink-0 whitespace-nowrap text-center text-[14px] font-semibold leading-[20px]">
          <p class="theme-title px-[12px] py-[19px]">
            {{ $t('currency_type') }}
          </p>
          <div class="theme-text bg-tg-secondary-grey h-[48px] flex items-center justify-center px-[12px] @md:px-[15px]">
            <span><AppCurrencyIcon show-name :currency-type="renderCurrency" /></span>
          </div>
        </div>
        <div class="text-tg-secondary-light desc-item w-fit flex-1 shrink-0 whitespace-nowrap text-center text-[14px] font-semibold leading-[20px]">
          <p class="theme-title px-[12px] py-[19px]">
            {{ $t('min_deposit_amount') }}
          </p>
          <div class="bg-tg-secondary-grey theme-text h-[48px] flex items-center justify-center px-[12px] @md:px-[15px]">
            {{ minDepositAmount ? minDepositAmount : '-' }}
          </div>
        </div>
        <div class="text-tg-secondary-light desc-item w-fit flex-1 shrink-0 whitespace-nowrap text-center text-[14px] font-semibold leading-[20px]">
          <p class="theme-title px-[12px] py-[19px]">
            {{ $t('billing_cycle') }}
          </p>
          <div class="bg-tg-secondary-grey theme-text h-[48px] flex items-center justify-center px-[12px] @md:px-[15px]">
            {{ billTime ? billTime : '-' }}
          </div>
        </div>
        <div class="text-tg-secondary-light desc-item w-fit flex-1 shrink-0 whitespace-nowrap text-center text-[14px] font-semibold leading-[20px]">
          <p class="theme-title px-[12px] py-[19px]">
            {{ $t('annual_interest_rate') }}
          </p>
          <div class="bg-tg-secondary-grey theme-text h-[48px] flex items-center justify-center px-[12px] @md:px-[15px]">
            {{ interestRate ? `${application.numberToLocaleString(+interestRate)}%` : '-' }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="rule && rule.detail.length && rate" class="px-[2px] pb-[24px] @md:pb-0">
      <BaseRichArea v-if="+rule.rule_type === 2" :content="rule.detail" />
      <!-- <AppPromotionBaseRuleText v-else :content="rule.detail" :currency-type="_curGlobalCurrency" :amount="rate?.min_deposit" /> -->
      <template v-else>
        <div v-for="item of detailTitle" :key="item.title" class="rate-value-rule flex flex-col items-start justify-start text-[var(--tg-secondary-light)]" @click="() => console.log(detailTitle)">
          <div class="text-tg-text-white theme-describe-title mb-[7px] mt-[16px] text-[20px] font-semibold leading-[28px]">
            {{ item.title }}
          </div>
          <ul class="list-disc pl-[16px]">
            <li class="theme-describe-detail text-cont w-full text-[14px] font-medium leading-[1.5]">
              {{ item.content }}
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.btn-box {
  --tg-base-button-padding-y: 11px;
  --tg-base-button-padding-x: 11px;
  --tg-base-button-style-bg: var(--tg-secondary-dark);
  --tg-base-button-style-bg-hover: var(--tg-secondary-dark);
}
.hr-coustomer {
  height: 2px;
  border: none;
  background-color: #304454;
  margin-top: 2px;
  margin-bottom: 16px;
  @include webTheme('green') {
    background-color: var(--tg-border-color-grey);
  }
  @include webTheme('white') {
    background-color: #c1c1c1;
  }
}
.desc-content {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
  }
}
.theme-title {
  @include webTheme('green') {
    color: var(--tg-text-white);
  }
  @include webTheme('white') {
    color: #111;
  }
}
.theme-text {
  @include webTheme('green') {
    color: #ffaa09;
  }
  @include webTheme('white') {
    color: #555;
  }
}
.theme-describe-title {
  @include webTheme('green') {
    color: var(--tg-text-green-main);
  }
}
.theme-describe-detail {
  @include webTheme('green') {
    color: var(--tg-text-lightgrey);
  }
}
.bg-container-h5 {
  @include webTheme('green') {
    --tg-secondary-grey: #055434;
  }
  @include webTheme('white') {
    --tg-secondary-grey: #f5f5f5;
  }
}
.bg-container-pc {
  @include webTheme('green') {
    --tg-secondary-grey: #055434;
  }
  @include webTheme('white') {
    --tg-secondary-grey: #f5f5f5;
  }
}
.bg-rule-h5 {
  @include webTheme('green') {
    --tg-secondary-dark: #076237;
  }
}
.bg-rule-pc {
  @include webTheme('green') {
    --tg-secondary-grey: #055434;
  }
}
.bg1 {
  background-color: var(--tg-secondary-dark);

  /*  @include webTheme('white'){
    background-color: #e8e8e8;
  } */
}
.text-cont {
  color: var(--tg-text-lightgrey);
  @include webTheme('white') {
    color: #555;
    font-weight: 400;
  }
}
.list-disc {
  @include webTheme('green') {
    --tg-text-lightgrey: #76f0c5;
    list-style: none;
  }
}
.rate-value-table {
  @include webTheme('green') {
    --tg-text-white: #3cb389;
    .theme-text {
      color: #fff;
    }
    .desc-item:last-of-type {
      .theme-text {
        border-radius: 0 4px 4px 0;
      }
    }
    .desc-item:first-of-type {
      .theme-text {
        border-radius: 4px 0 0 4px;
      }
    }
  }
}
.rate-value-rule {
  @include webTheme('green') {
    --tg-text-green-main: var(--tw-ring-offset-color);
  }
}
</style>
