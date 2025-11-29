<script lang="ts" setup>
interface Props {
  isShowRebate?: boolean
  isCenterPage?:boolean
}

defineOptions({
  name: 'AppVipContent',
})

const props = withDefaults(defineProps<Props>(), {
  isShowRebate: true,
  isCenterPage: false
})

const emits = defineEmits(['rebateClick', 'hideReceive'])

const isInPromoVip = inject('isInPromoVip')
const isInPromoRebate = inject('isInPromoRebate')
const { t } = useI18n()
const { isVipUpgradeBonusOpen, isAllVipBonusClosed, isMemberHaveVipBonusRecord } = storeToRefs(useAppStore())
const { appContentWidth, isMobile } = storeToRefs(useWindowStore())

const PromotionBonus = defineAsyncComponent(() => import('~/pages/[lang]/vip/vip-bonus.vue'))
const DaySalary = defineAsyncComponent(() => import('~/pages/[lang]/vip/day-salary.vue'))
const Rebate = defineAsyncComponent(() => import('~/pages/[lang]/rebate-center/rebate.vue'))
const Receive = defineAsyncComponent(() => import('~/pages/[lang]/vip/receive.vue'))

// VIP页面H5所有奖金关闭、晋级奖金关闭、没有领取记录的时候隐藏tab
const isVipPageAndAllBonusCloseAndNoRecord = computed(() => {
  return !isVipUpgradeBonusOpen.value && isAllVipBonusClosed.value && !isMemberHaveVipBonusRecord.value
})

const menuData = computed(() => {
  return [
    {
      title: isVipUpgradeBonusOpen.value ? t('vip_promotion_bonus') : t('vip_upgrade_water'),
      path: '',
      token: false,
      isT: true,
      value: '0',
      label: isVipUpgradeBonusOpen.value ? t('vip_promotion_bonus') : t('vip_upgrade_water'),
    },
    isAllVipBonusClosed.value
      ? undefined
      : {
          title: t('vip_vip_bonus'),
          path: '',
          token: false,
          isT: true,
          value: '1',
          label: t('vip_vip_bonus'),
        },
    props.isShowRebate
      ? {
          title: t('vip_water_back'),
          path: '',
          token: false,
          isT: true,
          value: '2',
          label: t('vip_water_back'),
        }
      : undefined,
    !isVipUpgradeBonusOpen.value && isAllVipBonusClosed.value && !isMemberHaveVipBonusRecord.value
      ? undefined
      : {
          title: t('receive_record_label'),
          path: '',
          token: false,
          isT: true,
          value: '3',
          label: t('receive_record_label'),
        },
  ].filter(a => a !== void 0)
})

const curMenuTab = ref(isInPromoRebate ? '2' : '0')

const getComponent = computed(() => {
  if (isInPromoVip) {
    switch (curMenuTab.value) {
      case '0': return PromotionBonus
      case '1': return DaySalary
      case '3': return Receive
    }
  }
  else {
    switch (curMenuTab.value) {
      case '0': return PromotionBonus
      case '1': return DaySalary
      case '2': return Rebate
      case '3': return Receive
    }
  }
})

function init() {
  if (curMenuTab.value === '2' || curMenuTab.value === '3')
    emits('hideReceive', true, curMenuTab.value)
  else
    emits('hideReceive', false, curMenuTab.value)
}

onMounted(() => {
  init()
})

onActivated(() => {
  init()
})

watch(curMenuTab, () => {
  init()
})
</script>

<template>
  <div
    class="scroll-x app-vip-content " :class="{
      'is-isMobile': appContentWidth < 800,
      'is-in-promoRebate': isInPromoRebate,
      'only-one-column': menuData.length <= 1,
      'center-page-bg' : isCenterPage
    }"
  >
    <template v-if="!isInPromoRebate && menuData.length > 1">
      <div v-if="appContentWidth > 800">
        <BaseMenu v-model="curMenuTab" :data="menuData" />
      </div>
      <div v-else class="scroll-x reward-tab">
        <BaseTab
          v-model="curMenuTab"
          :center="false"
          :list="menuData"
          full
        />
      </div>
    </template>
    <Suspense timeout="0">
      <component :is="getComponent" />
      <template #fallback>
        <div class="center dialog-loading-height">
          <AppLoading :height="isMobile ? 360 : 636" />
        </div>
      </template>
    </Suspense>
  </div>
</template>

<style lang="scss" scoped>
.app-vip-content{
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 16px;
  &.is-isMobile{
    grid-template-columns: auto;
    gap: 16px;
  }
  &.is-in-promoRebate {
    grid-template-columns: auto;
  }
  @include webTheme('white'){
    --tg-tab-style-wrap-bg-color:#F5F5F5;
    --tg-tab-style-color:#111;
  }
  .reward-tab{
    @include webTheme('green'){
      --tg-tab-active-text-color:var(--tw-ring-offset-color);
      --tg-text-green-sub:var(--tw-ring-offset-color)
    }
  }
  &.only-one-column{
    grid-template-columns:  1fr;
  }
}
.center-page-bg{
  --tg-secondary-dark: 0F212E;
}
</style>
