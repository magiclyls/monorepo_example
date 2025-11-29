<script lang="ts" setup>
import { PhBaseTabs } from '@tg/bccomponents'
import { useBrandStore, useTaskStore, useVipStore } from '@tg/stores'
import { getLangForBackend } from '@tg/vue-i18n'
import { useTitle } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

import { useI18n } from 'vue-i18n'
import AppVaultDescription from '~/components/AppInterest.vue'
import AppLoading from '~/components/AppLoading.vue'
import AppTaskContent from '~/components/AppTaskContent.vue'
import AppPromoRebateContent from '~/pages/rebate-center/AppRebateCenterContent.vue'
import AppPromoVipContent from '~/pages/vip/AppVipContent.vue'
import AppHomeLayout from '../../components/AppHomeLayout.vue'
import AppPromoList from './_components/promotion-list.vue'

defineOptions({
  name: 'KeepAliveAppPromotionWarp',
})

// const props = withDefaults(defineProps<Props>(), {
//   category: '0',
// })

type TabValue = '0' | '1' | '4' | '5' | '6'

interface Props {
  category: '0' | '1' | '2'
}
interface ListItem {
  value: TabValue
  label: string
  comp?: any
}
const { t } = useI18n()
useTitle(t('促销活动'))

const { getTaskCategoryApi } = useTaskStore()
const { allCategory, taskLoading } = storeToRefs(useTaskStore())
const { isSafeInterestOpen } = storeToRefs(useBrandStore())
const { isHaveVIPRebateConfig, isVipOpen } = storeToRefs(useVipStore())

// vip 内层 tab 晋级奖金 积分奖金 领取记录
const curTab = ref('0')

const allComps: Record<TabValue, any> = {
  0: AppPromoList,
  1: AppTaskContent,
  4: AppPromoVipContent,
  5: AppPromoRebateContent,
  6: AppVaultDescription,
}
const allTabs = computed(() => {
  return [
    {
      label: t('活动'),
      value: '0',
    },
    allCategory.value.length > 0
    && {
      label: t('任务'),
      value: '1',
    },
    isVipOpen.value
    && {
      label: t('VIP'),
      value: '4',
    },
    isHaveVIPRebateConfig.value
    && {
      label: t('返水'),
      value: '5',
    },
    isSafeInterestOpen.value
    && {
      label: t('利息宝'),
      value: '6',
    },
  ].filter(f => Boolean(f)) as ListItem[]
})

const tabVal = ref<TabValue>('0')

function taskClick(tab: string) {
  curTab.value = tab
}
onMounted(() => {
  // 提前获取任务分类， 防止任务tab闪动
  getTaskCategoryApi({ lang: getLangForBackend() || 'en_US' })
})
</script>

<template>
  <AppHomeLayout>
    <AppLoading v-if="taskLoading" />
    <div v-else class="px-[10rem] py-[8rem]">
      <PhBaseTabs v-model="tabVal" :type="3" :list="allTabs" style="--tabs-wrap-padding-x:4rem;" class="mb-[12rem]" />
      <keep-alive>
        <component :is="allComps[tabVal]" is-in-promo @task-click="taskClick" />
      </keep-alive>
    </div>
  </AppHomeLayout>
</template>

<style lang="scss" scoped>

</style>
