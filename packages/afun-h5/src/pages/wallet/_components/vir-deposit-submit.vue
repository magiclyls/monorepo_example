<script setup lang="ts">
import { ApiPaymentDepositCoinCancel, ApiPaymentDepositCoinConfirm } from '@tg/apis'
import { AfunBaseAmount, AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseLabel, BaseQrcode } from '@tg/bccomponents'
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
    <div class="flex flex-col gap-[16px] text-[14px] leading-[20px]  font-[600]">
      <div class="flex gap-[20px]">
        <AfunBaseLabel class="flex-1" :label="$t('存款货币')">
          <div
            class="flex items-center justify-between h-[40px] px-[12px] bg-[#0F212E] rounded-[4px]"
          >
            <AfunBaseCurrencyIcon icon-align="left" :show-name="true" style="--afun-app-currency-icon-size:18px;" :currency-type="activeVirCurrency.currency_name" />
          </div>
        </AfunBaseLabel>
        <AfunBaseLabel class="flex-1" :label="$t('网络')">
          <div
            class="flex items-center justify-between h-[40px] px-[12px] bg-[#0F212E] rounded-[4px]"
          >
            <span>
              {{ currentNetworkLabel }}
            </span>
          </div>
        </AfunBaseLabel>
      </div>
      <div class="center">
        <BaseQrcode :value="backDepositInfo.address ?? ''" class="p-[10px] rounded-[4px] bg-[#fff]" :size="140" />
      </div>

      <AfunBaseLabel :label="$t('收款地址')" required>
        <div class="content-item" @click="toCopy(backDepositInfo.address ?? '')">
          <span class="break-all mr-[20px] overflow-hidden">{{ backDepositInfo.address }}</span>
          <AppTooltip :text="t('已成功复制！')" />
        </div>
      </AfunBaseLabel>
      <AfunBaseLabel
        v-if="backDepositInfo.currency_name === 'EOS' || backDepositInfo.currency_name === 'XRP'"
        :label="backDepositInfo.currency_name === 'EOS' ? t('备忘录') : t('页') "
        :warn-text="` (${t('必填')}${backDepositInfo.currency_name === 'XRP' ? t('，否则您的资金可能丢失') : ''})`"
        required
      >
        <div class="content-item" @click="toCopy(backDepositInfo.memo ?? '')">
          <span>{{ backDepositInfo.memo }}</span>
          <AppTooltip :text="t('已成功复制！')" />
        </div>
      </AfunBaseLabel>
      <AfunBaseLabel :label="$t('支付金额')" required>
        <div class="content-item" @click="toCopy(backDepositInfo.amount ?? '')">
          <AfunBaseAmount
            class="inline-block"
            :amount="toFixedByLockCurrency(backDepositInfo.amount, activeVirCurrency.currency_name)"
            :currency-type="activeVirCurrency.currency_name"
            style="--afun-base-amount-font-size:14px;"
          />
          <AppTooltip :text="t('已成功复制！')" />
        </div>
      </AfunBaseLabel>
      <div class="flex items-center text-[#B1BAD3]  font-[600]">
        <IconUniError class="text-[14px]" />
        <span class="ml-[4px] text-[12px]">
          {{ t('注意：请仔细核对收款地址，支付完成请点击我已支付') }}
        </span>
      </div>

      <div v-if="backDepositInfo.id" class="flex items-center justify-between gap-[30px]">
        <AfunBaseButton
          show-shadow
          class="flex-1 btn1"
          :loading="paymentDepositCoinCancelLoading"
          @click="runPaymentDepositCoinCancel({ id: backDepositInfo.id ?? '' })"
        >
          {{ t('取消存款') }}
        </AfunBaseButton>
        <AfunBaseButton
          class="flex-1 btn2"
          :loading="paymentDepositCoinConfirmLoading"
          show-shadow
          @click="runPaymentDepositCoinConfirm({ id: backDepositInfo.id ?? '' })"
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
  min-height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px;
  border-radius: 4px;
  background-color: #2f4553;
}
</style>
