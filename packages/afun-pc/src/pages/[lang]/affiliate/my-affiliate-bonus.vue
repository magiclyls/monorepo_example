<script lang="ts" setup>
import { ApiMemberAgencyMyPromotion } from '@tg/apis'

import { IconUniDoc } from '@tg/icons'

const { t } = useI18n()
usePageTitle({ prefix: t('menu_title_my_promotion') })

const { isLogin } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())
const { userLanguage } = storeToRefs(useLanguageStore())
const location = useBrowserLocation()
const { data: proData, loading: loadMyData, runAsync: runAsyncGetMyPro } = useRequest(ApiMemberAgencyMyPromotion, {
  ready: isLogin,
})

const baseQrRef = ref()
const squareTabList = [
  {
    value: '0',
    label: t('today_data_label'),
  },
  {
    value: '3',
    label: t('sub_bet'),
  },
  {
    value: '2',
    label: t('performance'),
  },
  {
    value: '1',
    label: t('finance_funds_transfer_sort_commission'),
  },

]
const squareVal = ref('0')

const qrUrl = computed(() => `${location.value.origin}${proData.value?.link_url ?? ''}`)
const getSquareVal = computed(() => {
  return isMobile.value ? squareVal.value : '0123'
})

const today = computed(() => [
  {
    label: t('team_added'),
    value: `${proData.value?.todaydata?.total_num || 0} ${t('people')}`,
  },
  {
    label: t('direct_added'),
    value: `${proData.value?.todaydata?.direct_num || 0} ${t('people')}`,
  },
  {
    label: t('other_added'),
    value: `${proData.value?.todaydata?.other_num || 0} ${t('people')}`,
  },
  {
    label: t('total_recharge'),
    value: proData.value?.todaydata?.deposit_amt || '0.00',
    after: `/${proData.value?.todaydata?.deposit_num || 0} ${t('people')}`,
  },
  {
    label: t('direct_recharge'),
    value: proData.value?.todaydata?.deposit_direct_amt || '0.00',
    after: `/${proData.value?.todaydata?.deposit_direct_num || 0} ${t('people')}`,
  },
  {
    label: t('other_recharge'),
    value: proData.value?.todaydata?.deposit_other_amt || '0.00',
    after: `/${proData.value?.todaydata?.deposit_other_num || 0} ${t('people')}`,
  },
  {
    label: t('total_performance'),
    value: proData.value?.todaydata?.valid_bet_amt || '0.00',
    after: `/${proData.value?.todaydata?.valid_bet_num || 0} ${t('people')}`,
  },
  {
    label: t('direct_performance'),
    value: proData.value?.todaydata?.valid_bet_direct_amt || '0.00',
    after: `/${proData.value?.todaydata?.valid_bet_direct_num || 0} ${t('people')}`,
  },
  {
    label: t('other_performance'),
    value: proData.value?.todaydata?.valid_bet_other_amt || '0.00',
    after: `/${proData.value?.todaydata?.valid_bet_other_num || 0} ${t('people')}`,
  },

])

const commission = computed(() => [
  {
    label: t('accu_commission'),
    value: proData.value?.commission?.accumulated ?? '0.00000000',
  },
  {
    label: t('received_commission'),
    value: proData.value?.commission?.received ?? '0.00000000',
  },
  {
    label: t('last_commission'),
    value: proData.value?.commission?.last_commission ?? '0.00000000',
  },
])

const performance = computed(() => [
  {
    label: t('team_num'),
    value: `${proData.value?.performance?.team_num ?? 0} ${t('people')}`,
  },
  {
    label: t('direct_mem'),
    value: `${proData.value?.performance?.direct_num ?? 0} ${t('people')}`,
  },
  {
    label: t('other_mem'),
    value: `${proData.value?.performance?.other_num ?? 0} ${t('people')}`,
  },
  {
    label: t('total_recharge'),
    value: `${proData.value?.performance?.total_deposit ?? '0.00000000'}`,
    after: `/${proData.value?.performance?.deposit_num ?? 0} ${t('people')}`,
  },
  {
    label: t('direct_recharge'),
    value: `${proData.value?.performance?.direct_deposit ?? '0.00000000'}`,
    after: `/${proData.value?.performance?.direct_deposit_num ?? 0} ${t('people')}`,
  },
  {
    label: t('other_recharge'),
    value: `${proData.value?.performance?.other_deposit ?? '0.00000000'}`,
    after: `/${proData.value?.performance?.other_deposit_num ?? 0} ${t('people')}`,
  },
  {
    label: t('total_performance'),
    value: `${proData.value?.performance?.performance_amount ?? '0.00000000'}`,
    after: `/${proData.value?.performance?.performance_num ?? 0} ${t('people')}`,
  },
  {
    label: t('direct_performance'),
    value: `${proData.value?.performance?.direct_amount ?? '0.00000000'}`,
    after: `/${proData.value?.performance?.performance_direct_num ?? 0} ${t('people')}`,
  },
  {
    label: t('other_performance'),
    value: `${proData.value?.performance?.other_amount ?? '0.00000000'}`,
    after: `/${proData.value?.performance?.performance_other_num ?? 0} ${t('people')}`,
  },
])

const bet = computed(() => [
  {
    label: t('total_effect_bets'),
    value: proData.value?.subordinate?.valid_bet_amount ?? '0.00000000',
  },
  { label: t('total_bet_order'), value: proData.value?.subordinate?.bet_num ?? '0' },
  {
    label: t('slash_win_lose_total'),
    value: proData.value?.subordinate?.net_amount ?? '0.00000000',
  },
])

function downloadQr() {
  baseQrRef.value.downloadClick()
}

if (isLogin.value) {
  await application.allSettled(
    [runAsyncGetMyPro()],
  )
}
</script>

<template>
  <div class="tg-affiliate-retention promotion-info-box" :class="{ 'is-mobile': isMobile }">
    <div class="retention-item">
      <div class="item-title">
        <div class="title-left">
          {{ t('promo_info') }}
        </div>
      </div>
      <div
        class="item-content promotion-msg"
        :class="{ 'is-less-than-sm': isMobile }"
      >
        <div class="promotion-left cursor-pointer" @click="downloadQr">
          <BaseQrcode ref="baseQrRef" :url="qrUrl" :size="92" class="qr-code" />
          <p class="text-color">
            {{ t('click_save_qr') }}
          </p>
        </div>
        <div class="link">
          <p class="text-color leading-[20px]">
            {{ t('my_link') }}
          </p>
          <!-- <AppCopyLine :msg="qrUrl" /> -->
          <div class="url-wrap">
            <span style="word-break: break-all;font-size:var(--tg-font-size-xs)" class="text-light">{{ qrUrl }}</span>
            <AppTooltip
              style="display: inline-block;vertical-align: -6%;margin-left: 4px;"
              :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']"
            >
              <template #content>
                <div class="flex items-center" @click="application.copy(qrUrl)">
                  <IconUniDoc  />
                </div>
              </template>
            </AppTooltip>
          </div>
        </div>
        <div class="social-wrap">
          <AppApplicationSharing round :share-text="qrUrl" />
        </div>
      </div>
    </div>
    <BaseSquareTab v-if="isMobile" v-model="squareVal" :list="squareTabList" :tab-flex="userLanguage === 'zh-CN'" />
    <div v-show="getSquareVal.includes('0')" class="retention-item">
      <div class="item-title">
        <div class="title-left">
          {{ t('today_data_label') }}
        </div>
      </div>
      <div class="item-content grid-wrap" :class="{ 'is-less-than-sm': isMobile }">
        <div v-for="(item, index) in today" :key="index">
          <span class="title-label">{{ item.label }} </span>
          <div>
            <BaseSkeleton v-if="loadMyData" height="14px" animated="ani-opacity" />
            <div v-else class="value-wrapper flex flex-row flex-wrap gap-x-[4px] font-semibold">
              <AppAmount v-if="index > 2" class="retention-item-amount" :amount="item.value" currency-type="USDT" />
              <div v-else>
                {{ item.value }}
              </div>
              <div v-if="item.after">
                {{ item.after }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="getSquareVal.includes('1')" class="retention-item">
      <div class="item-title">
        <div class="title-left">
          {{ t('finance_funds_transfer_sort_commission') }}
        </div>
      </div>
      <div class="item-content grid-wrap" :class="{ 'is-less-than-sm': isMobile }">
        <div v-for="(item, index) in commission" :key="index">
          <span class="title-label">{{ item.label }} </span>
          <div>
            <BaseSkeleton v-if="loadMyData" height="14px" animated="ani-opacity" />
            <AppAmount v-else class="retention-item-amount" :amount="item.value" currency-type="USDT" />
          </div>
        </div>
      </div>
    </div>
    <div v-show="getSquareVal.includes('2')" class="retention-item">
      <div class="item-title">
        <div class="title-left">
          {{ t('performance') }}
        </div>
      </div>
      <div class="item-content grid-wrap" :class="{ 'is-less-than-sm': isMobile }">
        <div v-for="(item, index) in performance" :key="index">
          <span class="title-label">{{ item.label }} </span>
          <div>
            <BaseSkeleton v-if="loadMyData" height="14px" animated="ani-opacity" />
            <div v-else class="value-wrapper flex flex-row flex-wrap gap-x-[4px] font-semibold">
              <AppAmount v-if="index > 2" class="retention-item-amount" :amount="item.value" currency-type="USDT" />
              <div v-else>
                {{ item.value }}
              </div>
              <div v-if="item.after">
                {{ item.after }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="getSquareVal.includes('3')" class="retention-item">
      <div class="item-title">
        <div class="title-left">
          {{ t('sub_bet') }}
        </div>
      </div>
      <div class="item-content grid-wrap" :class="{ 'is-less-than-sm': isMobile }">
        <div v-for="(item, index) in bet" :key="index">
          <span class="title-label">{{ item.label }} </span>
          <div>
            <BaseSkeleton v-if="loadMyData" height="14px" animated="ani-opacity" />
            <div v-else-if="index === 1" class="font-semibold">
              {{ item.value }}
            </div>
            <AppAmount
              v-else
              class="retention-item-amount" :amount="item.value" currency-type="USDT"
              :show-color="index === 2"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text-light {
  color: var(--tg-secondary-light);
  @include webTheme('white') {
    color: #555;
  }
}
.value-wrapper {
  @include webTheme('green') {
    color: #3cb389;
  }
  //>*:not(:last-child) {
  margin-bottom: 8px;
  //}
}
.tg-affiliate-retention {
  font-size: var(--tg-font-size-default);
  // color: var(--tg-text-white);
  --tg-base-square-tab-font-weight: var(--tg-font-weight-normal);
  --tg-base-square-tab-padding-top: 18px;
  --tg-base-square-tab-padding-y: 18px;
  @include webTheme('white') {
    --tg-base-square-tab-font-weight: var(--tg-font-weight-bold);
  }
  > .retention-item ~ .retention-item {
    @include webTheme('green') {
      background-color: var(--tg-primary-main);
      color: var(--tg-text-white);
      // color 标记，需要数据看看是否影响红绿色
    }
    background-color: var(--tg-secondary-grey);
    padding: 0 24px 24px;
    border-radius: var(--tg-radius-default);
    .item-title {
      padding-left: 0;
    }
  }
  > div ~ div {
    margin-top: var(--tg-spacing-16);
  }
  .item-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--tg-spacing-4) 0 var(--tg-spacing-16);
    border-radius: var(--tg-radius-default) var(--tg-radius-default) 0 0;
    height: 36px;
    .title-left {
      color: var(--tg-text-white);
      font-weight: var(--tg-font-weight-semibold);
    }
  }
  .promotion-msg {
    width: 100%;
    max-width: 768px;
    display: grid;
    grid-template-columns: 108px auto;
    gap: 16px 10%;
    background-color: var(--tg-secondary-dark);
    border-radius: var(--tg-radius-default);
    padding: var(--tg-spacing-16);
    @include webTheme('white') {
      background-color: #f5f5f5;
    }
    @include webTheme('new-default') {
      background-color: #0f212e;
    }
    @include webTheme('green') {
      background-color: var(--tg-base-square-tab-bg-green);
    }
    .promotion-left {
      grid-row-start: span 2;
    }
    &.is-less-than-sm {
      width: 100%;
      gap: 16px 16px;
      justify-items: stretch;
      .promotion-left {
        grid-row-start: auto;
      }
      .social-wrap {
        grid-column-start: span 2;
      }
      .url-wrap {
        flex: 1;
        display: block;
      }
    }
    .link {
      height: 100%;
      display: flex;
      flex-direction: column;
      // gap: 4px;
      > * {
        margin-bottom: 4px;
      }
      > :last-child {
        margin-bottom: 0;
      }
    }
    .url-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: none;
      color: var(--tg-text-white);
      background: var(--tg-secondary-grey);
      border: 0px solid var(--tg-secondary-main);
      border-radius: var(--tg-radius-default);
      font-weight: var(--tg-font-weight-semibold);
      transition: all 0.25s;
      cursor: text;
      font-size: var(--tg-font-size-default);
      padding: var(--tg-spacing-11) var(--tg-spacing-7);
      line-height: 1.4;

      @include webTheme('green') {
        border: 1px solid #197b59;
        background: #0e6746;
      }
      @include webTheme('white') {
        background-color: #e8e8e8;
      }
      &:hover {
        border-color: var(--tg-text-grey);
      }
    }
    .promotion-left {
      text-align: center;
      .qr-code {
        margin-bottom: var(--tg-spacing-8);
      }
    }
  }
  .grid-wrap {
    width: 100%;
    max-width: 660px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 15px;
    &.is-less-than-sm {
      max-width: 100%;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px;
    }
    > div {
      width: 100%;
      background-color: var(--tg-secondary-dark);
      padding: var(--tg-spacing-19) var(--tg-spacing-16);
      display: flex;
      justify-content: center;
      align-items: flex-start;
      line-height: 14px;
      flex-direction: column;
      border-radius: 8px;
      @include webTheme('white') {
        background-color: #f5f5f5;
      }
      @include webTheme('green') {
        background-color: var(--tg-base-square-tab-bg-green);
        color: #3cb389;
      }
      @include webTheme('new-default') {
        background-color: #0f212e;
      }
      // gap: 8px;
      > * {
        margin-bottom: 8px;
      }
      > :last-child {
        margin-bottom: 0;
      }
    }
    .title-label {
      color: #fff;
      @include webTheme('white') {
        color: #111;
      }
    }
  }
}
.is-mobile {
  .item-title {
    display: none;
  }
  > .retention-item ~ .retention-item {
    @include webTheme('green') {
      background: none;
    }
    background: none;
    padding: 0;
  }
}
.text-color {
  @include webTheme('green') {
    color: white;
  }
}
.promotion-info-box {
  @include webTheme('green') {
    --tg-secondary-dark: var(--tg-primary-main);
    .promotion-msg {
      --tg-text-green-main: var(--tw-ring-offset-color);
      .url-wrap {
        border: none;
        --tg-secondary-grey: #055434;
        --tg-secondary-light: var(--tg-text-placeholder);
        --tg-icon-color: #5ecea6;
      }
    }
    --tg-base-square-tab-dot-bg-color: var(--tg-base-button-secondary-bg);
    .grid-wrap {
      .title-label {
        --tg-text-green-main: var(--tw-ring-offset-color);
      }
      .value-wrapper {
        color: var(--tg-text-placeholder);
      }
      .font-semibold {
        color: var(--tg-text-placeholder);
      }
    }
  }
}
.retention-item-amount {
  @include webTheme('green') {
    color: var(--tg-text-placeholder);
  }
}
</style>

<route lang="yaml">
</route>
