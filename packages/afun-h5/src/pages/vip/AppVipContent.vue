<script setup lang='ts'>
import type { IComponentsList } from '@tg/types'
import { AfunBaseTabs } from '@tg/bccomponents'
import { useVipStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, defineAsyncComponent, provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import AppVipInfoBar from '~/components/AppVipInfoBar.vue'

defineOptions({ name: 'AppVipContent' })
const props = defineProps<{ isInPromo?: boolean }>()

const { t } = useI18n()
const { push } = useRouter()
const { isVipUpgradeBonusOpen, isAllVipBonusClosed, isMemberHaveVipBonusRecord, isVipOpen } = storeToRefs(useVipStore())

const tab = ref('vip-bonus')
const tabList = computed<any>(() => {
  return [
    {
      value: 'vip-bonus',
      label: isVipUpgradeBonusOpen.value ? t('晋级奖金') : t('晋级流水'),

    },
    isAllVipBonusClosed.value
      ? undefined
      : {
          value: 'day-salary',
          label: t('VIP奖金'),
        },
    !isVipUpgradeBonusOpen.value && isAllVipBonusClosed.value && !isMemberHaveVipBonusRecord.value
      ? undefined
      : {
          value: 'receive',
          label: t('领取记录'),
        },
  ].filter(a => a !== void 0)
})

const componentList: IComponentsList = {
  'vip-bonus': defineAsyncComponent(() => import('./vip-bonus.vue')),
  'day-salary': defineAsyncComponent(() => import('./day-salary.vue')),
  'receive': defineAsyncComponent(() => import('./receive.vue')),
}
const currentComponent = computed(() => componentList[tab.value])

if (props.isInPromo) {
  provide('isInPromoVip', true)
}

if (!isVipOpen.value)
  push('/')
</script>

<template>
  <div>
    <AppVipInfoBar class="mb-[16px]" :vip-tab="tab" />
    <AfunBaseTabs v-model="tab" full :list="tabList" class="mb-[4px]" :type="5" style="--afun-tabs-wrap-padding-y:5px; --afun-tabs-item-padding-x:23.7px" />
    <Suspense timeout="0">
      <component :is="currentComponent" />
      <template #fallback>
        <AppLoading style="--afun-app-loading-height:300px;" />
      </template>
    </Suspense>
  </div>
</template>

<style lang='scss' scoped>

</style>
