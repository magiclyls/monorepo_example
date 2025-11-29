<script lang="ts" setup>
const { theme, isVipUpgradeBonusOpen, isAllVipBonusClosed, isMemberHaveVipBonusRecord, isVipOpen } = storeToRefs(useAppStore())
const route = useRoute()
const { t } = useI18n()
const { push } = useLocalRouter()

const tab = computed(() => route.query.tab?.toString() ?? 'vipBonus')

const menuData = computed<any>(() => {
  return [
    {
      title: isVipUpgradeBonusOpen.value ? t('vip_promotion_bonus') : t('vip_upgrade_water'),
      path: '/vip?tab=vipBonus',
      token: false,
      isT: true,
      value: 'vipBonus',
      label: isVipUpgradeBonusOpen.value ? t('vip_promotion_bonus') : t('vip_upgrade_water'),
    },
    isAllVipBonusClosed.value
      ? undefined
      : {
          title: t('vip_vip_bonus'),
          path: '/vip?tab=daySalary',
          token: false,
          isT: true,
          value: 'daySalary',
          label: t('vip_vip_bonus'),
        },
    !isVipUpgradeBonusOpen.value && isAllVipBonusClosed.value && !isMemberHaveVipBonusRecord.value
      ? undefined
      : {
          title: t('receive_record_label'),
          path: '/vip?tab=receive',
          token: false,
          isT: true,
          value: 'receive',
          label: t('receive_record_label'),
        },
  ].filter(a => a !== void 0)
})

const componentList: { [k: string]: Component } = {
  vipBonus: defineAsyncComponent(() => import('./vip/vip-bonus.vue')),
  daySalary: defineAsyncComponent(() => import('./vip/day-salary.vue')),
  receive: defineAsyncComponent(() => import('./vip/receive.vue')),
}
const _compo = computed(() => componentList[tab.value])

if (theme.value === 'white')
  usePageTitle({ prefix: 'VIP' })
else
  usePageTitle({ prefix: 'personal_center', isT: true })

if (!isVipOpen.value)
  push('/')
</script>

<template>
  <AppWithMenuLayout :menu-data="menuData" :tab="tab" is-vip-center>
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

<style lang="scss" scoped>

</style>

<route lang="yaml">
meta:
  layout: home
  withMenuTitle: vip
  withMenuIcon: IconUniChecklist
  withMenuMobileType: tabs
  withMenuMenu:
    - title: vip_promotion_bonus
      path: /vip/vip-bonus
      token: false
      isT: true
    - title: vip_vip_bonus
      path: /vip/day-salary
      token: false
      isT: true
    - title: receive_record_label
      path: /vip/receive
      token: false
      isT: true
  withMenuLayoutConf: {padding: 0 0, borderRadius: '0'}
</route>
