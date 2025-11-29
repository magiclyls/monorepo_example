<script lang="ts" setup>
import { AfunBaseAmount, AfunBaseButton, AfunBaseCurrencyIcon } from '@tg/bccomponents'
import { IconUniCopy, IconUniWallet } from '@tg/icons'
import { timeToFormatFullTimeByBoss } from '@tg/vue-i18n'
import { useClipboard } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '~/components/AppPageLayout.vue'
import { Message } from '~/utils'

defineOptions({ name: 'TransactionRecordDetail' })

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { copy } = useClipboard()
const btn = ref<HTMLElement>()

const raw = route.query.data as string
const detail = ref(raw ? JSON.parse(raw) : {})

// 是否存在预扣
const isHasLimit = computed(() => detail.value.is_limit_balance)

function onlineSupport() {
  router.push('/service')
}

function copyText() {
  copy(detail.value?.order_number || '').then(() => {
    Message.success(t('成功复制'))
  })
}
</script>

<template>
  <AppPageLayout :title="detail.method === 'deposit' ? t('存款详情') : t('取款详情')">
    <div>
      <div
        ref="btn" class="text-[14px] font-[600] pb-[16px] flex items-center justify-start text-[#B1BAD3]"
        @click="copyText"
      >
        {{ `${t('订单编号')}:${detail.order_number}` }}
        <IconUniCopy class="ml-[8px] text-[#B1BAD3]" />
      </div>
      <div class="boxshadow flex flex-col gap-[16px] bg-[#213743] rounded-[4px] px-[10px] py-[12px]">
        <div class="flex flex-col justify-center items-center">
          <div class="text-[#fff] font-[600]">
            {{ detail.currency_name }}
          </div>
          <div class="text-[#fff] font-[600] text-[24px]" :class="detail.state !== 1 && 'text-[#E91134]'">
            <AfunBaseAmount
              :amount="detail.pay_amount || detail.amount" :currency-type="detail.currency_name"
              :show-icon="false" style="--afun-base-amount-font-size: 24px"
            />
          </div>
        </div>
        <div class="flex justify-between">
          <div class="text-[#B1BAD3] font-[600]">
            {{ t('交易时间') }}:
          </div>
          <div class="text-[#fff] font-[600]">
            {{ timeToFormatFullTimeByBoss(detail.created_at) }}
          </div>
        </div>
        <div class="flex justify-between">
          <div class="text-[#B1BAD3] font-[600]">
            {{ t('交易方式') }}:
          </div>
          <div class="text-[#fff] font-[600]">
            {{ detail.pay_method_name || detail.bank_name || detail.withdraw_type || '-' }}
          </div>
        </div>
        <div class="flex justify-between">
          <div class="text-[#B1BAD3] font-[600]">
            {{ t('交易币种') }}:
          </div>
          <div class="text-[#fff] font-[600] flex gap-[4px]">
            <AfunBaseCurrencyIcon :currency-type="detail.currency_name" style="--afun-app-currency-icon-size:14px" />
            {{ detail.currency_name }}
          </div>
        </div>
        <div class="flex justify-between">
          <div class="text-[#B1BAD3] font-[600]">
            {{ t('交易状态') }}:
          </div>
          <div :class="`text-[${detail.color}] font-[600] text-[14px] flex items-center gap-[4px]`">
            <IconUniWallet :style="`color: ${detail.color}`" class="ml-[8px]" />
            {{ detail.status }}
          </div>
        </div>
        <template v-if="isHasLimit">
          <!-- 存款金额 -->
          <div class="flex justify-between">
            <div class="text-[#B1BAD3] font-[600]">
              {{ t('存款金额') }}:
            </div>
            <div class="text-[#fff] font-[600]">
              {{ detail.pay_amount }}
            </div>
          </div>
          <!-- 预扣金额 -->
          <div class="flex justify-between">
            <div class="text-[#B1BAD3] font-[600]">
              {{ t('预扣金额') }}:
            </div>
            <div class="text-[#fff] font-[600]">
              {{ detail.limit_amount }}
            </div>
          </div>
          <!-- 实际到账 -->
          <div class="flex justify-between">
            <div class="text-[#B1BAD3] font-[600]">
              {{ t('实际到账') }}:
            </div>
            <div class="text-[#fff] font-[600]">
              {{ detail.actual_amount }}
            </div>
          </div>
        </template>
        <div class="flex justify-between">
          <div class="text-[#B1BAD3] font-[600]">
            {{ t('到账时间') }}:
          </div>
          <div class="text-[#fff] font-[600]">
            {{ detail.arrived_at ? timeToFormatFullTimeByBoss(detail.arrived_at) : '-' }}
          </div>
        </div>
        <div class="flex justify-between">
          <div class="text-[#B1BAD3] font-[600]">
            {{ t('备注') }}:
          </div>
          <div class="text-[#fff] font-[600]">
            {{ detail.pxark || '-' }}
          </div>
        </div>
      </div>
    </div>
    <AfunBaseButton
      type="primary" class="h-[42px] mt-[16px] w-full"
      style="--afun-base-button-font-size: 14px; --afun-base-button-font-weight: 500; --afun-base-button-border-color: #EBEBEB;--afun-base-button-secondary-background-color:#fff"
      @click="onlineSupport"
    >
      {{ t('联系在线客服') }}
    </AfunBaseButton>
  </AppPageLayout>
</template>

<style lang="scss" scoped>
.boxshadow {
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.2),
    0 1px 2px 0 rgba(0, 0, 0, 0.12);
}
</style>
