<script setup lang="ts">
defineOptions({ name: 'AppSelfExclusion' })

const { globalPageTitle } = useGlobalStatePageTitle()
const { t } = useI18n()
globalPageTitle.value = t('self_exclusion')

const tab = ref('self-exclusion')
const tabList = [
  { label: t('self_exclusion'), value: 'self-exclusion' },
  { label: t('bet_limit'), value: 'bet-limit' },
  { label: t('deposit_limit'), value: 'deposit-limit' },
]

const componentList: { [k: string]: Component } = {
  'self-exclusion': defineAsyncComponent(() => import('~/components/AppPageSelfExclusion.vue')),
  'bet-limit': defineAsyncComponent(() => import('~/components/AppPageBetLimit.vue')),
  'deposit-limit': defineAsyncComponent(() => import('~/components/AppPageDepositLimit.vue')),
}

const _compo = computed(() => componentList[tab.value])

function onTabClick(item: { label: string, value: string }) {
  globalPageTitle.value = item.label
  tab.value = item.value
}
</script>

<template>
  <div class="w-full">
    <BaseTabWrap class="mb-[16px]" :list="tabList" :active="tab" @itemClick="onTabClick">
      <template #item="{ item }">
        <div class="tab" :class="{ active: item.active }">
          {{ item.label }}
        </div>
      </template>
    </BaseTabWrap>

    <Suspense timeout="0">
      <component :is="_compo" />
      <template #fallback>
        <div class="center dialog-loading-height">
          <AppLoading />
        </div>
      </template>
    </Suspense>
  </div>
</template>

<style lang='scss' scoped>
.tab {
  line-height: 44px;
  padding: 0 16px;
  border-radius: 4px;
  background: #1A2C38;
  font-size: 16px;
  height: 44px;
  margin-right: 16px;
  font-weight: 500;
  cursor: pointer;
  min-width: 96px;
  white-space: nowrap;
  flex-shrink: 0;

  &.active {
    background: #24EE89;
    color: #000;
  }
}
</style>

<route lang="yaml">
name: AppSelfExclusion
meta:
  layout: center
</route>
