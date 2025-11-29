<script setup lang="ts">
import { ApiPaymentDepositCoinCancel, ApiPaymentDepositCoinConfirm } from '@tg/apis'
import { BaseQrcode, PhBaseAmount, PhBaseButton, PhBaseCurrencyIcon, PhBaseLabel } from '@tg/bccomponents'
import { IconUniError } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { application, Local, STORAGE_WALLET_ROUTE, toFixedByLockCurrency } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppTooltip from '~/components/AppTooltip.vue'

defineOptions({
  name: 'AppVirDepositSubmit',
})
const { t } = useI18n()
const router = useRouter()
const { allContractList } = storeToRefs(useAppStore())
const routeData = (Local.get(STORAGE_WALLET_ROUTE)?.value as any[])?.[0]
const backDepositInfo = ref(JSON.parse((routeData?.backDepositInfo || '{}') as string))
const activeVirCurrency = ref(JSON.parse((routeData?.activeVirCurrency || '{}') as string))
const currentNetwork = ref(routeData?.currentNetwork as string)
const {
  run: runPaymentDepositCoinConfirm,
  loading: paymentDepositCoinConfirmLoading,
} = useRequest(ApiPaymentDepositCoinConfirm, {
  onSuccess() {
    router.back()
  },
})
const {
  run: runPaymentDepositCoinCancel,
  loading: paymentDepositCoinCancelLoading,
} = useRequest(ApiPaymentDepositCoinCancel, {
  onSuccess() {
    router.back()
  },
})
/** 拷贝 */
const toCopy = function (item: string) {
  application.copy(item)
}

const currentNetworkLabel = computed(() => {
  return allContractList.value?.find(item => item.id === currentNetwork.value)?.name
})
</script>

<template>
  <AppPageLayout :title="$t('存款')">
    <div class="flex flex-col gap-[16rem] p-[12rem] rounded-[8rem]  bg-white text-[14rem] leading-[20rem]  font-[500]">
      <div class="flex gap-[20rem]">
        <PhBaseLabel class="flex-1" :label="$t('存款货币')">
          <div
            class="flex items-center justify-between h-[40rem] px-[12rem]  border border-[#EBEBEB] rounded-[6rem]"
          >
            <PhBaseCurrencyIcon icon-align="left" :show-name="true" style="--ph-app-currency-icon-size:18rem;" :currency-type="activeVirCurrency.currency_name" />
          </div>
        </PhBaseLabel>
        <PhBaseLabel class="flex-1" :label="$t('网络')">
          <div
            class="flex items-center justify-between h-[40rem] px-[12rem]  border border-[#EBEBEB] rounded-[6rem]"
          >
            <span>
              {{ currentNetworkLabel }}
            </span>
          </div>
        </PhBaseLabel>
      </div>
      <div class="center">
        <BaseQrcode :value="backDepositInfo.address ?? ''" class="p-[10rem] rounded-[4rem] border-solid border border-[#EBEBEB]" :size="140" />
      </div>

      <PhBaseLabel :label="$t('收款地址')" required>
        <div class="content-item" @click="toCopy(backDepositInfo.address ?? '')">
          <span class="break-all mr-[20rem] overflow-hidden">{{ backDepositInfo.address }}</span>
          <AppTooltip :text="t('已成功复制！')" />
        </div>
      </PhBaseLabel>
      <PhBaseLabel
        v-if="backDepositInfo.currency_name === 'EOS' || backDepositInfo.currency_name === 'XRP'"
        :label="backDepositInfo.currency_name === 'EOS' ? t('备忘录') : t('页') "
        :warn-text="` (${t('必填')}${backDepositInfo.currency_name === 'XRP' ? t('，否则您的资金可能丢失') : ''})`"
        required
      >
        <div class="content-item" @click="toCopy(backDepositInfo.memo ?? '')">
          <span>{{ backDepositInfo.memo }}</span>
          <AppTooltip :text="t('已成功复制！')" />
        </div>
      </PhBaseLabel>
      <PhBaseLabel :label="$t('支付金额')" required>
        <div class="content-item" @click="toCopy(backDepositInfo.amount ?? '')">
          <PhBaseAmount
            class="inline-block"
            :amount="toFixedByLockCurrency(backDepositInfo.amount, activeVirCurrency.currency_name)"
            :currency-type="activeVirCurrency.currency_name"
          />
          <AppTooltip :text="t('已成功复制！')" />
        </div>
      </PhBaseLabel>
      <div class="flex items-center text-[#6D7693]  font-[400]">
        <IconUniError class="text-[14rem]" />
        <span class="ml-[4rem] text-[12rem]">
          {{ t('注意：请仔细核对收款地址，支付完成请点击我已支付') }}
        </span>
      </div>

      <div v-if="backDepositInfo.id" class="flex items-center justify-between gap-[30rem]">
        <PhBaseButton
          show-shadow
          class="flex-1 btn1"
          :loading="paymentDepositCoinCancelLoading"
          @click="runPaymentDepositCoinCancel({ id: backDepositInfo.id ?? '' })"
        >
          {{ t('取消存款') }}
        </PhBaseButton>
        <PhBaseButton
          class="flex-1 btn2"
          :loading="paymentDepositCoinConfirmLoading"
          show-shadow
          @click="runPaymentDepositCoinConfirm({ id: backDepositInfo.id ?? '' })"
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
  min-height: 40rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7rem 10rem;
  border-radius: 6rem;
  background-color: #f6f7f8;
}
</style>
