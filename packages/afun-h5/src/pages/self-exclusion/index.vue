<script setup lang='ts'>
import type { IComponentsList } from '@tg/types'
import { AfunBaseTabs } from '@tg/bccomponents'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'

defineOptions({ name: 'AppSelfExclusion' })

const { t } = useI18n()

const tab = ref('selfExclusion')
const tabList = [
  { label: t('自我排除'), value: 'selfExclusion' },
  { label: t('投注限额'), value: 'betLimit' },
  { label: t('存款限额'), value: 'depositLimit' },
]

// 动态导入各个子页面
const componentList: IComponentsList = {
  selfExclusion: defineAsyncComponent(() => import('./_components/selfExclusion.vue')),
  betLimit: defineAsyncComponent(() => import('./_components/betLimit.vue')),
  depositLimit: defineAsyncComponent(() => import('./_components/depositLimit.vue')),
}
const currentComponent = computed(() => componentList[tab.value])
const title = computed(() => tabList.find(a => a.value === tab.value)?.label)
</script>

<template>
  <AppPageLayout :title="title">
    <AfunBaseTabs v-model="tab" class="mb-[16px]" :list="tabList" :type="8" />

    <Suspense timeout="0">
      <component :is="currentComponent" />
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </AppPageLayout>
</template>

<style lang='scss' scoped>

</style>
