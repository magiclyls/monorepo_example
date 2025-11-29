<script lang="ts" setup>
import type { CurrencyCode } from '~/composables/useCurrencyData'

import { ApiMemberVipBonusApply, ApiMemberVipBonusApplyAll, ApiMemberVipBonusAvailable } from '@tg/apis'

interface Props {
  /** 奖金金额 */
  // vipBonus?: string
  /** 奖金id，-1表示晋级奖金，无值表示累计奖金 */
  vipBonusId?: string
  /** 奖金类型 */
  bonusType?: string
  /** 币种 */
  currencyId?: CurrencyCode
}
defineOptions({
  name: 'AppVipBonusDialog',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })
const { t } = useI18n()
const { openNotify } = useNotify()
const { userLanguage } = useLanguageStore()
const amountMax = ref(application.formatNumDecimal(0, currencyConfig.USDT.decimal))
const {
  isVipDayBonusOpen,
  isVipWeekBonusOpen,
  isVipMonthBonusOpen,
} = storeToRefs(useAppStore())
const {
  value: amount,
  setValue: setAmount,
  resetField: resetAmount,
  errorMessage: amountMsg,
  validate: valiAmount,
//   resetField: amountReset,
} = useField<string>('amount', (value) => {
  if (!value)
    return t('input_amount')
  else if (Number(value) === 0)
    return t('validate_deposit_amount_zero')
  else if (Number(value) < 0)
    return t('validate_deposit_amount_pos')
  else if (value && Number(value) > Number(amountMax.value))
    return t('validate_deposit_amount_max')
  return ''
})

const amountRef = ref()
const activeCurrency = ref(getCurrencyConfigByCode(props.currencyId ?? '706'))// ref(currencyConfig[currentGlobalCurrency.value])

const {
  runAsync: runAsyncVipBonusApply,
  loading: loadVipBonusApply,
} = useRequest(ApiMemberVipBonusApply)

const { run: runVipBonusApplyAll, loading: loadApplyAll } = useRequest(ApiMemberVipBonusApplyAll, {
  onSuccess(data) {
    closeDialog()
  },
})
const typeVal = ref('vip')
const options = ref([
  { label: t('finance_other_tab_all'), value: 'vip' },
  isVipDayBonusOpen.value ? { label: t('vip_day_salary_bonus'), value: '819' } : undefined,
  isVipWeekBonusOpen.value ? { label: t('vip_week_salary_bonus'), value: '820' } : undefined,
  isVipMonthBonusOpen.value ? { label: t('vip_month_salary_bonus'), value: '821' } : undefined,
].filter(a => a !== void 0))
// const { runAsync: runAsyncVipPrizeConfig } = useRequest(ApiMemberVipPrizeConfig, {
//   onSuccess(data) {
//     if (data) {
//       const nav = data.nav
//       const _options: {
//         [t: string]: { label: string; value: string }
//       } = {
//         819: { label: t('vip_day_salary_bonus'), value: '819' },
//         820: { label: t('vip_week_salary_bonus'), value: '820' },
//         821: { label: t('vip_month_salary_bonus'), value: '821' },
//       }
//       for (const key in nav) {
//         if (nav[key] && _options[key])
//           options.value.push(_options[key])
//       }
//     }
//   },
// })

const { runAsync: runAsyncGetPromoBonus, data: lvPromoBonus, loading: loadLvPromoBonus }
  = useRequest(ApiMemberVipBonusAvailable, {
    onSuccess(data) {
      if (props.vipBonusId) { // 处理晋级奖金
        options.value = data?.map((item) => {
          return {
            label: `VIP${item.vip}`,
            value: item.id,
            // ...item,
          }
        }) ?? []
        options.value.unshift({ label: t('vip_promotion_bonus'), value: '-1' })
        if (props.vipBonusId) // 第一次打开是全部，需要从新计算金额
          selectTypeChange('-1')
      }
      else { // 处理累积奖金
        const item = (data && data?.length) ? data[0] : null
        if (!item || item.state === 2) {
          amountMax.value = application.formatNumDecimal(0, currencyConfig.USDT.decimal)
          setAmount(amountMax.value, false)
        }
        else {
          let amount = 0
          if (typeVal.value === 'vip') { //  累积奖金全部领取
            amount = Number(data)
          }
          else {
            amount = Number(sub(Number(item.amount), Number(item.receive_amount)))
          }
          amountMax.value = application.formatNumDecimal(amount, currencyConfig.USDT.decimal)
          setAmount(amountMax.value)
        }
      }
    },
  })

// 奖金类型切换
function selectTypeChange(val: string) {
  typeVal.value = val
  if (props.vipBonusId) { // 晋级奖金
    let amount = 0
    if (val !== '-1') {
      const item = lvPromoBonus.value?.find(t => t.id === val)
      amount = Number(sub(Number(item?.amount), Number(item?.receive_amount)))
    }
    else { // 全部领取
      amount = lvPromoBonus.value?.reduce((total, item) => Number(add(total, Number(sub(Number(item.amount), Number(item.receive_amount))))), 0) ?? 0
    }
    amountMax.value = application.formatNumDecimal(amount, currencyConfig.USDT.decimal)
    resetAmount()
    setAmount(amountMax.value, false)
  }
  else { // 日周月奖金
    runAsyncGetPromoBonus(typeVal.value === 'vip'
      ? ({
          flag: 'vip',
          cur: activeCurrency.value.cur,
        })
      : ({
          cash_type: typeVal.value,
          cur: activeCurrency.value.cur,
        }))
  }
}

async function submitBonus() {
  if (amountRef.value)
    amountRef.value.setTouchTrue()
  await valiAmount()
  if (!amountMsg.value) {
    if (typeVal.value !== '-1') {
      if (typeVal.value === 'vip') { // 累积奖金全部领取
        runVipBonusApplyAll({ cur: activeCurrency.value?.cur ?? '', flag: '' })
      }
      else {
        runAsyncVipBonusApply({
          id: props.vipBonusId ? typeVal.value : ((lvPromoBonus.value && lvPromoBonus.value[0].id) ?? ''),
          cur: activeCurrency.value?.cur ?? '',
          amount: amount.value,
        }).then((data) => {
          closeDialog()
        })
      }
    }
    else { // 晋级奖金全部领取
      runVipBonusApplyAll({ cur: activeCurrency.value?.cur ?? '', flag: 'upgrade' })
    }
  }
  else { // 金额为0提示
    openNotify({
      title: t('warm_tip'),
      icon: 'uni-record-warn',
      message: t('currently_no_have_bonus_claim'),
    })
  }
}
function amountBlur() {
  if (Number(amount.value) > Number(amountMax.value))
    setAmount(amountMax.value)
}

await application.allSettled(
  [
    // props.vipBonusId ? new Promise((resolve) => { resolve(true) }) : runAsyncVipPrizeConfig({ cur: activeCurrency.value.cur }),
    runAsyncGetPromoBonus(props.vipBonusId === '-1'
      ? ({ cash_type: props.bonusType ?? typeVal.value, cur: activeCurrency.value.cur })
      : ({ flag: 'vip', cur: activeCurrency.value.cur })),
  ],
)
</script>

<template>
  <div class="app-receive-bonus px-[16px] pb-[32px]" :class="[userLanguage === 'th-TH' ? 'pt-[6px]' : 0]">
    <BaseLabel
      :label="$t('activity_bonus')"
      :style="{ '--tg-base-input-right-button-padding': vipBonusId ? '' : '0 0' }"
    >
      <BaseInput ref="amountRef" v-model="amount" class="theme-input" type="number" disabled msg-after-touched @blur="amountBlur">
        <template #right-button>
          <div v-if="vipBonusId" class="center">
            <AppCurrencyIcon :currency-type="activeCurrency.name" />
            <span class="ml-[4px]">{{ $t('vip_promotion_bonus') }}</span>
          </div>
          <BaseSelect
            v-else
            class="theme-select" :model-value="typeVal" popper plain-popper-label :options="options"
            @select="selectTypeChange"
          >
            <template #label="{ data }">
              <div class="center">
                <AppCurrencyIcon :currency-type="activeCurrency.name" />
                <span class="ml-[4px]">{{ data?.label }}</span>
              </div>
            </template>
            <template #option="{ data: { item } }">
              <div class="center">
                <AppCurrencyIcon :currency-type="activeCurrency.name" />
                <span class="ml-[4px]">{{ item.label }}</span>
              </div>
            </template>
          </BaseSelect>
        </template>
      </BaseInput>
    </BaseLabel>
    <!-- <div>
      <div class="top-label">
        <span>{{ $t('exchange') }}({{ activeCurrency?.type }})</span>
        <span>{{ $t('rate') }}: {{ rate }}</span>
      </div>
      <BaseInput v-model="targetAmount" :msg="targetAmountMsg" type="number" msg-after-touched disabled>
        <template #right-button>
          <AppSelectCurrency :type="3" :show-balance="false" placeholder="search" @change="changeCurrency" />
        </template>
      </BaseInput>
    </div> -->
    <BaseButton
      bg-style="primary" size="md" :loading="loadVipBonusApply || loadLvPromoBonus || loadApplyAll"
      @click="submitBonus"
    >
      {{ $t('receive') }}
    </BaseButton>
    <!-- <div class="tips">
      {{ $t('vip_collection_instructions') }}
    </div> -->
  </div>
</template>

<style>
[theme='green'] {
  --tg-popper-color-default: #02432d;
}
</style>

<style lang="scss" scoped>
.app-receive-bonus {
  display: flex;
  flex-direction: column;
  --tg-app-select-currency-bg: none;
  // --tg-base-input-right-button-padding: 0 0;
  --tg-base-select-hover-bg-color: none;
  --tg-base-select-popper-style-padding-y: 11.5px;
  // --tg-app-select-currency-padding-x: 0;
  // --tg-app-select-currency-padding-y: 0;
  // gap: var(--tg-spacing-14);
  font-size: var(--tg-font-size-default);
  color: var(--tg-text-lightgrey);
  > *:not(:last-child) {
    margin-bottom: var(--tg-spacing-14);
  }

  .top-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .tips {
    font-size: var(--tg-font-size-xs);
    font-weight: var(--tg-font-weight-semibold);
    text-align: left;
    line-height: 1.4;
  }
  @include webTheme('green') {
    --tg-box-shadow: none;
    --tg-base-input-style-border: 1px solid #197b59;
    --tg-base-input-right-button-bg: #197b59;
    --tg-base-input-style-background-color: #02432d;
    --tg-base-input-style-box-opacity: 1;
  }
  @include webTheme('white') {
    --tg-base-label-title-color: #111;
    --tg-base-input-style-text-color: #ffaa09;
    --tg-base-input-style-box-opacity: 1;
  }
  .theme-input {
    --tg-base-input-right-button-hover-bg: #304553;
    @include webTheme('green') {
      --tg-base-input-right-button-hover-bg: #197b59;
    }
    @include webTheme('white') {
      --tg-base-input-right-button-hover-bg: #e3e3e3;
    }
  }
  .theme-select {
    --tg-base-select-popper-label-hover-bg-color: #304553;
    @include webTheme('green') {
      --tg-body-bg: #197b59;
      --tg-base-select-popper-label-hover-bg-color: #197b59;
    }
    @include webTheme('white') {
      --tg-base-select-popper-label-hover-bg-color: #e3e3e3;
    }
  }
}
</style>
