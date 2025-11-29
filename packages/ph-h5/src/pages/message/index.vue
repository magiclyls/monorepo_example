<script setup lang='ts'>
import type { IComponentsList } from '@tg/types'
import { PhBaseTabs } from '@tg/bccomponents'
import { useNotificationState } from '@tg/hooks'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'

defineOptions({ name: 'AppMessage' })

const { t } = useI18n()
const { notificationsCount, runNotificationsCount } = useNotificationState()

const tab = ref('letter')
const tabList = computed(() => {
  return [
    { label: t('站内信'), value: 'letter', dotTip: notificationsCount.value?.station_count ?? 0 },
    { label: t('公告'), value: 'announcement', dotTip: notificationsCount.value?.notice_count ?? 0 },
    { label: t('有奖反馈'), value: 'feedback', dotTip: notificationsCount.value?.reward_count ?? 0 },
  ]
})

// 动态导入各个子页面
const componentList: IComponentsList = {
  letter: defineAsyncComponent(() => import('./_components/letter.vue')),
  announcement: defineAsyncComponent(() => import('./_components/announcement.vue')),
  feedback: defineAsyncComponent(() => import('./_components/feedback.vue')),
}
const currentComponent = computed(() => componentList[tab.value])
</script>

<template>
  <AppPageLayout :title="t('消息中心')">
    <PhBaseTabs v-model="tab" :list="tabList" :type="5" style="--tabs-wrap-padding-y: 5rem; --tabs-item-padding-x: 30rem" />

    <keep-alive>
      <Suspense timeout="0">
        <component :is="currentComponent" @re-state="runNotificationsCount" />
        <template #fallback>
          <AppLoading />
        </template>
      </Suspense>
    </keep-alive>
  </AppPageLayout>
</template>

<style lang='scss' scoped></style>
