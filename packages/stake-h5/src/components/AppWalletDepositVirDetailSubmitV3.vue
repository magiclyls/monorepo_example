<script setup lang="ts">
import { IconUniWarningColor } from '@tg/icons'

import type { IAvailableCurrency, DepositInfo } from '@tg/types'

import { ApiPaymentDepositCoinCancel, ApiPaymentDepositCoinConfirm } from '@tg/apis'
import AppMemberNotificationsMessage from '~/components/AppMemberNotificationsMessage.vue'

defineOptions({
  name: 'AppWalletDepositVirDetailSubmitV3',
})
const { t } = useI18n()
const customRouter = useCustomRouter()
const { getVirContractName } = useCurrencyData()
const { toFixedByLockCurrency } = useMiniGameLockCurrency()
const languageStore = useLanguageStore()
const { userLanguage } = storeToRefs(languageStore)
const { openNotify } = useNotify()
const backDepositInfo = ref(customRouter.query.backDepositInfo as unknown as DepositInfo)
const activeVirtCurrency = ref(customRouter.query.activeVirtCurrency as unknown as IAvailableCurrency)
const currentNetwork = ref(customRouter.query.currentNetwork as string)
const {
  run: runPaymentDepositCoinConfirm,
  loading: paymentDepositCoinConfirmLoading,
} = useRequest(ApiPaymentDepositCoinConfirm, {
  onSuccess() {
    showNotify()
    customRouter.back({ initCurrency: activeVirtCurrency.value.currency_name })
  },
})
const {
  run: runPaymentDepositCoinCancel,
  loading: paymentDepositCoinCancelLoading,
} = useRequest(ApiPaymentDepositCoinCancel, {
  onSuccess() {
    customRouter.back({ initCurrency: activeVirtCurrency.value.currency_name })
  },
})
/** 拷贝 */
const toCopy = function (item: string) {
  application.copy(item)
}
function showNotify() {
  const type = activeVirtCurrency.value.currency_name
  openNotify({
    icon: `coin-${type.toLocaleLowerCase()}`,
    title: t('deposit_in_process'),
    message: () => h(AppMemberNotificationsMessage, {
      amount: application.formatNumDecimal(backDepositInfo.value.amount, currencyConfig[type].decimal),
      currencyType: type,
      keypath: 'deposit_info_going',
    }),
  })
}
</script>

<template>
  <div class="app-virtual-deposit mb-[16px]">
    <div class="mt-[16px] flex flex-row">
      <AppCurrencyIconV2 :show-name="true" :network="true" :currency-type="activeVirtCurrency.currency_name" icon-align="left">
        <template #network>
          <span class="network bg-tg-secondary-dark w-[74px] rounded-[4px] px-[8px] py-[13px] text-center">
            {{ getVirContractName(currentNetwork) }}
          </span>
        </template>
      </AppCurrencyIconV2>
      <div class="grow">
        <BaseQrcode :url="backDepositInfo.address ?? ''" :size="160" />
      </div>
    </div>
    <div>
      <p class="second-title font-semibold">
        {{ t('saving_address') }}<span class="text-tg-text-error ml-[5px] text-[12px]">*</span>
      </p>
      <p class="copy-row" @click="application.copy(backDepositInfo.address ?? '')">
        <span>{{ backDepositInfo.address }}</span>
        <AppTooltip :skidding="-19" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']" />
      </p>
    </div>
    <div v-if="backDepositInfo.currency_name === 'EOS' || backDepositInfo.currency_name === 'XRP'">
      <p class="second-title font-semibold">
        {{ backDepositInfo.currency_name === 'EOS' ? t('memorandum') : t('label') }}<span class="text-tg-text-error ml-[5px] text-[12px]">* ({{ t('required') }}{{ backDepositInfo.currency_name === 'XRP' ? t('if_not_your_funds_lost') : '' }})</span>
      </p>
      <p class="copy-row" @click="application.copy(backDepositInfo.memo ?? '')">
        <span>{{ backDepositInfo.memo ?? '' }}</span>
        <AppTooltip :skidding="-19" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']" />
      </p>
    </div>
    <div>
      <p class="second-title font-semibold">
        {{ t('payment_in_amount') }}<span class="text-tg-text-error ml-[5px] text-[12px]">*</span>
      </p>
      <p class="copy-row" @click="toCopy(backDepositInfo.amount)">
        <span class="flex items-center justify-start gap-[6px]">
          <AppCurrencyIcon style="--tg-app-currency-icon-size:14px;" :currency-type="activeVirtCurrency.currency_name" />
          {{ toFixedByLockCurrency(backDepositInfo.amount, activeVirtCurrency.currency_name) }}
        </span>
        <AppTooltip :skidding="-19" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']" />
      </p>
      <div
        class="bg-tg-secondary-dark bg-tg-secondary-dark address_is_completed pay-textarea border-tg-text-lightgrey mt-[16px] w-full border-[2px] rounded-[4px] border-dashed px-[5px] py-[10px]"
      >
        <div class="flex gap-[5px]">
          <IconUniWarningColor style="font-size: var(--tg-font-size-base);" />
          <div class="font-medium" :class="[userLanguage === 'th-TH' ? 'leading-[23.6px]' : 'leading-[19.6px]']">
            <div class="address_text_completed">
              {{ t('note_check_address_is_completed') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="backDepositInfo.id" class="box-btn" style="--tg-spacing-12:28px">
      <BaseButton
        size="md" :loading="paymentDepositCoinCancelLoading"
        style="--tg-base-button-style-bg:#197B59;
               --tg-base-button-color:#ffffff"
        @click="runPaymentDepositCoinCancel({ id: backDepositInfo.id ?? '' })"
      >
        {{ t('cancel_deposit') }}
      </BaseButton>
      <BaseButton
        bg-style="secondary" size="md" :loading="paymentDepositCoinConfirmLoading"
        @click="runPaymentDepositCoinConfirm({ id: backDepositInfo.id ?? '' })"
      >
        {{ t('already_payment') }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.app-virtual-deposit {
  @include webTheme('white') {
    --tg-secondary-dark: #ffffff;
    --tg-secondary-main: #e8e8e8;
    --tg-base-button-style-bg: #c1c1c1;
  }
  display: flex;
  flex-direction: column;
  gap: var(--tg-spacing-16);
  --tg-select-placeholder-color: var(--tg-text-lightgrey);

  .second-title {
    margin-bottom: var(--tg-spacing-4);
    color: var(--tg-text-lightgrey);
  }
  .address_is_completed {
    @include webTheme('white') {
      --tg-secondary-dark: #e3e3e3;
      --tg-text-lightgrey: #c1c1c1;
    }
  }
  .address_text_completed {
    color: #555555;
    @include webTheme('green') {
      color: #3cb389;
    }
  }
  .pay-textarea {
    @include webTheme('green') {
      background-color: #02432d;
    }
  }

  .copy-row {
    max-width: 100%;
    border-radius: var(--tg-radius-default);
    border: 1px solid var(--tg-secondary-main);
    padding: var(--tg-spacing-12) var(--tg-spacing-12);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--tg-text-white);
    cursor: pointer;
    background-color: var(--tg-secondary-main);
    word-break: break-all;
  }
  .copy-row span {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.05em;
  }
  .network {
    @include webTheme('green') {
      background-color: #02432d;
    }
  }

  .warn-msg {
    line-height: 1;
    color: var(--tg-text-error);
    font-size: var(--tg-font-size-xs);
    font-weight: 500;
    margin-top: var(--tg-spacing-4);
  }

  .box-btn {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: var(--tg-spacing-12);
  }

  .not-payment-msg {
    gap: 16px;

    .msg-warp {
      display: flex;
      width: 100%;
      gap: var(--tg-spacing-4);
      justify-content: center;
      padding: 27px 12px;
      border: var(--tg-border-width-sm) dashed var(--tg-secondary-light);
      border-radius: var(--tg-radius-sm);
      background-color: var(--tg-secondary-dark);
      font-size: var(--tg-font-size-default);
    }
  }
}
</style>
