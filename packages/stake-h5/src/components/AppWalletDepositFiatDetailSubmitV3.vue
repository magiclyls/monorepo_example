<script setup lang="ts">
import { IconUniWarningColor } from '@tg/icons'

import type { IAvailableCurrency, paymentBankInfo } from '@tg/types'

import type { Merchants } from '~/composables/useCurrencyData'
import { ApiPaymentDepositBankCancel, ApiPaymentDepositBankConfirm } from '@tg/apis'
import AppMemberNotificationsMessage from '~/components/AppMemberNotificationsMessage.vue'

defineOptions({
  name: 'AppWalletDepositFiatDetailSubmitV3',
})
const { t } = useI18n()
const customRouter = useCustomRouter()
const { openNotify } = useNotify()
const { toFixedByLockCurrency } = useMiniGameLockCurrency()
const activeFiatCurrency = ref(customRouter.query.activeFiatCurrency as unknown as IAvailableCurrency)
const paymentDepositBankInfo = ref(customRouter.query.paymentDepositBankInfo as unknown as paymentBankInfo)
const paymentType = ref(customRouter.query.curPaymentType as unknown as number)
/** 当前的支付通道 */
const activeMerchant = ref(customRouter.query.curMerchant as unknown as Merchants)
/** 公司入款存款-我已存款 */
const { run: runPaymentDepositBankConfirm, loading: paymentDepositBankConfirmLoading } = useRequest(ApiPaymentDepositBankConfirm, {
  onSuccess() {
    showNotify()
    customRouter.back({ initCurrency: activeFiatCurrency.value.currency_name })
  },
})
/** 公司入款存款-取消存款 */
const { run: runPaymentDepositBankCancel, loading: paymentDepositBankCancelLoading } = useRequest(ApiPaymentDepositBankCancel, {
  onSuccess() {
    customRouter.back({ initCurrency: activeFiatCurrency.value.currency_name })
  },
})
/** 拷贝 */
const toCopy = function (item: string) {
  application.copy(item)
}
function showNotify(amount?: string) {
  const type = activeFiatCurrency.value?.currency_name
  openNotify({
    icon: `coin-${type.toLocaleLowerCase()}`,
    title: t('deposit_in_process'),
    message: () => h(AppMemberNotificationsMessage, {
      amount: application.formatNumDecimal(amount ?? paymentDepositBankInfo.value?.amount ?? 0, currencyConfig[type].decimal),
      currencyType: type,
      keypath: 'deposit_info_going',
      class: 'cur-in-notify',
    }),
  })
}
/** 格式化银行账号 */
function formatBankAccount(s: string) {
  if (s.length > 10)
    return s.replace(/(\d{4})(?=\d)/g, '$1 ')

  else
    return s.replace(/(\d{4})(?=\d)/, '$1 ').replace(/(.{8})(?=.)/, '$1 ')
}
/** 获取图标路径 */
function getMerchantsIconPath(type: number, str: string) {
  return type === 2 ? `/webp/bank/${str}.webp` : `/payment/deposit/${str ?? 'dft'}.webp`
}
</script>

<template>
  <div class="type-online-bank">
    <div class="bank-second">
      <div class="mt-[16px]">
        <p class="second-title font-semibold">
          {{ t('deposit_currency') }}<span class="text-tg-text-error ml-[5px] text-[12px]">*</span>
        </p>
        <p class="copy-row">
          <AppCurrencyIcon icon-align="left" style="--tg-app-currency-icon-size:14px;" :currency-type="activeFiatCurrency.currency_name" show-name />
        </p>
      </div>
      <div>
        <p class="second-title font-semibold">
          {{ t('savor_name') }}<span class="text-tg-text-error ml-[5px] text-[12px]">*</span>
        </p>
        <p class="copy-row" @click="toCopy(paymentDepositBankInfo?.bankcard.open_name ?? '')">
          <span>{{ paymentDepositBankInfo?.bankcard.open_name }}</span>
          <AppTooltip :skidding="-19" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']" />
        </p>
      </div>
      <div>
        <p class="second-title font-semibold">
          {{ t('withdraw_account') }}<span class="text-tg-text-error ml-[5px] text-[12px]">*</span>
        </p>
        <p class="copy-row" @click="toCopy(paymentDepositBankInfo?.bankcard.bank_account ?? '')">
          <span>{{ formatBankAccount(paymentDepositBankInfo?.bankcard.bank_account ?? '') }}</span>
          <AppTooltip :skidding="-19" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']" />
        </p>
      </div>
      <div v-if="paymentDepositBankInfo?.bankcard.bank_area_cpf">
        <p class="second-title font-semibold">
          {{ t('open_addr') }}<span class="text-tg-text-error ml-[5px] text-[12px]">*</span>
        </p>
        <p class="copy-row" @click="toCopy(paymentDepositBankInfo?.bankcard.bank_area_cpf ?? '')">
          <span>{{ formatBankAccount(paymentDepositBankInfo?.bankcard.bank_area_cpf ?? '') }}</span>
          <AppTooltip :skidding="-19" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']" />
        </p>
      </div>
      <div>
        <p class="second-title font-semibold">
          {{ activeFiatCurrency.currency_name === 'BRL' ? t('select_deposit_type') : t('saving_bank') }}<span class="text-tg-text-error ml-[5px] text-[12px]">*</span>
        </p>
        <p class="copy-row">
          <span class="center" style="gap: 6px;">
            <BaseImage width="16px" height="16px" :url="getMerchantsIconPath(paymentType, activeMerchant.alias)" is-network />
            {{ paymentDepositBankInfo?.bankcard.bank_id }}
          </span>
        </p>
      </div>
      <div>
        <p class="second-title font-semibold">
          {{ t('payment_in_amount') }}<span class="text-tg-text-error ml-[5px] text-[12px]">*</span>
        </p>
        <p class="copy-row" @click="toCopy(paymentDepositBankInfo?.amount ?? '')">
          <span>{{ toFixedByLockCurrency(paymentDepositBankInfo?.amount ?? '', activeFiatCurrency.currency_name) }}</span>
          <AppTooltip :skidding="-19" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']" />
        </p>
      </div>
      <div
        class="recharge_is_completed bg-tg-secondary-dark border-tg-text-lightgrey w-full border-[2px] rounded-[4px] border-dashed px-[5px] py-[10px]"
      >
        <div class="flex gap-[5px]">
          <IconUniWarningColor style="font-size: var(--tg-font-size-base);" />
          <div class="font-medium leading-[19.6px]">
            <div class="text-tg-text-lightgrey">
              {{ t('note_check_recharge_is_completed') }}
            </div>
          </div>
        </div>
      </div>
      <div class="second-btns" style="--tg-spacing-12:28px">
        <BaseButton
          size="md"
          :loading="paymentDepositBankCancelLoading"
          style="--tg-base-button-font-size:16px"
          @click="runPaymentDepositBankCancel(
            { id: paymentDepositBankInfo?.id ?? '' })"
        >
          {{ t('cancel_deposit') }}
        </BaseButton>
        <BaseButton
          bg-style="secondary"
          size="md"
          :loading="paymentDepositBankConfirmLoading"
          style="--tg-base-button-font-size:16px"
          @click="runPaymentDepositBankConfirm(
            { id: paymentDepositBankInfo?.id ?? '' })"
        >
          {{ t('already_payment') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.app-wallet-dialog {
  padding: 0 16px 16px;
  font-size: var(--tg-font-size-default);
  color: var(--tg-text-lightgrey);
}
.type-online-bank {
  .bank-second {
    display: flex;
    flex-direction: column;
    gap: var(--tg-spacing-16);
  }
  .bank-second {
    .second-title {
      margin-bottom: var(--tg-spacing-4);
      color: var(--tg-text-lightgrey);
    }
    .copy-row {
      max-width: 100%;
      border-radius: var(--tg-radius-default);
      border: 1px solid var(--tg-secondary-main);
      padding: var(--tg-spacing-12) var(--tg-spacing-10);
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--tg-text-white);
      cursor: pointer;
      font-weight: 600;
      background-color: var(--grey-400);
      @include webTheme('white') {
        background-color: #e8e8e8;
        border-color: #e8e8e8;
      }
    }
    .second-tips {
      color: var(--tg-text-error);
      font-size: var(--tg-font-size-xs);
      margin-top: var(--tg-spacing-4);
    }
    .second-btns {
      display: flex;
      gap: var(--tg-spacing-12);
      button {
        width: 100%;
      }
      @include webTheme('white') {
        --tg-base-button-style-bg: #c1c1c1;
      }
      @include webTheme('green') {
        --tg-base-button-style-bg: #197b59;
        --tg-base-button-color: #fff;
      }
    }
    .second-tips2 {
      display: flex;
      justify-content: left;
      align-items: center;
      color: var(--tg-text-error);
      font-size: var(--tg-font-size-xs);
      gap: 0.25rem;
    }
    .recharge_is_completed {
      @include webTheme('white') {
        background-color: #e3e3e3;
        border-color: #c1c1c1;
      }
    }
  }
}
</style>
