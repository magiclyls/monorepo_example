<script lang="ts" setup>
import { ApiMemberVipScoreConfig } from '@tg/apis'

interface Props {
  hideReceive?: boolean
  curTab?: string
  promoTab?: 'vip' | 'rebate'
  vipTab?: string
}

defineOptions({
  name: 'AppVipInfoBar2',
})

const props = withDefaults(defineProps<Props>(), {
  hideReceive: false,
})

const isInPromoVip = inject('isInPromoVip', false)
const isInPromoRebate = inject('isInPromoRebate', false)

const { openLoginDialog } = useLoginDialog()
const { t } = useI18n()
const route = useRoute()
const {
  isLogin,
  userInfo,
  currentGlobalCurrency,
  isVipOpen,
  rebateAutomatic,
  isVipUpgradeBonusOpen,
  vipConfigData,
} = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())
const { openVipBonusDialog } = useDialogVipBonus()
const { openRealTimeRebateDialog } = useDialogRealTimeRebate()
const {
  currentLevel,
  score,
  progress,
  isMaxLevel,
  isKeepLevelOpen,
  isVipPointMode,
  isHaveRetainConfig,
  isHaveDepositRetainConfig,
  currencyModeCur,
} = useVipInfo()
// 积分配置
const { runAsync: runAsyncVipScoreConfig, data: dataVipScoreConfig } = useRequest(ApiMemberVipScoreConfig)

const path = computed(() => {
  return `/${route.path.split('/').slice(2).join('/')}`
})
const _isInPromoRebate = computed(() => props.promoTab === 'rebate' || isInPromoRebate)
const _isInPromoVip = computed(() => props.promoTab === 'vip' || isInPromoVip)
const _progressString = computed(() => `${+progress.value > 100 ? 100 : progress.value}%`)
// 是否同时有保级充值和保级打码
const isHaveTwoProgress = computed(() => isHaveRetainConfig.value && isHaveDepositRetainConfig.value)
// 保级打码进度
const progressRetain = computed(() => {
  if (userInfo.value && currentLevel.value) {
    if (+currentLevel.value.retain === 0)
      return 100
    const p = mul(+toFixed((+userInfo.value.retain / +currentLevel.value.retain), 4), 100)
    return +p > 100 ? 100 : +p
  }
  return 0
})
// 保级充值进度
const progressDepositRetain = computed(() => {
  if (userInfo.value && currentLevel.value) {
    if (+currentLevel.value.deposit_retain === 0)
      return 100
    const p = mul(+toFixed((+userInfo.value.deposit_retain / +currentLevel.value.deposit_retain), 4), 100)
    return +p > 100 ? 100 : +p
  }
  return 0
})
// 保级打码进度条样式 - 大于0时要有最小宽度
const progressRetainPercent = computed(() => {
  if (isHaveTwoProgress.value) {
    if (progressRetain.value === 0)
      return '0%'
    return `${(progressRetain.value / 2 <= 14 ? 14 : progressRetain.value / 2).toFixed(2)}%`
  }
  return `${progressRetain.value}%`
})
// 保级充值进度条样式 - 大于0时要有最小宽度
const progressDepositRetainPercent = computed(() => {
  if (isHaveTwoProgress.value) {
    if (progressDepositRetain.value === 0)
      return '0%'
    return `${(progressDepositRetain.value / 2 <= 14 ? 14 : progressDepositRetain.value / 2).toFixed(2)}%`
  }
  return `${progressDepositRetain.value}%`
})

// 活动首页的晋级奖金
const isPromoHomeUpgradeTab = computed(() => props.curTab === '0')
// vip页面的晋级奖金
const isVipPageUpgradeTab = computed(() => props.vipTab === 'vipBonus')
// vip页面的领取记录
const isVipPageReceiveTab = computed(() => props.vipTab === 'receive')

// 是否梯级模式 梯级模式时显示预期返水 vip模式显示vip info bar
const isShowRebateCenterBanner = computed(() => rebateAutomatic.value && rebateAutomatic.value.mode === '2')
// 预期返水的card只在返水页面显示
const isRebatePage = computed(() => route.fullPath.includes('/rebate-center?tab=rebate'))
const isRebateRecordPage = computed(() => route.fullPath.includes('/rebate-center?tab=record'))
// 显示vip info bar
const isShowVipInfoBar = computed(() => {
  if (isRebatePage.value || isRebateRecordPage.value || _isInPromoRebate.value)
    return !isShowRebateCenterBanner.value
  return isVipOpen.value
})
// 展示反水按钮
const showRebateBtn = computed(() => {
  if (isLogin.value === false && !_isInPromoVip.value)
    return true

  if (rebateAutomatic.value) {
    return (+rebateAutomatic.value.automatic === 1
      ? false
      : ((!isVipPageReceiveTab.value && !isRebateRecordPage.value && isRebatePage.value) || (_isInPromoRebate.value && !_isInPromoVip.value)) && userInfo.value && +userInfo.value.rebate_state === 1 && +userInfo.value.bonus_state === 1)
  }
  return false
})
// 展示领取奖金按钮
const showBonusBtn = computed(() => {
  if (isLogin.value === false && !_isInPromoRebate.value)
    return true

  return userInfo.value
    && +userInfo.value.bonus_state === 1
    && (!(isRebatePage.value || isRebateRecordPage.value || isVipPageReceiveTab.value) || _isInPromoVip.value)
    && !_isInPromoRebate.value
    && !(isVipPageUpgradeTab.value && !isVipUpgradeBonusOpen.value)
    && !(isPromoHomeUpgradeTab.value && !isVipUpgradeBonusOpen.value)
})

async function openReceive() {
  if (isLogin.value === false) {
    openLoginDialog()
    return
  }

  if (isRebatePage.value || _isInPromoRebate.value) {
    openRealTimeRebateDialog()
  }
  else {
    openVipBonusDialog(isVipPageUpgradeTab.value || isPromoHomeUpgradeTab.value
      ? {
        vipBonusId: '-1',
        bonusType: '818',
        local_dialog_title: true,
        currencyId: vipConfigData.value?.currency,
        title: t('vip_promotion_bonus'),
      }
      : {
        local_dialog_title: true,
        title: t('vip_vip_bonus'),
        currencyId: vipConfigData.value?.currency,
      })
  }
}

watch(() => currentGlobalCurrency.value, (newVal) => {
  runAsyncVipScoreConfig({
    cur: currencyConfig[newVal].cur,
  })
})

// 积分模式
if (isVipPointMode.value)
  runAsyncVipScoreConfig({ cur: currencyConfig[isLogin.value ? currentGlobalCurrency.value : languageConfig[getCurrentLanguageForFrontend()].currency].cur })
// 币种模式
else
  runAsyncVipScoreConfig({ cur: currencyConfig[currencyModeCur.value!].cur })
</script>

<template>
  <div class="vip-info-bar2 w-full" :class="[isMobile ? '' : 'max-w-[351px]']">
    <AppRebateCenterBanner
      v-if="(isRebatePage || isRebateRecordPage || _isInPromoRebate) && isShowRebateCenterBanner && isLogin"
      :show-rebate-btn="Boolean(showRebateBtn)" />

    <!-- vip模式 -->
    <div v-if="isShowVipInfoBar" class="vip-wrapper relative">
      <div class="vip-card" :class="{ 'have-receive-btn': (showRebateBtn || showBonusBtn) && !hideReceive }">
        <div class="mb-[4px] flex items-center">
          <div class="mr-[18px] h-[54px] w-[50px]">
            <BaseImage url="/png/vip-club/img1.png" />
          </div>
          <span class="text-[22px] font-medium text-[#D5b086]">VIP{{ userInfo?.vip ?? '0' }}</span>
        </div>

        <!-- 当前 -->
        <div class="w-full">
          <div class="mb-[4px] leading-[17px]">
            <span v-if="isMaxLevel">{{ t('vip_current_level_top') }}</span>
            <span v-else>
              <span v-if="isVipPointMode">
                {{ t('vip_current_points') }}<span class="theme-num-text ml-[4px]">{{ parseInt(score.toString())
                }}</span>
              </span>
              <span v-else class="flex items-center">
                {{ t('vip_current_bets') }}<span class="theme-num-text mx-[4px]">{{ parseInt(score.toString()) }}</span>
                <AppCurrencyIcon v-if="currencyModeCur" :currency-type="currencyModeCur"
                  style="--tg-app-currency-icon-size:12px;" />
              </span>
            </span>
          </div>
          <!-- 进度条 -->
          <div v-if="!isMaxLevel" class="theme-progress-bg relative w-full text-center">
            <div class="progress-gold h-full rounded-[20px]" :style="{ width: _progressString }" />
            <span class="absolute top-0 font-medium text-white">{{ _progressString }}</span>
          </div>
          <div class="mt-[4px] leading-[17px]">
            <span v-show="dataVipScoreConfig && isVipPointMode">
              {{ dataVipScoreConfig?.value.replace(",", `${dataVipScoreConfig?.key === '704' ?
                `${getCurrencyConfigByCode(dataVipScoreConfig?.key ?? '706').name}` :
                getCurrencyConfigByCode(dataVipScoreConfig?.key ?? '706').name}=`) }}{{ $t('integral') }}
            </span>
          </div>
        </div>

        <template v-if="isKeepLevelOpen && (isHaveRetainConfig || isHaveDepositRetainConfig)">
          <!-- 一根线 -->
          <div class="a-line" />

          <!-- 保级 -->
          <div>
            <div class="mb-[4px] font-medium leading-[17px]">
              <span v-if="isHaveDepositRetainConfig">
                {{ t('vip_keep_level_deposit') }}<span class="theme-num-text ml-[4px]">{{ currentLevel?.deposit_retain
                }}</span>
              </span>
              <span v-if="isHaveRetainConfig && !isHaveDepositRetainConfig">
                {{ isVipPointMode ? t('keep_integral') : t('vip_keep_level_bets') }}<span
                  class="theme-num-text ml-[4px]">{{ currentLevel?.retain }}</span>
              </span>
            </div>
            <!-- 2个进度条背景 -->
            <div class="theme-progress-bg relative w-full flex">
              <!-- 保级打码 -->
              <div v-if="isHaveRetainConfig" class="progress-blue h-full overflow-hidden rounded-[20px] text-center"
                :class="{ isHaveTwoProgress }" :style="{ width: progressRetainPercent }">
                <span v-show="progressRetain > 0" class="inline-block font-medium leading-[14px] text-white"
                  :class="[isHaveTwoProgress ? '' : 'absolute left-[50%] translate-x-[-50%]']">
                  {{ progressRetain }}%
                </span>
              </div>
              <!-- 保级充值 -->
              <div v-if="isHaveDepositRetainConfig" class="progress-purple h-full rounded-[20px] text-center"
                :class="{ isHaveTwoProgress: isHaveTwoProgress && progressRetain > 0 }"
                :style="{ width: progressDepositRetainPercent }">
                <span v-show="progressDepositRetain > 0" class="inline-block font-medium leading-[14px] text-white"
                  :class="[isHaveTwoProgress ? '' : 'absolute left-[50%] translate-x-[-50%]']">
                  {{ progressDepositRetain }}%
                </span>
              </div>
            </div>
            <div v-if="isHaveTwoProgress" class="mt-[4px] font-medium leading-[17px]">
              <span>
                {{ isVipPointMode ? t('keep_integral') : t('vip_keep_level_bets') }}<span
                  class="theme-num-text ml-[4px]">{{ currentLevel?.retain }}</span>
              </span>
            </div>
          </div>

          <!-- 两个示意图 -->
          <div v-if="isHaveTwoProgress" class="mt-[10px] flex justify-center leading-[17px]">
            <div class="mr-[30px] flex items-center">
              <div class="progress-purple mr-[6px] h-[8px] w-[16px] rounded-[1px]" />
              <span>{{ t('recharge_short') }}</span>
            </div>
            <div class="flex items-center">
              <div class="progress-blue mr-[6px] h-[8px] w-[16px] rounded-[1px]" />
              <span>{{ isVipPointMode ? t('integral') : t('vip_add_mosaic') }}</span>
            </div>
          </div>
        </template>
      </div>
      <!-- 领取按钮 -->
      <div v-if="(showRebateBtn || showBonusBtn) && !hideReceive" class="green-btn">
        <span class="theme-btn-text" @click="openReceive">
          {{ showRebateBtn ? t('vip_get_rebates') : t('receive_bonus') }}
        </span>
        <svg viewBox="0 0 156 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0.538658 5.64146C-0.652478 2.99449 1.28371 0 4.18634 0H152C154.209 0 156 1.79086 156 4V36C156 38.2091 154.209 40 152 40H18.5863C17.0123 40 15.5846 39.0769 14.9387 37.6415L0.538658 5.64146Z"
            fill="currentColor" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --vip-text-common-color: var(--tg-secondary-light);
}

[theme='white'] {
  --vip-text-common-color: #555555;
}
</style>

<style scoped lang="scss">
.vip-wrapper {
  box-shadow: 0 2px 4px #{rgba($color: var(--tg-color-black-rgb), $alpha: 0.2)};
  border-radius: 10px;

  @include webTheme('white') {
    box-shadow: none;
  }

  .vip-card {
    width: 100%;
    padding: 4px 10.5px 10px;
    border-radius: 10px;
    position: relative;
    background-color: #213743;
    color: var(--tg-text-lightgrey);
    font-size: 12px;
    font-weight: 600;

    @include webTheme('green') {
      background-color: #055434;
    }

    @include webTheme('white') {
      background-color: #f5f5f5;
    }

    &.have-receive-btn {
      clip-path: polygon(0% 0%, 52% 0%, 58% 45px, 100% 45px, 100% 100%, 0% 100%);
    }

    .theme-num-text {
      color: #fff;

      @include webTheme('white') {
        color: #111;
      }
    }

    .theme-progress-bg {
      height: 14px;
      border-radius: 20px;
      background: rgba(217, 217, 217, 0.15);
      overflow: hidden;

      @include webTheme('white') {
        background: #c1c1c1;
      }
    }

    .a-line {
      width: 100%;
      border-top: 1px dashed #3c5b6c;
      margin: 9px 0;

      @include webTheme('green') {
        border-color: #0e6746;
      }

      @include webTheme('white') {
        border-color: #e3e3e3;
      }
    }
  }

  .green-btn {
    width: 45%;
    height: 40px;
    position: absolute;
    top: 0;
    right: 0;
    color: #00e701;

    @include webTheme('green') {
      color: #f6d14a;
    }

    @include webTheme('white') {
      color: #f2ca5c;
    }

    svg {
      width: 100%;
      height: 100%;
      display: block;
      preserveaspectratio: none;
    }

    .theme-btn-text {
      cursor: pointer;
      display: block;
      width: 89.87%;
      color: #05080a;
      position: absolute;
      right: 0;
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      font-weight: 600;

      @include webTheme('green') {
        color: #02432d;
      }

      @include webTheme('white') {
        color: #111;
      }

      &:active {
        transform: scale(0.96);
      }
    }
  }

  .progress-gold {
    background-image: linear-gradient(90deg, #ffd5a5 0%, #876947 100%);
  }

  .progress-blue {
    background-image: linear-gradient(90deg, #08eaff 0%, #0051de 100%);

    &.isHaveTwoProgress {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
  }

  .progress-purple {
    background-image: linear-gradient(90deg, #fb26ff 0%, #8005a2 100%);

    &.isHaveTwoProgress {
      position: relative;
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;

      ::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 6px;
        height: 14px;
        background: #0051de;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
      }
    }
  }
}
</style>
