<script lang="ts" setup>
import type { IComponentsList } from '@tg/types'
import { ApiAgencyCommissionBalance, ApiAgencyTransferToMember } from '@tg/apis'
import { PhBaseButton, PhBaseCurrencyIcon, PhBaseImage, PhBaseTabs } from '@tg/bccomponents'
import { useAffiliate, useAppStore, useCurrency } from '@tg/stores'
import { getCurrencyConfig } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, defineAsyncComponent, onActivated, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'
import { Message } from '~/utils'

defineOptions({ name: 'KeepAliveAffiliate' })

const { t } = useI18n()
const appStore = useAppStore()
const currencyStore = useCurrency()
const route = useRoute()
const { bonus_currency, bonus_limit } = storeToRefs(useAffiliate())

const tab = ref(route.query.tab as string || 'inviteLink')
const tabList = ref([
  { label: t('邀请链接'), value: 'inviteLink' },
  { label: t('返佣比例'), value: 'rebateRatio' },
  { label: t('我的数据'), value: 'myData' },
  { label: t('财务数据'), value: 'financialData' },
  { label: t('佣金记录'), value: 'commissionData' },
  { label: t('佣金详情'), value: 'commissionDetailData' },
  { label: t('常见问题'), value: 'commonProblems' },
])

// 动态导入各个子页面
const componentList: IComponentsList = {
  inviteLink: defineAsyncComponent(() => import('./invite-link.vue')),
  rebateRatio: defineAsyncComponent(() => import('./rebate-ratio.vue')),
  myData: defineAsyncComponent(() => import('./my-data.vue')),
  financialData: defineAsyncComponent(() => import('./financial-data.vue')),
  commissionData: defineAsyncComponent(() => import('./commission-data.vue')),
  commissionDetailData: defineAsyncComponent(() => import('./commission-detail-data.vue')),
  commonProblems: defineAsyncComponent(() => import('./common-problems.vue')),
}

const currentComponent = computed(() => componentList[tab.value])

const {
  data: balanceAgency,
  runAsync: getBalanceAgency,
} = useRequest(ApiAgencyCommissionBalance)

const {
  run: runTransferToMember,
  loading: loadTransferToMember,
} = useRequest(ApiAgencyTransferToMember, {
  onSuccess() {
    Message.success(t('佣金提取成功'))
    currencyStore.initCurrencyList()
    getBalanceAgency()
  },
})

const agencyInfo = computed(() => {
  if (!balanceAgency.value)
    return '0.00'
  const current_bonus = balanceAgency.value.balance

  // 大于上限使用上限 0或空 无上限
  if (!(Number(bonus_limit.value) === 0 || !bonus_limit.value) && Number(current_bonus) > Number(bonus_limit.value))
    return bonus_limit.value
  else
    return current_bonus
})

onActivated(() => {
  appStore.updateUserInfo()
})

onMounted(async () => {
  appStore.updateUserInfo()
  getBalanceAgency()
})
</script>

<template>
  <AppPageLayout :title="t('联盟计划')">
    <div class="p-[12rem] rounded-[6rem] affiliate-card">
      <div class="flex gap-[10rem]">
        <PhBaseImage
          url="/ph-h5/png/account-info.png" class="icon-img w-[45rem] h-[52rem]"
        />
        <div>
          <div class="text-[14rem] font-[400] mb-[8rem]">
            <span class="text-[#6D7693]">{{ t('会员账号') }}</span>
            <span class="text-[#0D2245]">{{ balanceAgency?.username || '-' }}</span>
          </div>
          <div class="text-[14rem] font-[400] flex">
            <span class="text-[#6D7693]">{{ t('可领佣金') }}</span>
            <span class="text-[#0D2245] flex gap-[4rem]">
              <span>{{ agencyInfo }}</span>
              <PhBaseCurrencyIcon :currency-type="getCurrencyConfig(bonus_currency)?.name" />
            </span>
          </div>
        </div>
      </div>
      <PhBaseButton class="setting-btn w-full mt-[12rem]" :disabled="Number(agencyInfo) <= 0" :loading="loadTransferToMember" @click="runTransferToMember">
        {{ t('领取佣金') }}
      </PhBaseButton>
    </div>
    <PhBaseTabs v-model="tab" :list="tabList" :type="5" class="my-[16rem]" style="--tabs-wrap-padding-y: 5rem;--tabs-item-gap: 5rem" />
    <Suspense timeout="0">
      <component :is="currentComponent" />
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </AppPageLayout>
</template>

<style lang="scss" scoped>
.affiliate-card {
  background: #ffffff;
  box-shadow: 0 0 12rem 0 rgba(0, 0, 0, 0.15);
}
.setting-btn {
  --ph-base-button-font-weight: 400;
}
</style>
