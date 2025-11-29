<script lang="ts" setup>
import {
  IconAfunLogout,
  IconAfunPcConversions,
  IconAfunSelfExclusion,
  IconNavbarUser,
  IconAfunWithdrawal,
  IconChessAffiliate, IconCopy,
  IconDeposit,
  IconNavbarCart,
  IconNavbarWallet,
  IconSptUserBet,
  IconTabbarBet,
  IconUniCoupon,
  IconUniLogout,
  IconUniRebatereal,
  IconUniSet,
  IconUniTransfer,
  IconUniPolicies
} from '@tg/icons'
import Home from './home.vue'

defineOptions({
  name: 'CenterLayout',
})

const router = useLocalRouter()
const { t } = useI18n()
const appStore = useAppStore()
const brandStore = useBrandStore()
const { brandBase, isSafeInterestOpen, isKYCVerifyOpen } = storeToRefs(brandStore)
const { renderCurrencyList } = useCurrencyData()
const { hasOpenUpayRoad } = storeToRefs(appStore)
const { vip, isVipOpen, isHaveVIPRebateConfig } = useVipInfo()
const { userInfo } = storeToRefs(useAppStore())
const { openNotify } = useNotify()
const { openLogoutDialog } = useLogoutDialog()
const { isOpen: isAffiliateOpen } = storeToRefs(useAffiliate())
const walletItem = computed(() => {
  const arr = [
    {
      title: t('deposit'),
      path: '/center/deposit',
      icon: IconNavbarWallet,
    },
    {
      title: t('menu_title_settings_withdrawals'),
      path: '/center/withdraw',
      icon: IconAfunWithdrawal,

    }
  ]
  // 法币数据
  const fiatArr = renderCurrencyList.value.filter(a => !application.isVirtualCurrency(a.type))
  // 虚拟币数据
  const virArr = renderCurrencyList.value.filter(a => application.isVirtualCurrency(a.type))
  if (Number(brandBase.value?.currency_exchange) > 0 && fiatArr.length > 0 && virArr.length > 0)
    arr.push({
      title: t('provably_fair_conversions'),
      path: '/center/conversions',
      icon: IconAfunPcConversions,
    })
  return arr
})


const recordItem = [
  {
    title: t('header_profile_drop_down_menu_transaction_record'),
    path: '/center/transaction-record',
    icon: IconTabbarBet,
  },
  {
    title: t('bet_record'),
    path: '/center/bet-record',
    icon: IconSptUserBet,
  },
]
const discountItem = computed(() => [
  // isAffiliateOpen.value ? {
  //   title: t('affiliate'),
  //   path: '/affiliate/invitation-link',
  //   icon: IconChessAffiliate,
  // } : undefined,
  isSafeInterestOpen.value ? {
    title: t('safe'),
    path: '/center/safe',
    icon: IconNavbarCart,
  } : undefined,
  {
    title: t('menu-coupon'),
    path: '/center/menu-coupon',
    icon: IconUniCoupon,
  },
  isHaveVIPRebateConfig.value ? {
    title: t('real_time_rebate'),
    path: '/center/real-time-rebate',
    icon: IconUniRebatereal,
  } : undefined,
].filter(a => a !== void 0))

const serviceItem = computed(() => {
  return [
    isKYCVerifyOpen.value ?
      {
        title: t('menu_title_settings_KYC'),
        path: '/center/kyc',
        icon: IconUniPolicies,
      } : undefined,
    {
      title: t('setting'),
      path: '/center/setting',
      icon: IconUniSet,
    },
    {
      title: t('self_exclusion'),
      path: '/center/self-exclusion',
      icon: IconAfunSelfExclusion,
    },
    {
      title: t('logout'),
      path: '/center/logout',
      icon: IconAfunLogout,
    },
  ].filter(a => a !== void 0)
})
const currentTab = ref('/zh/center')

function RenderMenuItem(props: { item: any, title?: string }) {
  const title = h('div', { class: 'border-b-[1px] border-[#213743] font-semibold h-[42px] leading-[42px] pl-[8px]' }, props.title ?? '')
  const list = props.item.map((item: any) =>
    h('div', {
      class: `flex h-[42px] pl-[8px] items-center hover:bg-[#213743] cursor-pointer rounded-[4px] ${currentTab.value === ('/zh' + item.path) ? 'bg-[#213743]' : ''}`,
      onClick: () => to(item.path),
    }, [
      h('span', { class: 'center' }, [h(item.icon, { class: 'mr-[6px] text-[15px]' })]),
      h('span', null, item.title),
    ]),
  )
  return h('div', { class: 'bg-[#1A2c38] font-medium text-[14px] rounded-[4px]' }, props.title ? [title, ...list] : list)
}
function to(url: string) {
  if (url === '/center/logout') {
    return openLogoutDialog({
      callBack() {
        setTimeout(() => {
          router.push('/')
        }, 0);
      }
    })
  }
  router.push(url)
}
function copyText() {
  if (!userInfo.value) return
  application.copy(userInfo.value.username)
  openNotify({
    type: 'success',
    message: t('copy_success'),
  })
}
watch(
  () => router.currentRoute.value.path,
  (newVal) => {
    currentTab.value = newVal
  },
  { immediate: true },
)


watch(hasOpenUpayRoad, (val, old) => {
  if (val === true && old === false) {
    setTimeout(() => {
      appStore.runGetUpayBalance()
    }, 0)
  }
})
if (hasOpenUpayRoad.value)
  appStore.runGetUpayBalance()
brandStore.runAsyncBrandBaseDetail()
/* await application.allSettled([brandStore.runAsyncBrandBaseDetail()]) */
</script>

<template>
  <Home>
    <AppContent>
      <div class="max-w-[1200px] margin-auto w-full mb-[32px]">
        <div class="text-[18px] font-medium leading-[25px] pb-[17px] pt-[24px] flex"><span class="mr-[8px] center">
            <IconNavbarUser class="text-[17px]" />
          </span>{{ t('personal_center') }}</div>

        <div class="w-full flex ">
          <div
            class="w-[180px] h-full flex-shrink-0 mr-[20px] bg-[#0F212E] rounded-[4px] p-[10px] grid gap-y-[12px] auto-rows-max">
            <div class="bg-[#1A2C38] center text-[14px] font-medium rounded-[4px] py-[12px]">
              <div>
                <div class="w-full center mb-[16px]">
                  <span class="size-[58px] rounded-[100px] overflow-hidden">
                    <BaseImage url="/png/avatar/avatar.png" width="58px" height="58px" />
                  </span>
                </div>
                <div class="flex mb-[8px]"><span class="mr-[10px]">{{ t('user_account') }}：{{ userInfo?.username ??
                  '-' }}</span><span class="cursor-pointer" @click="copyText">
                    <IconCopy class="text-[14px]" />
                  </span></div>
                <div class="flex">{{ t('vip_rebate_vip_grade') }}：VIP{{ vip }}</div>
              </div>
            </div>
            <RenderMenuItem :item="walletItem" />
            <RenderMenuItem :item="recordItem" />
            <RenderMenuItem :item="discountItem" :title="t('offer_center')" />
            <RenderMenuItem :item="serviceItem" :title="t('service_center')" />
          </div>
          <div class="bg-[#0F212E] w-full h-full rounded-[4px] p-[24px]">
            <div class="w-full">
              <RouterView />
            </div>
          </div>
        </div>
      </div>
    </AppContent>
  </Home>
</template>
