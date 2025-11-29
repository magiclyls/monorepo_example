<script lang="ts" setup>
import { ApiAgencyTransferToMember, ApiMemberBalanceAgency } from '@tg/apis'

defineOptions({
  name: 'AppCommissionHolder',
})
// const { openAgentGradeDialog } = useDialogAgentGrade()
// const { openAgentCommissionDrawDialog } = useDialogAgentCommissionDraw()
const { t } = useI18n()
const { openNotify } = useNotify()
const appStore = useAppStore()
const {
  renderCurrencyList,
} = useCurrencyData()
const {
  data: balanceAgency,
  runAsync: getBalanceAgency,
} = useRequest(ApiMemberBalanceAgency)
const {
  run: runTransferToMember,
  loading: loadTransferToMember,
} = useRequest(ApiAgencyTransferToMember, {
  onSuccess() {
    openNotify({
      title: t('finance_funds_transfer_commission_withdraw'),
      icon: 'navbar-wallet-notify',
      message: t('commission_draw_success'),
    })
    appStore.getBalanceData()
    getBalanceAgency()
  },
})

const currencyList = computed(() => {
  const arr1 = renderCurrencyList.value.filter(a => !application.isVirtualCurrency(a.type))
  const arr2 = renderCurrencyList.value.filter(a => application.isVirtualCurrency(a.type))

  return [...arr1, ...arr2]
})

await application.allSettled(
  [
    getBalanceAgency(),
  ],
)
</script>

<template>
  <div class="app-commission-holder commission-wallet">
    <div class="holder-currency">
      <div class="currency-item theme-td">
        <div class="leading-6">
          {{ $t('finance_funds_transfer_sort_available') }}
        </div>
        <div class="leading-6">
          {{ $t('finance_funds_transfer_sort_commission') }}
        </div>
      </div>
      <div v-for="item of currencyList" :key="item.cur" class="currency-item">
        <AppAmount
          :amount="item.balanceWithSymbol"
          :currency-type="item.type"
          style="--tg-app-amount-font-weight:var(--tg-font-weight-normal);color:var(--tg-table-amount-color)"
        />
        <AppAmount
          :amount="balanceAgency ? balanceAgency[item.type] : '0'"
          :currency-type="item.type"
          style="--tg-app-amount-font-weight:var(--tg-font-weight-normal);color:var(--tg-table-amount-color)"
        />
      </div>
    </div>
    <div class="sticky-box">
      <BaseButton
        class="btn-receive"
        :loading="loadTransferToMember"
        bg-style="secondary" size="md"
        @click="runTransferToMember"
      >
        {{ $t('transfer_to_wallet') }}
      </BaseButton>
      <div class="holder-tip leading-4">
        {{ t('after_transfer_withdraw_money') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-commission-holder {
  padding: 0 16px;
  color: var(--tg-text-lightgrey);
  .theme-td {
    @include webTheme('green') {
      color: var(--tg-text-white);
    }
  }
  .holder-currency {
    .currency-item {
      display: grid;
      grid-template-columns: 1fr 1fr;
      justify-items: center;
      padding: 17px 16px;
      border-radius: var(--tg-radius-default);
      line-height: 1.3575;

      &:first-child {
        font-weight: var(--tg-font-weight-semibold);
      }
      &:nth-child(even) {
        background: var(--tg-secondary-grey);
      }
    }
    & > :first-child {
      padding-top: 0;
    }
  }
  .sticky-box {
    position: sticky;
    bottom: 0;
    text-align: center;
    padding: 16px 0 16px;
    background-color: #1a2c37;
    @include webTheme('green') {
      background-color: var(--tg-primary-light);
    }
    @include webTheme('white') {
      background-color: #ffffff;
    }
  }
  .btn-receive {
    max-width: 400px;
    width: 100%;
    @include webTheme('green') {
      --tg-base-button-style-bg: #ffaa09;
      --tg-base-button-style-bg-hover: var(--tg-sub-deepblue);
      --tg-text-dark: var(--tg-text-green-btn);
    }
  }
  .holder-tip {
    font-size: var(--tg-font-size-xs);
    margin-top: 16px;
    font-weight: var(--tg-font-weight-semibold);
    @include webTheme('green') {
      color: var(--tg-text-placeholder);
    }
  }
}
.commission-wallet {
  @include webTheme('green') {
    .currency-item {
      color: var(--tg-text-placeholder);
      --tg-table-amount-color: var(--tg-text-placeholder);
    }
    .btn-receive {
      color: var(--tg-sport-grey-deep);
      --tg-base-button-style-bg: var(--tg-base-button-secondary-bg);
      .holder-tip {
        color: var(--tg-text-placeholder);
      }
    }
  }
}
</style>
