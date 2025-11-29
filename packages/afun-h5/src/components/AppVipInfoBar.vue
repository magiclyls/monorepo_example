<script lang="ts" setup>
import { ApiMemberVipScoreConfig } from '@tg/apis'
import { AfunBaseAmount, AfunBaseDialog, AfunBaseImage } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniRebate } from '@tg/icons'
import { useAppStore, useCurrency, useVipStore } from '@tg/stores'
import { languageConfig } from '@tg/types'
import { getCurrencyConfig, mul, toFixed } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppRebateCenterBanner from '~/components/AppRebateCenterBanner.vue'
import AppRebateRealTimeRebateDialog from '~/components/AppRebateRealTimeRebateDialog.vue'
import AppVipBonusDialog from '~/components/AppVipBonusDialog.vue'

interface Props {
  hideReceive?: boolean
  vipTab?: string
}

defineOptions({
  name: 'AppVipInfoBar',
})

const props = withDefaults(defineProps<Props>(), {
  hideReceive: false,
})

const isInPromoVip = inject('isInPromoVip', false)
const isInPromoRebate = inject('isInPromoRebate', false)

const { t } = useI18n()
const router = useRouter()
const { isLogin, userInfo } = storeToRefs(useAppStore())
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const {
  isVipOpen,
  rebateAutomatic,
  isVipUpgradeBonusOpen,
  currentLevel,
  score,
  progress,
  isMaxLevel,
  isKeepLevelOpen,
  isVipPointMode,
  isHaveRetainConfig,
  isHaveDepositRetainConfig,
  currencyModeCur,
  vipConfigData,
} = storeToRefs(useVipStore())
const route = useRoute()
const { bool: showRealTimeRebate, setTrue: openRealTimeRebateDialog } = useBoolean(false)
const { bool: showVipBonusDialog, setTrue: setShowVipBonusDialog } = useBoolean(false)

// 积分配置
const { runAsync: runAsyncVipScoreConfig, data: dataVipScoreConfig } = useRequest(ApiMemberVipScoreConfig)

const _isInPromoRebate = computed(() => isInPromoRebate)
const _isInPromoVip = computed(() => isInPromoVip)
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
const isPromoHomeUpgradeTab = computed(() => false)
// vip页面的晋级奖金
const isVipPageUpgradeTab = computed(() => props.vipTab === 'vip-bonus')
// vip页面的领取记录
const isVipPageReceiveTab = computed(() => props.vipTab === 'receive')

// 是否梯级模式 梯级模式时显示预期返水 vip模式显示vip info bar
const isShowRebateCenterBanner = computed(() => rebateAutomatic.value && rebateAutomatic.value.mode === '2')
// 预期返水的card只在返水页面显示
const isRebatePage = computed(() => route.name === 'RebateCenterRebate')
const isRebateRecordPage = computed(() => route.name === 'RebateCenterRecord')
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

const vipBonusDialogTitle = ref('')
const vipBonusDialogProps = ref()
function openVipBonusDialog(config: any) {
  vipBonusDialogTitle.value = config.title
  vipBonusDialogProps.value = config
  setShowVipBonusDialog()
}

async function openReceive() {
  if (isLogin.value === false) {
    router.push('/login')
    return
  }

  if (_isInPromoRebate.value) {
    openRealTimeRebateDialog()
  }
  else {
    openVipBonusDialog(isVipPageUpgradeTab.value || isPromoHomeUpgradeTab.value
      ? {
          vipBonusId: '-1',
          bonusType: '818',
          currencyId: vipConfigData.value?.currency,
          title: t('晋级奖金'),
        }
      : {
          title: t('VIP奖金'),
          currencyId: vipConfigData.value?.currency,
        })
  }
}

watch(currentGlobalCurrencyMap, (newVal) => {
  runAsyncVipScoreConfig({
    cur: newVal.cur,
  })
})

runAsyncVipScoreConfig({ cur: isLogin.value ? currentGlobalCurrencyMap.value.cur : getCurrencyConfig(languageConfig[getLang()].currency).cur })
</script>

<template>
  <div class="vip-info-bar2 w-full">
    <AppRebateCenterBanner
      v-if="(isRebatePage || isRebateRecordPage || _isInPromoRebate) && isShowRebateCenterBanner"
      :show-rebate-btn="Boolean(showRebateBtn)" @open-receive="openRealTimeRebateDialog"
    />

    <!-- vip模式 -->
    <div v-if="isShowVipInfoBar" class="vip-wrapper relative">
      <div class="vip-card" :class="{ 'have-receive-btn': (showRebateBtn || showBonusBtn) && !hideReceive }">
        <div class="mb-[4px] flex items-center">
          <div class="mr-[18px] h-[54px] w-[50px]">
            <AfunBaseImage url="/m/afun-h5/png/vip-img1.png" />
          </div>
          <span class="text-[22px] font-[600] text-[#D5B086]">VIP{{ userInfo?.vip ?? '0' }}</span>
        </div>

        <!-- 当前 -->
        <div class="w-full">
          <div class="mb-[4px] leading-[17px]  text-[#B1BAD3]">
            <span v-if="isMaxLevel">{{ t('当前等级已达上限') }}</span>
            <span v-else>
              <span v-if="isVipPointMode">
                {{ t('当前积分') }}<span class="theme-num-text ml-[4px]">{{ parseInt(score.toString()) }}</span>
              </span>
              <span v-else class="flex items-center">
                {{ t('当前有效流水') }}<AfunBaseAmount class="theme-num-text mx-[4px]" :amount="parseInt(score.toString())" :currency-type="currencyModeCur" style="--afun-base-amount-font-size: 12px; --afun-app-currency-icon-size: 14px" />
              </span>
            </span>
          </div>
          <!-- 进度条 -->
          <div v-if="!isMaxLevel" class="theme-progress-bg relative w-full text-center">
            <div class="progress-gold h-full rounded-[20px]" :style="{ width: _progressString }" />
            <span class="absolute top-0 font-[600] text-[#fff] leading-[14px]">{{ _progressString }}</span>
          </div>
          <div class="mt-[4px] leading-[17px]">
            <span v-show="dataVipScoreConfig && isVipPointMode">
              {{ dataVipScoreConfig?.value.replace(",", `${dataVipScoreConfig?.key === '704'
                ? `${getCurrencyConfig(dataVipScoreConfig?.key ?? '706').name}` : getCurrencyConfig(dataVipScoreConfig?.key
                  ?? '706').name}=`) }}{{ $t('积分') }}
            </span>
          </div>
        </div>

        <template v-if="isKeepLevelOpen && (isHaveRetainConfig || isHaveDepositRetainConfig)">
          <!-- 一根线 -->
          <div class="a-line" />

          <!-- 保级 -->
          <div>
            <div class="mb-[4px] font-[600] leading-[17px] text-[#B1BAD3]">
              <span v-if="isHaveDepositRetainConfig">
                {{ t('保级充值') }}<span class="theme-num-text ml-[4px]">{{ currentLevel?.deposit_retain }}</span>
              </span>
              <span v-if="isHaveRetainConfig && !isHaveDepositRetainConfig">
                {{ isVipPointMode ? t('保级积分') : t('保级有效流水') }}<span class="theme-num-text ml-[4px]">{{
                  currentLevel?.retain }}</span>
              </span>
            </div>
            <!-- 2个进度条背景 -->
            <div class="theme-progress-bg relative w-full flex">
              <!-- 保级打码 -->
              <div
                v-if="isHaveRetainConfig"
                class="progress-blue h-full overflow-hidden rounded-[20px] flex items-center justify-center"
                :class="{ isHaveTwoProgress }" :style="{ width: progressRetainPercent }"
              >
                <span
                  v-show="progressRetain > 0" class="inline-block font-[600]  text-[#fff]"
                  :class="[isHaveTwoProgress ? '' : 'absolute left-[50%] translate-x-[-50%]']"
                >
                  {{ progressRetain }}%
                </span>
              </div>
              <!-- 保级充值 -->
              <div
                v-if="isHaveDepositRetainConfig"
                class="progress-purple h-full rounded-[20px] flex items-center justify-center"
                :class="{ isHaveTwoProgress: isHaveTwoProgress && progressRetain > 0 }"
                :style="{ width: progressDepositRetainPercent }"
              >
                <span
                  v-show="progressDepositRetain > 0" class="inline-block font-[600] text-[#fff]"
                  :class="[isHaveTwoProgress ? '' : 'absolute left-[50%] translate-x-[-50%]']"
                >
                  {{ progressDepositRetain }}%
                </span>
              </div>
            </div>
            <div v-if="isHaveTwoProgress" class="mt-[4px] font-[600] leading-[17px] text-[#B1BAD3]">
              <span>
                {{ isVipPointMode ? t('保级积分') : t('保级有效流水') }}<span class="theme-num-text ml-[4px]">{{
                  currentLevel?.retain }}</span>
              </span>
            </div>
          </div>

          <!-- 两个示意图 -->
          <div v-if="isHaveTwoProgress" class="mt-[10px] flex justify-center leading-[17px]">
            <div class="mr-[30px] flex items-center  text-[#B1BAD3]">
              <div class="progress-purple mr-[6px] h-[8px] w-[16px] rounded-[1px]" />
              <span>{{ t('充值') }}</span>
            </div>
            <div class="flex items-center  text-[#B1BAD3]">
              <div class="progress-blue mr-[6px] h-[8px] w-[16px] rounded-[1px]" />
              <span>{{ isVipPointMode ? t('积分') : t('有效流水') }}</span>
            </div>
          </div>
        </template>
      </div>
      <!-- 领取按钮 -->
      <div v-if="(showRebateBtn || showBonusBtn) && !hideReceive" class="green-btn">
        <span class="theme-btn-text" @click="openReceive">
          {{ showRebateBtn ? t('领取返水') : t('领取奖金') }}
        </span>
        <svg viewBox="0 0 156 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#24EE89;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#9FE871;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path
            d="M0.538658 5.64146C-0.652478 2.99449 1.28371 0 4.18634 0H152C154.209 0 156 1.79086 156 4V36C156 38.2091 154.209 40 152 40H18.5863C17.0123 40 15.5846 39.0769 14.9387 37.6415L0.538658 5.64146Z"
            fill="url(#greenGradient)"
          />
        </svg>
      </div>
    </div>

    <!-- 领取实时返水弹窗 -->
    <AfunBaseDialog v-if="showRealTimeRebate" v-model="showRealTimeRebate" :show-close="false">
      <AppRebateRealTimeRebateDialog />
    </AfunBaseDialog>
    <!-- 领取vip奖金 -->
    <AfunBaseDialog
      v-if="showVipBonusDialog" v-model="showVipBonusDialog" :auto-size="false" :title="vipBonusDialogTitle"
      :icon="IconUniRebate"
      style="--afun-base-dialog-close-color: #6D7693;"
    >
      <AppVipBonusDialog v-bind="vipBonusDialogProps" />
    </AfunBaseDialog>
  </div>
</template>

<style scoped lang="scss">
.vip-wrapper {
  .vip-card {
    width: 100%;
    padding: 4px 10px 10px;
    border-radius: 4px;
    position: relative;
    // background-image: linear-gradient(98deg, #00d4f0 2.62%, #0089ce 93.37%);
    background: #213743;
    color: #6d7693;
    font-size: 12px;
    font-weight: 500;
    &.have-receive-btn {
      clip-path: polygon(0% 0%, 52% 0%, 58% 45px, 100% 45px, 100% 100%, 0% 100%);
    }

    .theme-num-text {
      color: #fff;
    }

    .theme-progress-bg {
      height: 12px;
      border-radius: 20px;
      background: rgba(217, 217, 217, 0.15);
      overflow: hidden;
    }

    .a-line {
      width: 100%;
      border-top: 1px dashed #3c5b6c;
      margin: 9px 0;
    }
  }

  .green-btn {
    width: 45%;
    height: 40px;
    position: absolute;
    top: 0;
    right: 0;
    color: #24ee89;

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
