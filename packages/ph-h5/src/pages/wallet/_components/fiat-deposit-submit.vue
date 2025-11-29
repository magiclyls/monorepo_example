<script setup lang="ts">
import { ApiPaymentDepositBankCancel, ApiPaymentDepositBankConfirm } from '@tg/apis'
import { PhBaseButton, PhBaseCurrencyIcon, PhBaseLabel } from '@tg/bccomponents'
import { IconUniError } from '@tg/icons'
import { application, Local, STORAGE_WALLET_ROUTE, toFixedByLockCurrency } from '@tg/utils'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppTooltip from '~/components/AppTooltip.vue'
import { Message } from '~/utils'
import MerchantIcon from './merchant-icon.vue'

defineOptions({
  name: 'AppFiatDepositSubmit',
})
const { t } = useI18n()
const route = useRoute()
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
function showNotify(amount?: string) {
  const type = activeFiatCurrency.value?.currency_name
  Message.info(t('存款进行中'))
  /* 和tigger确认 存提款进行中不要提示  openNotify({
    icon: `coin-${type.toLocaleLowerCase()}`,
    title: t('存款进行中'),
    message: () => h(AppMemberNotificationsMessage, {
      amount: application.formatNumDecimal(amount ?? paymentDepositBankInfo.value?.amount ?? 0, getCurrencyConfig(type).decimal),
      currencyType: type,
      keypath: 'deposit_info_going',
      class: 'cur-in-notify',
    }),
  }) */
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
    <div class="flex flex-col gap-[16rem] p-[12rem] rounded-[8rem]  bg-white text-[14rem] leading-[20rem]  font-[500]">
      <PhBaseLabel :label="t('存款货币')" required>
        <div class="content-item">
          <PhBaseCurrencyIcon icon-align="left" :show-name="true" style="--ph-app-currency-icon-size:14rem;" :currency-type="activeFiatCurrency.currency_name" />
        </div>
      </PhBaseLabel>
      <PhBaseLabel :label="t('收款人姓名')" required>
        <div class="content-item" @click="toCopy(paymentDepositBankInfo?.bankcard.open_name ?? '')">
          <span>{{ paymentDepositBankInfo?.bankcard.open_name }}</span>
          <AppTooltip :text="t('已成功复制')" icon-name="copy" />
        </div>
      </PhBaseLabel>
      <PhBaseLabel :label="t('收款账号')" required>
        <div class="content-item" @click="toCopy(paymentDepositBankInfo?.bankcard.bank_account ?? '')">
          <span>{{ formatBankAccount(paymentDepositBankInfo?.bankcard.bank_account ?? '') }}</span>
          <AppTooltip :text="t('已成功复制')" icon-name="copy" />
        </div>
      </PhBaseLabel>
      <PhBaseLabel v-if="paymentDepositBankInfo?.bankcard.bank_area_cpf" :label="t('开户网点')" required>
        <div class="content-item" @click="toCopy(paymentDepositBankInfo?.bankcard.bank_area_cpf ?? '')">
          <span>{{ formatBankAccount(paymentDepositBankInfo?.bankcard.bank_area_cpf ?? '') }}</span>
          <AppTooltip :text="t('已成功复制')" icon-name="copy" />
        </div>
      </PhBaseLabel>
      <PhBaseLabel :label="activeFiatCurrency.currency_name === 'BRL' ? t('选择类型') : t('收款银行') " required>
        <div class="content-item">
          <div class="center">
            <MerchantIcon size="16rem" :currency-type="currencyType" :type="paymentType" :item="activeMerchant" />
            <span class="ml-[6rem]">{{ paymentDepositBankInfo?.bankcard.bank_id }}</span>
          </div>
        </div>
      </PhBaseLabel>
      <PhBaseLabel :label="t('支付金额')" required>
        <div class="content-item" @click="toCopy(paymentDepositBankInfo?.amount ?? '')">
          <span>{{ toFixedByLockCurrency(paymentDepositBankInfo?.amount ?? '', activeFiatCurrency.currency_name) }}</span>
          <AppTooltip :text="t('已成功复制')" icon-name="copy" />
        </div>
      </PhBaseLabel>
      <div class="flex items-center text-[#6D7693]  font-[400]">
        <IconUniError class="text-[14rem]" />
        <span class="ml-[4rem] text-[12rem]">
          {{ t('注意：请仔细核对收款账号，支付完成请点击我已支付') }}
        </span>
      </div>
      <div class="flex items-center justify-between gap-[30rem]">
        <PhBaseButton
          show-shadow
          class="flex-1 btn1"
          :loading="paymentDepositBankCancelLoading"
          @click="runPaymentDepositBankCancel(
            { id: paymentDepositBankInfo?.id ?? '' })"
        >
          {{ t('取消存款') }}
        </PhBaseButton>
        <PhBaseButton
          class="flex-1 btn2"
          :loading="paymentDepositBankConfirmLoading"
          show-shadow
          @click="runPaymentDepositBankConfirm(
            { id: paymentDepositBankInfo?.id ?? '' })"
        >
          {{ t('我已支付') }}
        </PhBaseButton>
      </div>
    </div>
  </AppPageLayout>
</template>

<style lang='scss' scoped>
.btn1 {
  --ph-base-button-primary-text-color: #f23038;
  --ph-base-button-border-color: #f23038;
  background: rgba(242, 48, 56, 0.08);
}

.content-item {
  height: 40rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10rem;
  border-radius: 6rem;
  background-color: #f6f7f8;
}
</style>
