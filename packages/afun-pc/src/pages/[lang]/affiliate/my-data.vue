<script lang="ts" setup>
import { ApiMyData } from '@tg/apis'

const { t } = useI18n()
usePageTitle({ prefix: t('menu_title_my_promotion') })
const { startTime, endTime } = getDaIntervalMap(new Date().getTime(), 30)
const { bonus_currency, mode } = storeToRefs(useAffiliate())
const { isZhcn } = storeToRefs(useLanguageStore())
const { isLogin } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())
const { data: proData, loading: loadMyData, runAsync: runAsyncGetMyPro } = useRequest(ApiMyData, {
  ready: isLogin,
})
const date = ref([])

const today = computed(() => mode.value == 1
  ? [
      [
        {
          label: t('total_commission'),
          value: `${proData.value?.commission_amount_total || '0.00'}`,
          price: true,
        },
      ],
      [
        {
          label: t('menu_title_direct_bet'),
          value: proData.value?.valid_bet_amount_direct || '0.00',
          after: `/${proData.value?.valid_bet_cnt_direct || 0} ${t('people')}`,
          price: true,
        },
      ],
      [
        {
          label: t('reg_num'),
          value: (proData.value?.reg_cnt_total || '0') + t('people'),

        },
      ],
      [
        {
          label: t('total_initial_deposit'),
          value: proData.value?.first_deposit_amt_total || '0.00',
          after: `/${proData.value?.first_cnt_total || 0} ${t('people')}`,
          price: true,
        },
      ],
      [
        {
          label: t('total_deposits_2'),
          value: proData.value?.deposit_amt_total || '0.00',
          after: `/${proData.value?.deposit_cnt_total || 0} ${t('people')}`,
          price: true,
        },
      ],
    ]
  : [
      [
        {
          label: t('total_commission'),
          value: `${proData.value?.commission_amount_total || '0.00'}`,
          price: true,
        },
        {
          label: t('direct_commission'),
          value: `${proData.value?.commission_amount_direct || '0.00'}`,
          price: true,
        },
        {
          label: t('team_commission'),
          value: `${proData.value?.commission_amount_other || '0.00'}`,
          price: true,
        },
      ],
      [
        {
          label: t('total_bet'),
          value: proData.value?.valid_bet_amount_total || '0.00',
          after: `/${proData.value?.valid_bet_cnt_total || 0} ${t('people')}`,
          price: true,
        },
        {
          label: t('menu_title_direct_bet'),
          value: proData.value?.valid_bet_amount_direct || '0.00',
          after: `/${proData.value?.valid_bet_cnt_direct || 0} ${t('people')}`,
          price: true,
        },
        {
          label: t('team_betting'),
          value: proData.value?.valid_bet_amount_other || '0.00',
          after: `/${proData.value?.valid_bet_cnt_other || 0} ${t('people')}`,
          price: true,
        },
      ],
      [
        {
          label: t('total_registered'),
          value: `${proData.value?.reg_cnt_total || 0} ${t('people')}`,

        },
        {
          label: t('direct_registration'),
          value: `${proData.value?.reg_cnt_direct || 0} ${t('people')}`,

        },
        {
          label: t('team_registration'),
          value: `${proData.value?.reg_cnt_other || 0} ${t('people')}`,
        },
      ],
      [
        {
          label: t('total_initial_deposit'),
          value: proData.value?.first_deposit_amt_total || '0.00',
          after: `/${proData.value?.first_cnt_total || 0} ${t('people')}`,
          price: true,
        },
        {
          label: t('direct_first_deposit'),
          value: proData.value?.first_deposit_amt_direct || '0.00',
          after: `/${proData.value?.first_cnt_direct || 0} ${t('people')}`,
          price: true,
        },
        {
          label: t('team_first_deposit'),
          value: proData.value?.first_deposit_amt_other || '0.00',
          after: `/${proData.value?.first_cnt_other || 0} ${t('people')}`,
          price: true,
        },
      ],
      [
        {
          label: t('total_deposits_2'),
          value: proData.value?.deposit_amt_total || '0.00',
          after: `/${proData.value?.deposit_cnt_total || 0} ${t('people')}`,
          price: true,
        },
        {
          label: t('direct_deposit'),
          value: proData.value?.deposit_amt_direct || '0.00',
          after: `/${proData.value?.deposit_cnt_direct || 0} ${t('people')}`,
          price: true,
        },
        {
          label: t('team_deposit'),
          value: proData.value?.deposit_amt_other || '0.00',
          after: `/${proData.value?.deposit_cnt_other || 0} ${t('people')}`,
          price: true,
        },
      ],

    ])

const runFn = throttle(async () => {
  await application.allSettled(
    [runAsyncGetMyPro({
      start_time: date.value[0],
      end_time: date.value[1],
    })],
  )
}, 500, { leading: true, trailing: false })

watch(date, () => {
  if (isLogin.value)
    runFn()
}, {
  deep: true,
})
</script>

<template>
  <div class="tg-affiliate-retention promotion-info-box" :class="{ 'is-mobile': isMobile, 'pc-mode': !isMobile }">
    <div class="retention-item">
      <div class="search-line">
        <AppTimeSearch v-model="date" class="mb-[8px]" />
        <BaseDatePicker
          :key="`${date[0] + date[1]}`" v-model="date" class="my-affiliate-picker" :init-start-date="date[0]"
          :init-end-date="date[1]" :min="startTime" :max="endTime" :is-utc="false"
          :style="isZhcn ? '--tg-base-date-picker-font-weight:500;' : '--tg-base-date-picker-font-weight:600;'"
        />
      </div>
      <div class="item-content grid-wrap" :class="{ 'is-less-than-sm': isMobile }">
        <div v-for="(item, index) in today" :key="index" class="data-group mb-[5px]">
          <div v-for="(citem, cindex) in item" :key="cindex">
            <div class="data-item" :class="{ 'is-pc': !isMobile }">
              <span class="title-label" :style="isZhcn ? 'font-weight:500;' : 'font-weight:600;'">{{ citem.label }} </span>
              <div class="h-[16px] flex items-center">
                <BaseSkeleton v-if="loadMyData" height="14px" animated="ani-opacity" />
                <div v-else class="value-wrapper flex flex-row flex-wrap gap-x-[4px] font-semibold" :style="isZhcn ? 'font-weight:500;' : 'font-weight:600;'">
                  <div v-if="citem.price" class="flex items-center">
                    <AppCurrencyIcon :currency-type="getCurrencyConfigByCode(bonus_currency)?.name" class="mr-[3px] mt-[1px]" />
                    {{ citem.value }}
                  </div>
                  <div v-else>
                    {{ citem.value }}
                  </div>
                  <div v-if="citem.after">
                    {{ citem.after }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-affiliate-picker {
  --tg-base-date-picker-outer-margin-right: 8px;
  --tg-base-date-picker-outer-height: 40px;
}
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

  &.is-mobile[lang='zh'] {
    :deep(.time-button) {
      min-width: initial !important;
      width: auto !important;
      flex: 1 !important;
    }
  }

  @include webTheme('white') {
    --tg-base-square-tab-font-weight: var(--tg-font-weight-bold);
  }

  > .retention-item ~ .retention-item {
    @include webTheme('green') {
      background-color: var(--tg-primary-main);
      color: var(--tg-text-white); // color 标记，需要数据看看是否影响红绿色
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
    grid-template-columns: repeat(1, 1fr);

    .data-group {
      > div {
        &:nth-child(1) {
          .data-item {
            border-radius: 4px 4px 0 0;
          }
        }

        &:last-child {
          .data-item {
            border-radius: 0px 0px 4px 4px;
          }
        }
      }
    }

    .data-item {
      width: 100%;
      background: #213743;
      padding: var(--tg-spacing-19) var(--tg-spacing-16);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      line-height: 14px;
      margin-bottom: 1px;
      &.is-pc {
        margin-bottom: 2px;
      }

      @include webTheme('white') {
        background-color: #f5f5f5;
      }

      @include webTheme('green') {
        background-color: #055434;
        color: #3cb389;
      }

      @include webTheme('new-default') {
        background-color: var(--tg-secondary-grey);
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

.search-line {
  margin-bottom: 8px;
  --tg-base-date-picker-bother: none;

  @include webTheme('green') {
    --tg-base-date-picker-bg: #02432d;
    --tg-base-date-picker-color: #ffffff;
  }
}

.retention-item-amount {
  @include webTheme('green') {
    color: var(--tg-text-placeholder);
  }
}

:deep(.time-range-container) {
  display: flex;
  gap: 8px; // 按钮间距
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

:deep(.time-button) {
  white-space: nowrap;
  min-width: fit-content;
  min-width: 96px;
  width: auto;
  padding: 8px 13px;
  flex-shrink: 0; // 防止被压缩
}

.pc-mode {
  padding: calc(27px - 12px) calc(20px - 12px);

  :deep(.time-button) {
    background-color: #071824;

    @include webTheme('white') {
      background-color: #e8e8e8 !important;
    }

    @include webTheme('green') {
      background-color: #055434 !important;
    }

    &.active {
      background: #2f4554;
    }
  }

  :deep(.label-box) {
    background: #071824;
    border-radius: 4px;
    color: #ffffff !important;
  }

  .item-content {
    max-width: 100%;
  }

  .title-label {
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    color: #b1bad3 !important;
  }

  .data-item {
    align-items: center;
  }

  .value-wrapper {
    color: #ffffff;
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    margin-bottom: 0 !important;
  }

  .title-label {
    font-size: 14px;
    line-height: 100%;
    text-align: center;
    margin-bottom: 0 !important;
  }
}

.is-mobile {
  .search-line,
  .time-range-container {
    margin-bottom: 8px;
  }

  :deep(.date-picker-outer) {
    justify-content: space-between;
    gap: 19px;

    & > div {
      flex: 1;
      margin-right: 0 !important;
    }
  }

  .title-label {
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    margin-bottom: 0 !important;
    color: #b1bad3 !important;
  }

  .value-wrapper {
    font-size: 14px;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;
    margin-bottom: 0 !important;
    color: #ffffff !important;
    gap: 0 !important;

    :deep(.app-currency-icon) {
      margin: 0 4px 0 0 !important;
    }
  }

  :deep(.time-button),
  :deep(.base-date-picker),
  :deep(.my-affiliate-select),
  :deep(.my-affiliate-input) {
    background: #0f212e !important;

    &.active {
      background: #2f4554 !important;
    }
  }

  :deep(.time-button),
  :deep(.label-box) {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :deep(.input-box),
  :deep(.label-box),
  :deep(.popper-label) {
    opacity: 1 !important;
    background: #0f212e;

    input,
    span {
      color: #fff !important;
    }
  }
}
</style>

<route lang="yaml">
</route>
