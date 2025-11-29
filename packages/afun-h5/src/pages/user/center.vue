<script setup lang='ts'>
import { AfunBaseAmount, AfunBaseArrow, AfunBaseButton, AfunBaseDialog, AfunBaseImage, AfunBaseSelectCurrency } from '@tg/bccomponents'
import { useBoolean, useLogout, useNotificationState } from '@tg/hooks'
import { IconUniCopy, IconUniLogout, IconUniRefresh } from '@tg/icons'
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
import AppPageLayout from '~/components/AppPageLayout.vue'
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
const defaultAvator = '/m/afun-h5/png/avatar.png'
const { t } = useI18n()
const { countAllTotal } = useNotificationState()
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
const { isOpenCPFOnRegister } = storeToRefs(useBrandStore())

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
    { title: t('存款'), icon: '/m/afun-h5/png/uni-deposit.png', type: 'image', path: '/wallet?tab=deposit', key: 'deposit' },
    { title: t('提款'), icon: '/m/afun-h5/png/uni-withdraw.png', type: 'image', path: '/wallet?tab=withdraw', key: 'withdraw' },
    { title: t('交换1'), icon: '/m/afun-h5/png/uni-exchange.png', type: 'image', path: '/wallet?tab=exchange', key: 'exchange' },
  ]
})
// 优惠中心
const propmoList = computed(() => {
  return [
    isVipOpen.value ? { title: t('贵宾VIP'), icon: '/m/afun-h5/png/user-vip.png', type: 'image', path: '/vip', key: 'vip' } : undefined,
    isAffiliateOpen.value ? { title: t('代理加盟'), icon: '/m/afun-h5/png/user-invite.png', type: 'image', path: '/affiliate', key: 'affiliate' } : undefined,
    isSafeInterestOpen.value ? { title: t('利息宝'), icon: '/m/afun-h5/png/user-safe.png', type: 'image', path: '/interest', key: 'safe' } : undefined,
    { title: t('兑换码'), icon: '/m/afun-h5/png/user-coupon.png', type: 'image', path: '/user/coupon', key: 'coupon' },
    isHaveVIPRebateConfig.value ? { title: t('实时返水'), icon: '/m/afun-h5/png/user-rebate.png', type: 'image', path: '/rebate-center', key: 'rebate' } : undefined,
    { title: t('优惠活动'), icon: '/m/afun-h5/png/user-promo.png', type: 'image', path: '/promotions', key: 'promotion' },
  ].filter(a => a !== void 0)
})
// 服务中心
const serviceList = computed(() => {
  return [
    { title: t('设置'), icon: '/m/afun-h5/png/user-setting.png', type: 'image', path: '/setting', key: 'setting' },
    { title: `${langLabel.value}`, icon: '/m/afun-h5/png/user-lang.png', type: 'image', path: '/user/language', key: 'language' },
    // { title: t('消息'), icon: '/m/afun-h5/png/user-message.png', type: 'image', path: '/message', key: 'message' },
    isOpenCPFOnRegister.value ? { title: t('USER_KYC'), icon: '/m/afun-h5/png/user-kyc.png', type: 'image', path: '/user/kyc', key: 'kyc' } : undefined,
    // { title: t('客服'), icon: '/afun-h5/png/user-kefu.png', type: 'image', path: '/service', key: 'service' },
    { title: t('帮助'), icon: '/m/afun-h5/png/user-help.png', type: 'image', path: '/policies/help', key: 'help' },
    { title: t('自我排除'), icon: '/m/afun-h5/png/user-self-exclusion.png', type: 'image', path: '/self-exclusion', key: 'self-exclusion' },
    { title: t('登出'), icon: '/m/afun-h5/png/user-logout.png', type: 'image', path: '', key: 'logout' },
  ].filter(item => !!item)
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
  <AppPageLayout :title="t('个人中心')" style="--afun-page-layout-padding-bottom: 0">
    <template #right>
      <div><AfunBaseImage url="/m/afun-h5/png/user-customer-service.png" class="w-[17px] h-[20px]" @click="router.push('/service')" /></div>
    </template>
    <div class="app-user">
      <!-- 头部 -->
      <div class="h-[56px] flex items-center justify-between mb-[16px]">
        <div class="flex items-center">
          <div class="w-[58px] h-[58px] overflow-hidden rounded-[50%] mr-[16px]">
            <AfunBaseImage v-if="url" class="w-full h-full" :url="url" is-network :change-suffix="false" />
            <AfunBaseImage v-else class="w-full h-full" :url="defaultAvator" />
          </div>
          <div class="flex flex-col text-[16px] font-[500] text-[#fff] leading-[20px]">
            <div class="flex mb-[8px] items-center">
              <span>{{ t('账号') }}: {{ userInfo?.username }}</span>
              <div class="flex items-center px-[10px] py-[2px] opacity-50 cursor-pointer" @click="copyTest(userInfo?.username ?? '')">
                <IconUniCopy class="text-[#B1BAD3]" />
              </div>
            </div>
            <div>{{ t('等级') }}: VIP{{ userInfo?.vip }}</div>
          </div>
        </div>
        <div class="flex items-center py-[10px] pl-[10px] cursor-pointer" @click="router.push('/user/info')">
          <AfunBaseArrow />
        </div>
      </div>
      <!-- 存提 -->
      <AppSettingCardWrap style="--afun-setting-card-padding-y:16px;" class="mb-[16px]">
        <div class="flex flex-col pb-[11px] mb-[16px]" style="border-bottom: 1px solid #2F4553;">
          <span class="mb-[8px] text-[14px] font-[500] leading-[20px]">{{ t('账户余额') }}</span>
          <AfunBaseSelectCurrency :t="t" :show-setting="true" @choose="onChoose">
            <div
              class="flex items-center justify-between cursor-pointer" style="--tg-base-icon-color:#9DABC8;"
            >
              <div class="h-[25px] flex items-center">
                <AfunBaseAmount
                  :amount="currentGlobalCurrencyMap.balance" reverse
                  :currency-type="currentGlobalCurrencyMap.type"
                  style="--afun-app-amount-amount-margin:6px;--afun-app-currency-icon-size:18px;"
                />
                <div
                  class="flex items-center px-[6px] py-[5px]" :class="{ 'animate-spin': loadingMemberBalance }"
                  @click.stop="currencyStore.runGetMemberBalance()"
                >
                  <IconUniRefresh class="text-[#B1BAD3]" />
                </div>
              </div>
              <AfunBaseArrow v-if="!diabled" />
            </div>
          </AfunBaseSelectCurrency>
        </div>
        <div class="flex justify-between text-[16px] font-[500]">
          <div
            v-for="item in walletList" :key="item.key" class="flex items-center cursor-pointer justify-center"
            @click="onMenuItemClick(item)"
          >
            <div class="flex items-center w-[28px] h-[28px] justify-center text-[28px]">
              <div v-if="item.type === 'image'" class="w-[21px] h-[21px]">
                <AfunBaseImage :url="item.icon" class="w-full h-full" />
              </div>
              <component :is="item.icon" v-else />
            </div>
            <div class="leading-[20px] ml-[6px]">
              {{ item.title }}
            </div>
          </div>
        </div>
      </AppSettingCardWrap>

      <!-- 交易记录 -->
      <AppSettingCardWrap
        class="mb-[16px] flex items-center justify-between cursor-pointer"
        @click="router.push('/transaction-record')"
      >
        <div class="flex items-center">
          <div class="w-[32px] h-[32px] flex items-center justify-center  mr-[6px]">
            <div class="w-[24px]">
              <AfunBaseImage url="/m/afun-h5/png/user-trad.png" />
            </div>
          </div>
          <div class="flex flex-col font-[500]">
            <span class="text-[16px] mb-[4px] leading-[22px]">{{ t('交易记录') }}</span>
            <span class="text-[14px] text-[#B1BAD3] leading-[17px]">{{ t('交易记录1') }}</span>
          </div>
        </div>
        <AfunBaseArrow />
      </AppSettingCardWrap>
      <!-- 投注记录 -->
      <AppSettingCardWrap
        class="mb-[16px] flex items-center justify-between cursor-pointer"
        @click="router.push('/bets-record')"
      >
        <div class="flex items-center">
          <div class="w-[32px] h-[32px] flex items-center justify-center mr-[6px]">
            <div class="w-[24px]">
              <AfunBaseImage url="/m/afun-h5/png/user-bets.png" />
            </div>
          </div>
          <div class="flex flex-col font-[500]">
            <span class="text-[16px] mb-[4px] leading-[22px]">{{ t('投注记录') }}</span>
            <span class="text-[14px] text-[#B1BAD3] leading-[17px]">{{ t('投注记录1') }}</span>
          </div>
        </div>
        <AfunBaseArrow />
      </AppSettingCardWrap>
      <!-- 优惠中心 -->
      <AppSettingCardWrap class="mb-[16px]">
        <h6 class="text-[16px] font-[600] mb-[16px] leading-[22px]">
          {{ t('优惠中心') }}
        </h6>
        <div class="grid grid-cols-3 gap-x-[10px] gap-y-[16px]">
          <div
            v-for="item in propmoList" :key="item.key" class="flex cursor-pointer flex-col items-center"
            @click="onMenuItemClick(item)"
          >
            <div class="w-[28px] h-[28px] text-[24px] flex items-center justify-center">
              <div v-if="item.type === 'image'" class="w-[21px] h-[21px]">
                <AfunBaseImage :url="item.icon" class="w-full h-full" />
              </div>
              <component :is="item.icon" v-else />
            </div>
            <span class="text-[14px] whitespace-nowrap font-[500] text-center capitalize leading-[20px]">
              {{ item.title }}
            </span>
          </div>
        </div>
      </AppSettingCardWrap>
      <!-- 服务中心 -->
      <AppSettingCardWrap>
        <h6 class="text-[16px] font-[600] mb-[16px] leading-[22px]">
          {{ t('服务中心') }}
        </h6>
        <div class="grid grid-cols-3 gap-x-[10px] gap-y-[16px]">
          <div
            v-for="item in serviceList" :key="item.key" class="flex cursor-pointer flex-col items-center"
            @click="onMenuItemClick(item)"
          >
            <div class="w-[28px] h-[28px] text-[24px] flex relative items-center justify-center">
              <div v-if="item.type === 'image'" class="w-[21px] h-[21px]">
                <AfunBaseImage :url="item.icon" class="w-full h-full" />
              </div>
              <component :is="item.icon" v-else />
              <span
                v-if="item.key === 'message' && countAllTotal > 0"
                class="inline-block absolute right-0 translate-x-[50%] top-[-4px] leading-[14px] rounded-[50px] bg-[#FF4D4F] px-[5px] text-[#fff] text-[12px] font-[600]"
              >
                {{ countAllTotal }}
              </span>
            </div>
            <span class="text-[14px] whitespace-nowrap text-center font-[500] capitalize leading-[20px]">
              {{ item.title }}
            </span>
          </div>
        </div>
      </AppSettingCardWrap>

      <!-- 登出 -->
      <AfunBaseDialog
        v-model="showLogout" :icon="IconUniLogout" :title="t('登出')"
        style="--afun-base-dialog-header-font-size:400;
      --afun-base-dialog-header-font-size:16px;
      --afun-base-dialog-icon-color:#B1BAD3;
      --afun-base-dialog-header-icon-mr:4px;
      "
      >
        <div class="pt-[12px] px-[8px] pb-[20px] flex flex-col">
          <span class="text-[14px] text-[#6D7693] px-[8px] font-[600] mb-[12px]">{{ t('登出1') }}</span>
          <AfunBaseButton
            :loading="logoutLoading"
            style="
              --afun-base-button-padding-y:10px;
              --afun-base-button-font-weight:500;
              --afun-base-button-primary-background-color: #E91134;
              --afun-base-button-primary-text-color: #FFFFFF;
              --afun-base-button-font-size: 14px;
            "
            @click="runMemberLogout"
          >
            {{ t('登出') }}
          </AfunBaseButton>
        </div>
      </AfunBaseDialog>
    </div>
  </AppPageLayout>
</template>

<style lang="scss" scoped>
.app-user {
  width: 100%;
  // min-height: 100vh;
  position: relative;
  color: #fff;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 280px;
    background: #1a2c38;
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
