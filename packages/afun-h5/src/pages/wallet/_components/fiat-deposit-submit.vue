<script setup lang="ts">
import { ApiPaymentDepositBankCancel, ApiPaymentDepositBankConfirm } from '@tg/apis'
import { AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseLabel } from '@tg/bccomponents'
import { IconUniError } from '@tg/icons'
import { application, Local, STORAGE_WALLET_ROUTE, toFixedByLockCurrency } from '@tg/utils'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppTooltip from '~/components/AppTooltip.vue'
import MerchantIcon from './merchant-icon.vue'

defineOptions({
  name: 'AppFiatDepositSubmit',
})
const { t } = useI18n()
const router = useRouter()
const routeData = (Local.get(STORAGE_WALLET_ROUTE)?.value as any[])?.[0]
const activeFiatCurrency = ref(JSON.parse((routeData?.activeFiatCurrency || '{}') as string))
const paymentDepositBankInfo = ref(JSON.parse((routeData?.paymentDepositBankInfo || '{}') as string))
const paymentType = ref(Number(routeData?.curPaymentType))
const currencyType = routeData?.currencyType as any
/** 当前的支付通道 */
const activeMerchant = ref(JSON.parse((routeData?.curMerchant || '{}') as string))
/** 公司入款存款-我已存款 */
const { run: runPaymentDepositBankConfirm, loading: paymentDepositBankConfirmLoading } = useRequest(ApiPaymentDepositBankConfirm, {
  onSuccess() {
    router.back()
  },
})
/** 公司入款存款-取消存款 */
const { run: runPaymentDepositBankCancel, loading: paymentDepositBankCancelLoading } = useRequest(ApiPaymentDepositBankCancel, {
  onSuccess() {
    router.back()
  },
})
/** 拷贝 */
const toCopy = function (item: string) {
  application.copy(item)
}

/** 格式化银行账号 */
function formatBankAccount(s: string) {
  if (s.length > 10)
    return s.replace(/(\d{4})(?=\d)/g, '$1 ')

  else
    return s.replace(/(\d{4})(?=\d)/, '$1 ').replace(/(.{8})(?=.)/, '$1 ')
}
</script>

<template>
  <AppPageLayout :title="$t('存款')">
    <div class="flex flex-col gap-[16px] text-[14px] leading-[20px]  font-[600]">
      <AfunBaseLabel :label="t('存款货币')" required>
        <div class="content-item">
          <AfunBaseCurrencyIcon icon-align="left" :show-name="true" style="--afun-app-currency-icon-size:14px;" :currency-type="activeFiatCurrency.currency_name" />
        </div>
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('收款人姓名')" required>
        <div class="content-item" @click="toCopy(paymentDepositBankInfo?.bankcard.open_name ?? '')">
          <span>{{ paymentDepositBankInfo?.bankcard.open_name }}</span>
          <AppTooltip :text="t('已成功复制')" icon-name="copy" />
        </div>
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('收款账号')" required>
        <div class="content-item" @click="toCopy(paymentDepositBankInfo?.bankcard.bank_account ?? '')">
          <span>{{ formatBankAccount(paymentDepositBankInfo?.bankcard.bank_account ?? '') }}</span>
          <AppTooltip :text="t('已成功复制')" icon-name="copy" />
        </div>
      </AfunBaseLabel>
      <AfunBaseLabel v-if="paymentDepositBankInfo?.bankcard.bank_area_cpf" :label="t('开户网点')" required>
        <div class="content-item" @click="toCopy(paymentDepositBankInfo?.bankcard.bank_area_cpf ?? '')">
          <span>{{ formatBankAccount(paymentDepositBankInfo?.bankcard.bank_area_cpf ?? '') }}</span>
          <AppTooltip :text="t('已成功复制')" icon-name="copy" />
        </div>
      </AfunBaseLabel>
      <AfunBaseLabel :label="activeFiatCurrency.currency_name === 'BRL' ? t('选择类型') : t('收款银行') " required>
        <div class="content-item">
          <div class="center">
            <MerchantIcon size="16px" :currency-type="currencyType" :type="paymentType" :item="activeMerchant" />
            <span class="ml-[6px]">{{ paymentDepositBankInfo?.bankcard.bank_id }}</span>
          </div>
        </div>
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('支付金额')" required>
        <div class="content-item" @click="toCopy(paymentDepositBankInfo?.amount ?? '')">
          <span>{{ toFixedByLockCurrency(paymentDepositBankInfo?.amount ?? '', activeFiatCurrency.currency_name) }}</span>
          <AppTooltip :text="t('已成功复制')" icon-name="copy" />
        </div>
      </AfunBaseLabel>
      <div class="flex items-center text-[#B1BAD3]  font-[600]">
        <IconUniError class="text-[14px]" />
        <span class="ml-[4px] text-[12px]">
          {{ t('注意：请仔细核对收款账号，支付完成请点击我已支付') }}
        </span>
      </div>
      <div class="flex items-center justify-between gap-[30px]">
        <AfunBaseButton
          show-shadow
          class="flex-1 btn1"
          :loading="paymentDepositBankCancelLoading"
          @click="runPaymentDepositBankCancel(
            { id: paymentDepositBankInfo?.id ?? '' })"
        >
          {{ t('取消存款') }}
        </AfunBaseButton>
        <AfunBaseButton
          class="flex-1 btn2"
          :loading="paymentDepositBankConfirmLoading"
          show-shadow
          @click="runPaymentDepositBankConfirm(
            { id: paymentDepositBankInfo?.id ?? '' })"
        >
          {{ t('我已支付') }}
        </AfunBaseButton>
      </div>
    </div>
  </AppPageLayout>
</template>

<style lang='scss' scoped>
.btn1 {
  --afun-base-button-primary-text-color: #fff;
  --afun-base-button-border-color: #557086;
  background: #557086;
}

.content-item {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  border-radius: 4px;
  background-color: #2f4553;
}
</style>
