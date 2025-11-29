<script setup lang='ts'>
import { IconUniChecklist } from '@tg/icons'
import type { Component } from 'vue'
defineOptions({ name: 'VipRebateCenter' })

const route = useRoute()
const { t } = useI18n()

const tab = computed(() => route.query.tab?.toString() ?? 'rebate')

const menuData = computed<any>(() => {
  return [
    {
      title: t('vip_rebate_center'),
      path: '/rebate-center?tab=rebate',
      token: false,
      isT: true,
      value: 'rebate',
      label: t('vip_rebate_center'),
    },
    {
      title: t('vip_rebate_record'),
      path: '/rebate-center?tab=record',
      token: false,
      isT: true,
      value: 'record',
      label: t('vip_rebate_record'),
    },
  ]
})

const componentList: { [k: string]: Component } = {
  rebate: defineAsyncComponent(() => import('./rebate-center/rebate.vue')),
  record: defineAsyncComponent(() => import('./rebate-center/record.vue')),
}
const _compo = computed(() => componentList[tab.value])

watch(tab, (a) => {
  if (a === 'rebate')
    usePageTitle({ prefix: 'vip_rebate_center', isT: true })
  else if (a === 'record')
    usePageTitle({ prefix: 'vip_rebate_record', isT: true })
}, { immediate: true })
</script>

<template>
  <AppWithMenuLayout :menu-data="menuData" :tab="tab" is-rebate-center>
    <Suspense timeout="0">
      <component :is="_compo" />
      <template #fallback>
        <div class="center dialog-loading-height">
          <AppLoading />
        </div>
      </template>
    </Suspense>
  </AppWithMenuLayout>
</template>

<style lang='scss' scoped>

</style>

<route lang="yaml">
meta:
  layout: home
  withMenuTitle: vip_rebate_center
  withMenuIcon: IconUniChecklist
  withMenuMobileType: tabs
  withMenuMenu:
    - title: vip_rebate_center
      path: /rebate-center/rebate
      token: false
      isT: true
    - title: vip_rebate_record
      path: /rebate-center/record
      token: false
      isT: true
  withMenuLayoutConf: {padding: 0 0, borderRadius: '0'}
  </route>
