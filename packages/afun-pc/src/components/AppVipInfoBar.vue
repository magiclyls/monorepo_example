<script lang="ts" setup>
import { ApiMemberVipScoreConfig } from '@tg/apis'

interface Props {
  hideReceive?: boolean
  curTab?: string
  promoTab?: 'vip' | 'rebate'
}

defineOptions({
  name: 'AppVipInfoBar',
})

const props = withDefaults(defineProps<Props>(), {
  hideReceive: false,
})

const isInPromoVip = inject('isInPromoVip')
const isInPromoRebate = inject('isInPromoRebate')

// const { openNotify } = useNotify()
const { openLoginDialog } = useLoginDialog()
const { t } = useI18n()
const route = useRoute()
const { isLogin, userInfo, currentGlobalCurrency, theme } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())
const { openVipBonusDialog } = useDialogVipBonus()
const { openRealTimeRebateDialog } = useDialogRealTimeRebate()
const { userLanguage } = storeToRefs(useLanguageStore())
const { currentLevel, score, progress, isMaxLevel, isZeroShowOther, rebateAutomatic } = useVipInfo()
// 积分配置
const { runAsync: runAsyncVipScoreConfig, data: dataVipScoreConfig } = useRequest(ApiMemberVipScoreConfig)
// 反水奖金领取
// const { runAsync: runAsyncRebateApply, loading: loadingRebateApply } = useRequest(ApiMemberRebateApply)

const _isInPromoRebate = computed(() => props.promoTab === 'rebate' || isInPromoRebate)
const _isInPromoVip = computed(() => props.promoTab === 'vip' || isInPromoVip)

const showRebateBtn = computed(() => {
  if (isLogin.value === false && !_isInPromoVip.value)
    return true

  if (rebateAutomatic.value) {
    return (+rebateAutomatic.value.automatic === 1
      ? false
      : ((!(route.path.includes('/vip/receive')) && route.path.includes('/vip/rebate')) || (_isInPromoRebate.value && !_isInPromoVip.value)) && userInfo.value && +userInfo.value.rebate_state === 1 && +userInfo.value.bonus_state === 1)
  }
  return false
})
const showBonusBtn = computed(() => {
  if (isLogin.value === false && !_isInPromoRebate.value)
    return true

  return userInfo.value && +userInfo.value.bonus_state === 1 && (!(route.path.includes('/vip/rebate') || route.path.includes('/vip/receive')) || _isInPromoVip.value) && !_isInPromoRebate.value
})

const path = computed(() => {
  return route.path
})

const showRetainTips = computed(() => {
  const _currentLevel = currentLevel.value
  const show = _currentLevel && _currentLevel.level !== 0 && !isZeroShowOther(_currentLevel.retain)
  return show ? sub(+_currentLevel.retain, score.value) : false
})

const inPromoClass = computed(() => {
  // if (isMobile.value) {
  // if (_isInPromoVip.value || _isInPromoRebate.value) {
  switch (userLanguage.value) {
    case 'zh-CN':
      return 'min-h-[91px]'
    case 'pt-BR':
      return 'min-h-[91px]'
    case 'vi-VN':
      return 'min-h-[93px]'
    default:
      return 'min-h-[91px]'
  }
  // }
  // }
})

async function openReceive() {
  if (isLogin.value === false) {
    openLoginDialog()
    return
  }

  if (path.value.includes('/vip/rebate') || _isInPromoRebate.value) {
    openRealTimeRebateDialog()
    // openRebateInfoDialog()
    // runAsyncRebateApply().then((data) => {
    //   if (data && data !== '0') {
    //     openNotify({
    //       type: 'success',
    //       title: t('vip_get_rebate'),
    //       message: t('vip_received_successfully'),
    //     })
    //   }
    //   else {
    //     openNotify({
    //       type: 'error',
    //       title: t('fail_bonus'),
    //       message: t('no_rebates_available_yet'),
    //     })
    //   }
    // })
  }
  else {
    openVipBonusDialog((path.value.includes('/vip/vip-bonus') || props.curTab === '0')
      ? {
          vipBonusId: '-1',
          bonusType: '818',
          local_dialog_title: true,
          currencyId: dataVipScoreConfig.value?.key,
          title: t('vip_promotion_bonus'),
        }
      : {
          local_dialog_title: true,
          title: t('vip_points_bonus'),
          currencyId: dataVipScoreConfig.value?.key,
        })
  }
}
function getPadding(level: number) {
  if (level < 51)
    return 'pr-[12px]'
  else if (level < 76)
    return 'pr-[12px]'
  else
    return 'px-[12px]'
}

watch(() => currentGlobalCurrency.value, (newVal) => {
  runAsyncVipScoreConfig({
    cur: currencyConfig[newVal].cur,
  })
})

runAsyncVipScoreConfig({ cur: currencyConfig[isLogin.value ? currentGlobalCurrency.value : languageConfig[getCurrentLanguageForFrontend()].currency].cur })
</script>

<template>
  <div class="bg-container flex items-end justify-between text-[14px] leading-[1.5] font-[600] text-[var(--vip-text-common-color)]">
    <div class="theme-bg max-w-[479px] flex-1 rounded-[6px] py-[4px] pt-[8px]" :class="{ isMobile }">
      <div
        class="vip-info-bar flex items-start py-[3px] pb-[6px]"
        :class="[
          currentLevel && +currentLevel?.level > 50 ? 'gap-[10px]' : '',
          getPadding(currentLevel?.level ?? 0),
          inPromoClass,
        ]"
      >
        <BaseImage class="w-[82px]" :is-network="true" :url="`/images/vip/${userInfo?.vip ?? '0'}.webp`" />
        <!-- userInfo?.vip -->
        <div class="flex-1">
          <div class="flex justify-between gap-3">
            <div v-if="isMaxLevel">
              <span>{{ $t('vip_current_points_top') }}&nbsp;</span>
            </div>
            <div v-else>
              <span>{{ $t('vip_current_points') }}&nbsp;</span>
              <span style="color:var(--vip-current-points-color)">{{ parseInt(score.toString()) }}</span>
            </div>
            <div class="theme-text">
              {{ $t('progress') }}&nbsp;{{ +progress > 100 ? 100 : progress }}%
            </div>
          </div>
          <div class="progress-bg py-[5px]">
            <BaseProgress
              width="100%"
              :percent="Number(progress)"
              :show-info="false"
              :stroke-width="6"
              :show-padding="false"
              stroke-color="var(--vip-stroke-color)" style="--tg-base-progress-inner-bg: var(--vip-progress-inner-bg)"
            />
          </div>
          <div class="flex items-start justify-between">
            <div>
              <span v-show="dataVipScoreConfig">{{ dataVipScoreConfig?.value.replace(",", `
                ${dataVipScoreConfig?.key === '704' ? `${getCurrencyConfigByCode(dataVipScoreConfig?.key ?? '706').name}`
                                                : getCurrencyConfigByCode(dataVipScoreConfig?.key ?? '706').name} = `) }}
                &nbsp;{{ $t('integral') }}</span>
            </div>
            <BaseButton
              v-if="showRebateBtn && !hideReceive"
              class="btn-receive rebate-btn relative top-[2px]"
              bg-style="primary"
              :class="{
                'vi-button-style': getCurrentLanguageForFrontend() === 'vi-VN',
                'pt-button-style': getCurrentLanguageForFrontend() === 'pt-BR',
                'mobile-nologinn-btn': isMobile && !isLogin,
              }"
              @click="openReceive"
            >
              <div
                :class="{
                  // 'max-w-[70px]': getCurrentLanguageForFrontend() === 'vi-VN',
                }"
              >
                {{ $t('vip_get_rebates') }}
              </div>
            </BaseButton>
            <BaseButton
              v-if="showBonusBtn && !hideReceive"
              class="btn-receive relative top-[2px]"
              bg-style="primary"
              :class="{
                'vi-button-style': getCurrentLanguageForFrontend() === 'vi-VN',
                'mobile-nologinn-btn': isMobile && !isLogin,
              }"
              @click="openReceive"
            >
              <div
                :class="{
                  // 'max-w-[70px]': getCurrentLanguageForFrontend() === 'vi-VN',
                }"
              >
                {{ $t('receive_bonus') }}
              </div>
            </BaseButton>
          </div>
        </div>
      </div>
      <div v-if="showRetainTips && isMobile" class="border-t-[1px] border-dashed px-[4px] py-[6px] text-center">
        {{ $t('vip_keep_current_level_need_points', { integral: +showRetainTips < 0 ? '0' : showRetainTips }) }}
      </div>
    </div>
    <div v-if="showRetainTips && !isMobile" class="mb-[6px]">
      {{ $t('vip_keep_current_level_need_points', { integral: +showRetainTips < 0 ? '0' : showRetainTips }) }}
    </div>
  </div>
</template>

<style>
:root {
  --vip-stroke-color: #fff;
  --vip-current-points-color: var(--tg-text-white);
  --vip-text-common-color: var(--tg-secondary-light);
  --vip-progress-inner-bg: #d9d9d926;
}

[theme='green'] {
  --vip-stroke-color: #42bc91;
}

[theme='greenblack'] {
  --vip-current-points-color: var(--tg-text-greenblack-main);
}

[theme='white'] {
  --vip-stroke-color: #f2ca5c;
  --vip-text-common-color: #555555;
  --vip-progress-inner-bg: #b3b3b3;
}
</style>

<style lang="scss" scoped>
.theme-bg {
  &.isMobile {
    background-color: var(--tg-secondary-grey);
    @include webTheme('white') {
      background-color: #f5f5f5;
    }
  }
  @include webTheme('green') {
    color: #3cb389;
    .theme-text {
      color: #fff;
    }
  }
}
.btn-receive {
  @include webTheme('white') {
    height: 30px;
  }
}
.mobile-nologinn-btn {
  --tg-base-button-default-fake-active-bg: var(--tg-text-green);
}
.vip-info-bar {
  --tg-base-button-padding-x: 10px;
  --tg-base-button-padding-y: 8px;
}
.bg-container {
  @include webTheme('green') {
    --tg-secondary-grey: #055434;
  }
}
@media screen and (max-width: 768px) {
  .vi-button-style {
    // --tg-spacing-button-padding-vertical-xs: 4px;
    &.rebate-btn {
      --tg-spacing-button-padding-horizontal-xs: 4px;
    }
  }
  .pt-button-style {
    // --tg-spacing-button-padding-vertical-xs: 4px;
    --tg-spacing-button-padding-horizontal-xs: 4px;
    :deep(.content) {
      width: max-content !important;
    }
  }
}
.progress-bg {
  @include webTheme('green') {
    --vip-progress-inner-bg: #197b59;
    --vip-stroke-color: #1fff20;
  }
}
</style>
