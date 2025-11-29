<script lang="ts" setup>
import { PhBaseAmount, PhBaseButton, PhBaseCurrencyIcon } from '@tg/bccomponents'
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
      <div ref="btn" class="text-[14rem] font-[600] pb-[16rem] flex items-center justify-start text-[#6D7693]" @click="copyText">
        {{ `${t('订单编号')}:${detail.order_number}` }}
        <IconUniCopy class="ml-[8rem] text-[#9dabc8]" />
      </div>
      <div class="flex flex-col gap-[16rem] bg-[#fff] rounded-[8rem] px-[10rem] py-[12rem]">
        <div class="flex flex-col justify-center items-center">
          <div class="text-[#0D2245] font-[500]">
            {{ detail.currency_name }}
          </div>
          <div class="text-[#0D2245] font-[600] text-[24rem]" :class="detail.state !== 1 && 'text-[#F23038]'">
            <PhBaseAmount :amount="detail.pay_amount || detail.amount" :currency-type="detail.currency_name" :show-icon="false" style="--ph-base-amount-font-size: 24rem" />
          </div>
        </div>
        <div class="flex justify-between">
          <div class="text-[#9DABC9] font-[500]">
            {{ t('交易时间') }}:
          </div>
          <div class="text-[#0D2245] font-[600]">
            {{ timeToFormatFullTimeByBoss(detail.created_at) }}
          </div>
        </div>
        <div class="flex justify-between">
          <div class="text-[#9DABC9] font-[500]">
            {{ t('交易方式') }}:
          </div>
          <div class="text-[#0D2245] font-[600]">
            {{ detail.pay_method_name || detail.bank_name || detail.withdraw_type || '-' }}
          </div>
        </div>
        <div class="flex justify-between">
          <div class="text-[#9DABC9] font-[500]">
            {{ t('交易币种') }}:
          </div>
          <div class="text-[#0D2245] font-[600] flex gap-[4rem]">
            <PhBaseCurrencyIcon :currency-type="detail.currency_name" style="--ph-app-currency-icon-size:14rem" />
            {{ detail.currency_name }}
          </div>
        </div>
        <div class="flex justify-between">
          <div class="text-[#9DABC9] font-[500]">
            {{ t('交易状态') }}:
          </div>
          <div :class="`text-[${detail.color}] font-[600] text-[14rem] flex items-center gap-[4rem]`">
            <IconUniWallet :style="`color: ${detail.color}`" class="ml-[8rem]" />
            {{ detail.status }}
          </div>
        </div>
        <template v-if="isHasLimit">
          <!-- 存款金额 -->
          <div class="flex justify-between">
            <div class="text-[#9DABC9] font-[500]">
              {{ t('存款金额') }}:
            </div>
            <div class="text-[#0D2245] font-[600]">
              {{ detail.pay_amount }}
            </div>
          </div>
          <!-- 预扣金额 -->
          <div class="flex justify-between">
            <div class="text-[#9DABC9] font-[500]">
              {{ t('预扣金额') }}:
            </div>
            <div class="text-[#0D2245] font-[600]">
              {{ detail.limit_amount }}
            </div>
          </div>
          <!-- 实际到账 -->
          <div class="flex justify-between">
            <div class="text-[#9DABC9] font-[500]">
              {{ t('实际到账') }}:
            </div>
            <div class="text-[#0D2245] font-[600]">
              {{ detail.actual_amount }}
            </div>
          </div>
        </template>
        <div class="flex justify-between">
          <div class="text-[#9DABC9] font-[500]">
            {{ t('到账时间') }}:
          </div>
          <div class="text-[#0D2245] font-[600]">
            {{ detail.arrived_at ? timeToFormatFullTimeByBoss(detail.arrived_at) : '-' }}
          </div>
        </div>
        <div class="flex justify-between">
          <div class="text-[#9DABC9] font-[500]">
            {{ t('备注') }}:
          </div>
          <div class="text-[#0D2245] font-[600]">
            {{ detail.remark || '-' }}
          </div>
        </div>
      </div>
    </div>
    <PhBaseButton type="primary" class="h-[44rem] mt-[16rem] w-full" style="--ph-base-button-font-size: 14rem; --ph-base-button-font-weight: 500; --ph-base-button-border-color: #EBEBEB;--ph-base-button-secondary-background-color:#fff" @click="onlineSupport">
      {{ t('联系在线客服') }}
    </PhBaseButton>
  </AppPageLayout>
</template>
