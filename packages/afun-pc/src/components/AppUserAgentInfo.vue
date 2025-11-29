<script lang="ts" setup>
import { ApiAgencyCommissionBalance, ApiAgencyTransferToMember } from '@tg/apis'

defineOptions({
  name: 'AppUserAgentInfo',
})
const appStore = useAppStore()
const { t } = useI18n()
const { openNotify } = useNotify()
const { bonus_currency, bonus_limit } = storeToRefs(useAffiliate())
const { isMobile } = storeToRefs(useWindowStore())
// const { openAgentGradeDialog } = useDialogAgentGrade()
// const { openAgentCommissionRecordDialog } = useDialogAgentCommissionRecord()
// // const { openAgentCommissionDrawDialog } = useDialogAgentCommissionDraw()
// const { openCommissionWalletDialog } = useDialogCommissionWallet()

/**
 0 = 隐藏
1 = 显示
 */
// const hideSuper = computed(() => {
//   if (agencyShow.value)
//     return `${agencyShow.value}` === '0'

//   return true
// })

// function openDialog() {
//   openAgentGradeDialog()
// }

const {
  data: balanceAgency,
  runAsync: getBalanceAgency,
} = useRequest(ApiAgencyCommissionBalance)

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

const agencyInfo = computed(() => {
  if (!balanceAgency.value?.balance)
    return '0.00'
  return balanceAgency.value.balance
})

onActivated(() => {
  appStore.updateUserInfo()
})

onMounted(async () => {
  appStore.updateUserInfo()
  await application.allSettled(
    [
      getBalanceAgency(),
    ],
  )
})

// application.allSettled([runGetMemberAgencyShow({ tag: 'agency_show' })])
</script>

<template>
  <div class="app-user-agent-info user-agent-info-sup" :class="{ 'is-mobile': isMobile }">
    <div class="info-box">
      <div class="a-row hidden-super flex-wrap">
        <BaseImage width="42px" url="/png/affiliate/medal.png" />
      </div>
      <div class="right-box">
        <div class="a-row">
          <div class="truncate">
            <span class="text-color">{{ t('member_account') }}：</span>{{ balanceAgency?.username || '-' }}
          </div>
          <!--        <BaseButton class="btn-default !max-w-[108px] @md:!max-w-full" :bg-style="isStyle2() ? 'secondary' : 'primary'" custom-padding @click="drawDialog"> -->
          <!--          {{ $t('commission_wallet') }} -->
          <!--        </BaseButton> -->
        </div>
        <div class="a-row">
          <div class="center account-info">
            <span class="text-color">{{ t('commission_available') }}：</span>
            <span
              :class="{ 'is-mobile': isMobile }"
            >{{ agencyInfo }}</span>
            <AppCurrencyIcon :currency-type="getCurrencyConfigByCode(bonus_currency)?.name" class="ml-[3px]" />
          </div>
          <!--        <BaseButton class="btn-default commission-record !max-w-[108px] @md:!max-w-full" custom-padding @click="commissionRecord"> -->
          <!--          {{ $t('commission_record') }} -->
          <!--        </BaseButton> -->
        </div>
      </div>
    </div>
    <BaseButton
      class="commission-btn" :class="[isMobile ? 'h-[42px]' : 'h-[42px]']"
      :disabled="Number(agencyInfo) <= 0"
      :loading="loadTransferToMember"
      bg-style="primary"
      @click="runTransferToMember"
    >
      {{ t('receive_commission') }}
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.btn-default:not(.primary) {
  @include webTheme('white') {
    background-color: #e8e8e8;
    color: #111;
  }
  @include webTheme('green') {
    background-color: #055434;
    color: #3cb389;
  }
}
.btn-default.secondary {
  @include webTheme('white') {
    background-color: #f2ca5c;
    color: #111;
  }
  @include webTheme('green') {
    background-color: #f6d14a;
    color: #02432d;
  }
}
.hidden-super {
  display: flex;
  align-items: center;
  gap: var(--tg-spacing-7);
  color: var(--tg-text-white);
  font-size: var(--tg-font-size-default);
  margin-right: var(--tg-spacing-8);
}
.account-info {
  margin-right: 6px;
}
.flex-wrap {
  flex-wrap: wrap;
}
.app-user-agent-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .info-box {
    display: flex;
    align-items: center;
  }
  .right-box {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    color: var(--tg-text-white);
    font-size: var(--tg-font-size-default);
    > div:first-child {
      margin-bottom: var(--tg-spacing-7);
    }
    .a-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 1.4;
    }
    --tg-base-button-padding-y: 8px;
    --tg-base-button-padding-x: 16px;
    --tg-base-button-font-weight: 500;
    &.is-mobile {
      max-width: 80px;
    }
  }
  .BaseButton {
    margin-left: 32px;
  }
}
.text-color {
  @include webTheme('green') {
    color: var(--tg-text-green-main);
  }
}
.user-agent-info-sup {
  @include webTheme('green') {
    --tg-primary-button-active: var(--tg-base-button-secondary-bg);
    --tg-text-green-btn: var(--tg-base-button-style-bg-dark);
    --tg-base-button-style-bg: var(--tg-secondary-main);
    .commission-record {
      border: 1px solid #055434;
    }
  }
}

.app-user-agent-info {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .commission-btn {
    margin-left: 32px;
    flex-shrink: 0;
    width: 200px;
    border-radius: 4px;
  }

  &.is-mobile {
    flex-direction: column;
    align-items: stretch;

    .commission-btn {
      margin-left: 0;
      margin-top: 16px;
      width: 100%;
    }
  }
}
</style>
