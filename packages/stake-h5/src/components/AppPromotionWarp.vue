<script lang="ts" setup>
import AppPromoList from './AppPromoList.vue'
import AppPromoVipContent from './AppPromoVipContent.vue'
import AppPromoRebateContent from './AppPromoRebateContent.vue'
import AppVaultDescription from './AppVaultDescription.vue'
import AppTaskContent from './AppTaskContent.vue'

defineOptions({
  name: 'AppPromotionWarp',
})

const props = withDefaults(defineProps<Props>(), {
  category: '0',
})

const allComps = {
  0: AppPromoList,
  1: AppTaskContent,
  4: AppPromoVipContent,
  5: AppPromoRebateContent,
  6: AppVaultDescription,
}

// const AppPromoList = defineAsyncComponent(() => import('./AppPromoList.vue'))
// const AppPromoVipContent = defineAsyncComponent(() => import('./AppPromoVipContent.vue'))
// const AppPromoRebateContent = defineAsyncComponent(() => import('./AppPromoRebateContent.vue'))
// const AppVaultDescription = defineAsyncComponent(() => import('./AppVaultDescription.vue'))

interface Props {
  category: '0' | '1' | '2'
}
interface ListItem {
  value: '0' | '1' | '2' | '3' | '4' | '5' | '6'
  label: string
  comp?: any
}
const { t } = useI18n()
const router = useLocalRouter()
// const { openRegisterDialog } = useRegisterDialog()
const windowStore = useWindowStore()
const { isMobile } = storeToRefs(windowStore)
const { appContentWidth } = storeToRefs(useWindowStore())
const { getTaskCategoryApi } = useTaskStore()
const { allCategory, taskLoading } = storeToRefs(useTaskStore())
const { isSafeInterestOpen } = storeToRefs(useBrandStore())
const { isHaveVIPRebateConfig, isVipOpen } = storeToRefs(useAppStore())
const { isShowFooterState } = useGlobalStateShowFooter()

// const {
//   selected: tabVal,
//   list: tabList,
// } = useSelect<{ value: '0' | '1' | '2'; label: string }>([
//   {
//     label: t('casino'),
//     value: '1',
//   }, {
//     label: t('sports_label'),
//     value: '2',
//   },
// ])

const tabRef = ref()
const needAnimate = ref(true)
// vip 内层 tab 晋级奖金 积分奖金 领取记录
const curTab = ref('0')
const hideReceiveBool = ref(false)

const listInit = computed(() => {
  const tabs = [
    {
      label: t('activity'),
      value: '0',
    // comp: AppPromoList,
    },
    allCategory.value.length > 0
      ? {
          label: t('tasks_space_title'),
          value: '1',
          // comp: AppPromoList,
        }
      : undefined,
    isVipOpen.value
      ? {
          label: t('vip'),
          value: '4',
          // comp: AppPromoVipContent,
        }
      : undefined,
    isHaveVIPRebateConfig.value
      ? {
          label: t('vip_water_back'),
          value: '5',
          // comp: AppPromoRebateContent,
        }
      : undefined,
    isSafeInterestOpen.value
      ? {
          label: t('safe'),
          value: '6',
        }
      : undefined,
  ].filter(f => f !== undefined) as ListItem[]

  return tabs.filter(f => f !== undefined) as ListItem[]
})

const {
  selected: tabVal,
  list: tabList,
} = useSelect<ListItem>(listInit)

// const curComp = computed(() => tabList.value.filter(a => a.value === tabVal.value)[0]?.comp)

const getTitle = computed(() => {
  switch (props.category) {
    case '1': return t('casino')
    case '2': return t('sports_label')
    default: return t('promo_activity')
  }
})

// const showTab = computed(() => {
//   return props.category === '0' && !isMobile.value
// })

// function getComp() {
//   switch (tabVal.value) {
//     case '0':
//       return AppPromoList
//     case '4':
//       return AppPromoVipContent
//     case '5':
//       return AppPromoRebateContent
//     case '6':
//       return AppVaultDescription
//     default:
//       return AppPromoList
//   }
// }

// function searchActivity(ty: string) {
//   router.push(`/promotions/category/${ty}`)
// }
function changeTab2(val: '0' | '1' | '2' | '3' | '4' | '5' | '6') {
  // if (val === '6')
  //   windowStore.isInterestTreasure = true

  // else
  //   windowStore.isInterestTreasure = false

  tabVal.value = val
}

function rebateClick() {
  tabVal.value = '5'
  nextTick(() => {
    setTimeout(() => {
      tabRef.value?.resetTab('nearest')
    }, 50)
  })
}

function hideReceive(bool: boolean, tab: string) {
  hideReceiveBool.value = bool
  curTab.value = tab
}

function taskClick(tab: string) {
  curTab.value = tab
}

watch(tabVal, (a) => {
  if (a === '4' || a === '5')
    isShowFooterState.value = false

  else
    isShowFooterState.value = true
})

onMounted(() => {
  // 提前获取任务分类， 防止任务tab闪动
  getTaskCategoryApi({ lang: getCurrentLanguageForBackend() })
})
onActivated(() => {
  let fromPath = Local.get<string>(STORAGE_FROM_URL)?.value ?? ''
  const path = fromPath.split('/')
  path.splice(0, 2)
  fromPath = `/${path.join('/')}`
  const noResetPaths = ['/rebate-detail', '/task/task-inner-d']
  if (noResetPaths.includes(fromPath)) {
    // 保留缓存tab
  }
  else {
    tabVal.value = '0'
    nextTick(() => {
      tabRef.value?.resetTab('nearest')
    })
    setTimeout(() => {
      needAnimate.value = true
    }, 100)
  }
})
onDeactivated(() => {
  needAnimate.value = false
  // windowStore.isInterestTreasure = false
})
onBeforeRouteLeave(() => {
  isShowFooterState.value = true
})
</script>

<template>
  <AppLoading v-if="taskLoading" />
  <div v-else class="all">
    <div
      class="tab-box mt-[16px] rounded"
      :class="{
        'flex': !isMobile,
        'is-blue': globalInitMap.currentTemplate === 1 || globalInitMap.currentTemplate === 6,
      }"
    >
      <BaseTab2
        v-if="props.category === '0'"
        :key="tabList.length"
        ref="tabRef"
        :animate="needAnimate"
        class="theme-base-tab2"
        :model-value="tabVal"
        :list="tabList"
        center
        :full="isMobile"
        :need-scroll-into-view="false"
        @change="changeTab2"
      />
    </div>
    <div class="promo-content mb-[20px]" :data-tab="tabVal">
      <!-- <div v-show="tabVal === '4' || tabVal === '5'" class="py-[16px]">
        <AppVipInfoBar :promo-tab="promoTab" :hide-receive="tabVal === '5' ? undefined : hideReceiveBool" :cur-tab="tabVal === '5' ? undefined : curTab" />
      </div> -->
      <!-- <template v-if="tabVal === '0'">
        <component :is="getComp()" :key="tabVal" @rebate-click="rebateClick" />
      </template> -->

      <keep-alive>
        <component :is="allComps[tabVal]" :key="tabVal" :need-await="false" @rebate-click="rebateClick" @hide-receive="hideReceive" @task-click="taskClick" />
      </keep-alive>

      <!-- <Suspense timeout="0">
          <component :is="allComps[tabVal]" :key="tabVal" :need-await="false" @rebate-click="rebateClick" @hide-receive="hideReceive" />
          <template #fallback>
            <div class="center dialog-loading-height">
              <AppLoading />
            </div>
          </template>
        </Suspense> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab-box {
  --tg-tabvn-style-inner-padding-y: 10px;
  --tg-tabvn-style-wrap-bg-color: transparent;
  background: var(--tg-secondary-dark);
  filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25));
  &.is-blue{
    --tg-tabvn-active-text-color:#1475E1;
  }
  @include webTheme('white'){
    filter:none;
    background: #F5F5F5;
  }
  @include webTheme('green'){
    filter:none;
    --tg-tabvn-style-color: #FFFFFF;
    --tg-tabvn-active-text-color: #F6D14A;
  }
}
.group-banner-bg{
  @include webTheme('white'){
    background: #F5F5F5;
  }
}
.theme-h1{
  @include webTheme('white'){
    --tg-text-white: #111111;

  }
}
.theme-base-tab2{
  @include webTheme('white'){
    --tg-tabvn-style-wrap-bg-color:#F5F5F5;
    --tg-base-tab2-base-filter:none;
    --tg-tabvn-style-color:#111111;
    --tg-tabvn-active-text-color:#F2CA5C;
    --tg-tab-active-bar:#F2CA5C;
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
