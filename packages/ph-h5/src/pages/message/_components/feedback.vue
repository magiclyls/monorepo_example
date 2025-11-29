<script setup lang='ts'>
import type { IComponentsList } from '@tg/types'
import { PhBaseTabs } from '@tg/bccomponents'
import { useChatStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppFeedbackChat from '~/components/AppFeedbackChat.vue'

defineOptions({ name: 'Feedback' })

const { t } = useI18n()
const tab = ref('createFeedback')
const tabList = [
  { label: t('创建反馈'), value: 'createFeedback' },
  { label: t('我的反馈'), value: 'myFeedbacks' },
]
const { showFeedbackChat } = storeToRefs(useChatStore())

// 动态导入各个子页面
const componentList: IComponentsList = {
  createFeedback: defineAsyncComponent(() => import('./create-feedback.vue')),
  myFeedbacks: defineAsyncComponent(() => import('./my-feedbacks.vue')),
}
const currentComponent = computed(() => componentList[tab.value])
</script>

<template>
  <div>
    <PhBaseTabs v-show="!showFeedbackChat" v-model="tab" :type="6" :list="tabList" class="my-[16rem]" />
    <component :is="currentComponent" />
    <AppFeedbackChat v-if="showFeedbackChat" />
  </div>
</template>

<style lang='scss' scoped>

</style>
