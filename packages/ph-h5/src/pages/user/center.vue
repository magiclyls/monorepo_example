<script setup lang='ts'>
import { PhBaseAmount, PhBaseButton, PhBaseDialog, PhBaseImage, PhBaseSelectCurrency } from '@tg/bccomponents'
import { useBoolean, useLogout, useNotificationState } from '@tg/hooks'
import { IconUniArrowDown1, IconUniCopy, IconUniLogout, IconUniRefresh, IconUserKefu } from '@tg/icons'
import {
  useAffiliate,
  useAppStore,
  useBrandStore,
  useCurrency,
  useVipStore,
} from '@tg/stores'
import { getLangConfig } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppSettingCardWrap from '~/components/AppSettingCardWrap.vue'
import { copyTest } from '~/utils'

interface IMenuItem {
  title: string
  icon: string
  path: string
  key: string
  type?: string
}

defineOptions({ name: 'AppUserCenter' })
const defaultAvator = '/ph-h5/png/avatar.png'
const { t } = useI18n()
const { countTotal } = useNotificationState()
const { userInfo } = storeToRefs(useAppStore())
const currencyStore = useCurrency()
const { currentGlobalCurrencyMap, loadingMemberBalance, currencyList } = storeToRefs(currencyStore)
const { isSafeInterestOpen } = storeToRefs(useBrandStore())
const { isVipOpen, isHaveVIPRebateConfig } = storeToRefs(useVipStore())
const { isOpen: isAffiliateOpen } = storeToRefs(useAffiliate())
const router = useRouter()
const { bool: showLogout, setTrue: openLogoutDialog } = useBoolean(false)
const { runMemberLogout, logoutLoading } = useLogout(() => {
  showLogout.value = false
})

const url = computed(() => userInfo.value?.avatar_url)
const diabled = computed(() => {
  return currencyList.value.length < 2
})
const langLabel = computed(() => {
  const str = getLangConfig()?.title ?? ''
  return str === '简体中文' ? '中文' : str
})
// 存提
const walletList = computed(() => {
  return [
    { title: t('存款'), icon: '/ph-h5/png/uni-deposit.png', type: 'image', path: '/wallet?tab=deposit', key: 'deposit' },
    { title: t('提款'), icon: '/ph-h5/png/uni-withdraw.png', type: 'image', path: '/wallet?tab=withdraw', key: 'withdraw' },
    { title: t('交换1'), icon: '/ph-h5/png/uni-exchange.png', type: 'image', path: '/wallet?tab=exchange', key: 'exchange' },
  ]
})
// 优惠中心
const propmoList = computed(() => {
  return [
    isVipOpen.value ? { title: t('贵宾VIP'), icon: '/ph-h5/png/user-vip.png', type: 'image', path: '/vip', key: 'vip' } : undefined,
    isAffiliateOpen.value ? { title: t('代理加盟'), icon: '/ph-h5/png/user-invite.png', type: 'image', path: '/affiliate', key: 'affiliate' } : undefined,
    isSafeInterestOpen.value ? { title: t('利息宝'), icon: '/ph-h5/png/user-safe.png', type: 'image', path: '/interest', key: 'safe' } : undefined,
    { title: t('兑换码'), icon: '/ph-h5/png/user-coupon.png', type: 'image', path: '/user/coupon', key: 'coupon' },
    isHaveVIPRebateConfig.value ? { title: t('实时返水'), icon: '/ph-h5/png/user-rebate.png', type: 'image', path: '/rebate-center', key: 'rebate' } : undefined,
    { title: t('优惠活动'), icon: '/ph-h5/png/user-promo.png', type: 'image', path: '/promotions', key: 'promotion' },
  ].filter(a => a !== void 0)
})
// 服务中心
const serviceList = computed(() => {
  return [
    { title: t('设置'), icon: '/ph-h5/png/user-setting.png', type: 'image', path: '/setting', key: 'setting' },
    { title: `${langLabel.value}`, icon: '/ph-h5/png/user-lang.png', type: 'image', path: '/user/language', key: 'language' },
    { title: t('消息'), icon: '/ph-h5/png/user-message.png', type: 'image', path: '/message', key: 'message' },
    { title: t('帮助'), icon: '/ph-h5/png/user-help.png', type: 'image', path: '/policies/help', key: 'help' },
    // { title: t('政策'), icon: '/ph-h5/png/user-police.png', type: 'image', path: '/policies', key: 'policies' },
    { title: t('自我排除'), icon: '/ph-h5/png/self_exclusion.png', type: 'image', path: '/self-exclusion', key: 'self-exclusion' },
    { title: t('登出'), icon: '/ph-h5/png/user-logout.png', type: 'image', path: '', key: 'logout' },
  ]
})

function onMenuItemClick(item: IMenuItem) {
  if (item.path) {
    router.push(item.path)
    return
  }

  switch (item.key) {
    case 'logout':
      openLogoutDialog()
      break

    default:
      break
  }
}
function onChoose(data: any) {
  currencyStore.setCurrentGlobalCurrency(data)
}
</script>

<template>
  <div class="app-user">
    <div class="h-[42rem] w-full flex items-center justify-between relative mb-[16rem]">
      <div class="flex items-center text-[18rem] p-[10rem] pl-0 cursor-pointer" @click="router.back()">
        <IconUniArrowDown1 class="rotate-[90deg] text-white" />
      </div>
      <span
        class="text-[#fff] text-[18rem] font-[600] leading-[22rem] capitalize absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
      >
        {{ t('个人中心') }}
      </span>
      <div class="flex items-center text-[18rem] py-[10rem] p-0 cursor-pointer" @click="router.push('/service')">
        <IconUserKefu class="text-white" />
      </div>
    </div>
    <!-- 头部 -->
    <div class="h-[56rem] flex items-center justify-between mb-[16rem]">
      <div class="flex items-center">
        <div class="w-[58rem] h-[58rem] overflow-hidden rounded-[50%] mr-[16rem]">
          <PhBaseImage v-if="url" class="w-full h-full" :url="url" is-network :change-suffix="false" />
          <PhBaseImage v-else class="w-full h-full" :url="defaultAvator" />
        </div>
        <div class="flex flex-col text-[14rem] font-[500] text-[#fff] leading-[20rem]">
          <div class="flex mb-[8rem] items-center">
            <span>{{ t('账号') }}: {{ userInfo?.username }}</span>
            <div class="flex items-center px-[10rem] py-[2rem] opacity-50 cursor-pointer" @click="copyTest(userInfo?.username ?? '')">
              <IconUniCopy class="text-white" />
            </div>
          </div>
          <div>{{ t('等级') }}: VIP{{ userInfo?.vip }}</div>
        </div>
      </div>
      <div class="flex items-center py-[10rem] pl-[10rem] cursor-pointer" @click="router.push('/user/info')">
        <IconUniArrowDown1 class="rotate-[-90deg] text-[18rem] text-white" />
      </div>
    </div>
    <!-- 存提 -->
    <AppSettingCardWrap style="--ph-setting-card-padding-y:16rem;" class="mb-[16rem]">
      <div class="flex flex-col pb-[11rem] mb-[16rem]" style="border-bottom: 1px solid #EBEBEB;">
        <span class="mb-[8rem] text-[14rem] font-[600] leading-[20rem]">{{ t('账户余额') }}</span>
        <PhBaseSelectCurrency :t="t" :show-setting="true" @choose="onChoose">
          <div
            class="flex items-center justify-between cursor-pointer" style="--tg-base-icon-color:#9DABC8;"
          >
            <div class="h-[25rem] flex items-center">
              <PhBaseAmount
                :amount="currentGlobalCurrencyMap.balance" reverse
                :currency-type="currentGlobalCurrencyMap.type"
                style="--ph-app-amount-amount-margin:6rem;--ph-app-currency-icon-size:18rem;"
              />
              <div
                class="flex items-center px-[6rem] py-[5rem]" :class="{ 'animate-spin': loadingMemberBalance }"
                @click.stop="currencyStore.runGetMemberBalance()"
              >
                <IconUniRefresh class="text-[#9dabc9]" />
              </div>
            </div>
            <IconUniArrowDown1 v-if="!diabled" class="text-[16rem] text-[#9dabc9]" />
          </div>
        </PhBaseSelectCurrency>
      </div>
      <div class="flex justify-between text-[14rem] font-[500]">
        <div
          v-for="item in walletList" :key="item.key" class="flex items-center cursor-pointer justify-center"
          @click="onMenuItemClick(item)"
        >
          <div class="flex items-center w-[32rem] h-[32rem] justify-center text-[28rem]">
            <div v-if="item.type === 'image'" class="w-[26rem] h-[26rem]">
              <PhBaseImage :url="item.icon" class="w-full h-full" />
            </div>
            <component :is="item.icon" v-else />
          </div>
          <div class="leading-[20rem] ml-[6rem]">
            {{ item.title }}
          </div>
        </div>
      </div>
    </AppSettingCardWrap>

    <!-- 交易记录 -->
    <AppSettingCardWrap
      class="mb-[16rem] flex items-center justify-between cursor-pointer"
      @click="router.push('/transaction-record')"
    >
      <div class="flex items-center">
        <div class="w-[32rem] h-[32rem] flex items-center justify-center  mr-[6rem]">
          <div class="w-[24rem]">
            <PhBaseImage url="/ph-h5/png/user-trad.png" />
          </div>
        </div>
        <div class="flex flex-col font-[500]">
          <span class="text-[14rem] mb-[4rem] leading-[22rem]">{{ t('交易记录') }}</span>
          <span class="text-[12rem] text-[#6D7693] leading-[17rem]">{{ t('交易记录1') }}</span>
        </div>
      </div>
      <IconUniArrowDown1 class="rotate-[-90deg] text-[16rem] text-[#9dabc8]" />
    </AppSettingCardWrap>
    <!-- 投注记录 -->
    <AppSettingCardWrap
      class="mb-[16rem] flex items-center justify-between cursor-pointer"
      @click="router.push('/bets-record')"
    >
      <div class="flex items-center">
        <div class="w-[32rem] h-[32rem] flex items-center justify-center mr-[6rem]">
          <div class="w-[24rem]">
            <PhBaseImage url="/ph-h5/png/user-bets.png" />
          </div>
        </div>
        <div class="flex flex-col font-[500]">
          <span class="text-[14rem] mb-[4rem] leading-[22rem]">{{ t('投注记录') }}</span>
          <span class="text-[12rem] text-[#6D7693] leading-[17rem]">{{ t('投注记录1') }}</span>
        </div>
      </div>
      <IconUniArrowDown1 class="rotate-[-90deg] text-[16rem] text-[#9dabc8]" />
    </AppSettingCardWrap>
    <!-- 优惠中心 -->
    <AppSettingCardWrap class="mb-[16rem]">
      <h6 class="text-[16rem] font-[500] mb-[16rem] leading-[22rem]">
        {{ t('优惠中心') }}
      </h6>
      <div class="grid grid-cols-3 gap-x-[10rem] gap-y-[16rem]">
        <div
          v-for="item in propmoList" :key="item.key" class="flex cursor-pointer flex-col items-center"
          @click="onMenuItemClick(item)"
        >
          <div class="w-[32rem] h-[32rem] text-[24rem] flex items-center justify-center">
            <div v-if="item.type === 'image'" class="w-[24rem] h-[24rem]">
              <PhBaseImage :url="item.icon" class="w-full h-full" />
            </div>
            <component :is="item.icon" v-else />
          </div>
          <span class="text-[14rem] whitespace-nowrap font-[500] text-center capitalize leading-[20rem]">
            {{ item.title }}
          </span>
        </div>
      </div>
    </AppSettingCardWrap>
    <!-- 服务中心 -->
    <AppSettingCardWrap>
      <h6 class="text-[16rem] font-[500] mb-[16rem] leading-[22rem]">
        {{ t('服务中心') }}
      </h6>
      <div class="grid grid-cols-3 gap-x-[10rem] gap-y-[16rem]">
        <div
          v-for="item in serviceList" :key="item.key" class="flex cursor-pointer flex-col items-center"
          @click="onMenuItemClick(item)"
        >
          <div class="w-[32rem] h-[32rem] text-[24rem] flex relative items-center justify-center">
            <div v-if="item.type === 'image'" class="w-[24rem] h-[24rem]">
              <PhBaseImage :url="item.icon" class="w-full h-full" />
            </div>
            <component :is="item.icon" v-else />
            <span
              v-if="item.key === 'message' && countTotal > 0"
              class="inline-block absolute right-0 translate-x-[50%] top-[-4rem] leading-[14rem] rounded-[50px] bg-[#FF4D4F] px-[5rem] text-[#fff] text-[12rem] font-[600]"
            >
              {{ countTotal }}
            </span>
          </div>
          <span class="text-[14rem] whitespace-nowrap text-center font-[500] capitalize leading-[20rem]">
            {{ item.title }}
          </span>
        </div>
      </div>
    </AppSettingCardWrap>

    <!-- 登出 -->
    <PhBaseDialog
      v-model="showLogout" :icon="IconUniLogout" :title="t('登出')"
      style="--ph-base-dialog-header-font-size:400;
      --ph-base-dialog-header-font-size:16rem;
      --ph-base-dialog-icon-color:#0D2245;
      --ph-base-dialog-header-icon-mr:4rem;
      "
    >
      <div class="pt-[12rem] px-[8rem] pb-[20rem] flex flex-col">
        <span class="text-[14rem] text-[#6D7693] px-[8rem] font-[500] mb-[12rem]">{{ t('登出1') }}</span>
        <PhBaseButton
          :loading="logoutLoading"
          style="--ph-base-button-padding-y:10rem;--ph-base-button-font-weight:500;" @click="runMemberLogout"
        >
          {{ t('登出') }}
        </PhBaseButton>
      </div>
    </PhBaseDialog>
  </div>
</template>

<style lang="scss" scoped>
.app-user {
  width: 100%;
  position: relative;
  color: #0d2245;
  padding: 0 10rem 34rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 280rem;
    background: linear-gradient(180deg, #e22727 -3.42%, #ff4343 35.95%, rgba(255, 255, 255, 0.5) 94.06%);
    z-index: -1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
