<script lang="ts" setup>
import {
  IconTabbarBet,
  IconNavbarWallet,
  IconUniWarning,
  IconUniRecordOther,
  IconUniRecordConfirm
} from '@tg/icons'
import {
  ApiFinanceRecordDepositCoin,
  ApiFinanceRecordOther,
  ApiFinanceRecordWithdrawBank,
  ApiFinanceRecordWithdrawCoin,
  ApiFinancRecordDepositBank
} from '@tg/apis'

interface Props {
  tabs: {
    [text: string]: any
    value: string | number
    label: string
  }[]
  emptyText: string
  downloadText?: string
  tabValue?: string | number
  contentType: 'deposit' | 'withdraw' | 'other'
  /** 筛选状态 */
  state: string
}
defineOptions({
  name: 'AppTabRecord',
})
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['update:tabValue', 'update:state'])

const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())
// 存款详情弹框
const { openDepositDetailDialog }
  = useDialogDepositDetail(props.contentType === 'deposit' ? t('deposit_detail') : t('withdraw_detail'))
// 加密货币存款
const recordDepositCoin = useList(ApiFinanceRecordDepositCoin, { manual: true }, { page_size: 10 })
// 法定货币存款
const recordDepositBank = useList(ApiFinancRecordDepositBank, { manual: true }, { page_size: 10 })
// 加密货币取款
const recordWithdrawCoin = useList(ApiFinanceRecordWithdrawCoin, { manual: true }, { page_size: 10 })
// 法定货币取款
const recordWithdrawBank = useList(ApiFinanceRecordWithdrawBank, { manual: true }, { page_size: 10 })
// 其他
const financeRecordOther = useList(ApiFinanceRecordOther, { manual: true }, { page_size: 10 })

const tab = ref(props.tabs[0]?.value ?? '')
emit('update:tabValue', tab.value)
const activeRecord = ref<any>(getInit())
const {
  selected: stateVal,
  list: stateList,
} = useSelect([
  {
    label: t('finance_other_tab_all'),
    value: '0',
  },
  {
    label: t('notify_title_success'),
    value: '1',
  },
  {
    label: t('failure'),
    value: '2',
  },
  {
    label: t('tickets_status_in_progress'),
    value: '3',
  },
])

const getList = computed(() => {
  return activeRecord.value.list
})
const getPage = computed(() => {
  return {
    pageSize: 10,
    page: activeRecord.value.page,
    total: activeRecord.value.total,
  }
})
const isOther = computed(() => {
  return props.contentType === 'other'
})

function tabChange(val: string) {
  stateVal.value = '0'
  emit('update:state', '0')
  if (val === 'byte_coin')
    activeRecord.value = recordDepositCoin
  else if (val === 'real_coin')
    activeRecord.value = recordDepositBank
  else if (val === 'byt_w_coin')
    activeRecord.value = recordWithdrawCoin
  else if (val === 'real_w_coin')
    activeRecord.value = recordWithdrawBank
  else
    activeRecord.value = financeRecordOther
  activeRecord.value.page = 1
  activeRecord.value.list.length = 0
  runInit()
}
function pagePrevious() {
  activeRecord.value.prev()
  // runInit()
}
function pageNext() {
  activeRecord.value.next()
  // runInit()
}
function formatWithdrawState(state: number) {
  // <!--1：成功，2：拒绝，3，审核中，4：删除，5：三方异常，6：出款中-- >
  switch (state) {
    case 1: return t('withdraw_success')
    case 2: return t('withdraw_fail')
    case 3: return t('withdraw_in_process')
    case 4: return t('withdraw_fail')
    case 5: return t('withdraw_fail')
    case 6: return t('withdraw_in_process')
    default: return '--'
  }
  // switch (state) {
  //   case 1: return t('checklist_completed')
  //   case 2: return t('failure')
  //   case 3: return t('dealing')
  //   case 4: return t('failure')
  //   case 5: return t('failure')
  //   case 6: return t('dealing')
  //   default: return '--'
  // }
}
function formatDepositState(state: number) {
  // <!--1：成功，2：失败，3，支付中，4：删除，5:待审核 6：取消-- >
  // switch (state) {
  //   case 1: return t('confirmed')
  //   case 2: return t('failure')
  //   case 3: return t('status_pending')
  //   case 4: return t('failure')
  //   case 5: return t('status_pending')
  //   case 6: return t('cancel')
  //   default: return '--'
  // }
  switch (state) {
    case 1: return t('deposit_success')
    case 2: return t('deposit_fail')
    case 3: return t('deposit_in_process')
    case 4: return t('deposit_fail')
    case 5: return t('deposit_in_process')
    case 6: return t('deposit_fail')
    default: return '--'
  }
}
function getStateIcon(state: number) {
  // switch (state) {
  //   case 1: return 'uni-record-success'
  //   case 2: return 'uni-record-err'
  //   case 3: return 'uni-record-confirm'
  //   case 4: return 'uni-record-err'
  //   case 5: return props.contentType === 'deposit' ? 'uni-record-confirm' : 'uni-record-err'
  //   case 6: return props.contentType === 'deposit' ? 'uni-record-cancel' : 'uni-record-confirm'
  //   default: return '--'
  // }
  switch (state) {
    case 1: return IconNavbarWallet
    case 2: return IconUniWarning
    case 3: return IconUniRecordConfirm
    case 4: return IconUniWarning
    case 5: return props.contentType === 'deposit' ? '' : IconUniWarning
    case 6: return props.contentType === 'deposit' ? IconUniWarning : ''
    default: return '--'
  }
}
function getStateIconColor(state: number) {
  switch (state) {
    case 1: return '#24EE89'
    case 2: return '#E9233C'
    case 3: return '#24EE89'
    case 4: return '#E9233C'
    case 5: return props.contentType === 'deposit' ? '' : '#E9233C'
    case 6: return props.contentType === 'deposit' ? '#E9233C' : ''
    default: return '--'
  }
}
function getInit() {
  switch (props.contentType) {
    case 'deposit': return recordDepositBank
    case 'withdraw': return recordWithdrawBank
    case 'other': return financeRecordOther
  }
}
function runInit() {
  if (isOther.value) {
    // TransactionLockerIn       = 838  //存入  3
    // TransactionLockerOut      = 839  //取出.  3
    // TransactionLockerInterest = 8370 //利息结算 3
    // 如果id匹配上，就添加 wallet_type = 3
    const walletType3List = ['838', '839', '8370']

    // TransactionWalletInLocker  = 8371 //主钱包转入利息宝. 1
    // TransactionLockerOutWallet = 8372 //利息宝转入主钱包 1
    // 如果id匹配上，就添加 wallet_type = 1
    const walletType1List = ['8371', '8372']

    const params: any = {
      page: activeRecord.value.page,
      page_size: activeRecord.value.page_size,
      id: tab.value.toString(),
      state: '0',
    }
    if (walletType3List.includes(tab.value.toString()))
      params.wallet_type = '3'
    if (walletType1List.includes(tab.value.toString()))
      params.wallet_type = '1'

    activeRecord.value.run(params)
  }
  else {
    activeRecord.value.run({
      state: stateVal.value,
    })
  }
}
function selectStateChange(val: string) {
  stateVal.value = val
  activeRecord.value.page = 1
  activeRecord.value.list.length = 0
  activeRecord.value.run({
    state: val,
  })
}

watch(tab, (val) => {
  emit('update:tabValue', val)
})
watch(() => props.state, (newVal) => {
  selectStateChange(newVal)
})

if (isOther.value) {
  await application.allSettled(
    [
      activeRecord.value.runAsync({
        page: activeRecord.value.page,
        page_size: activeRecord.value.page_size,
        id: tab.value.toString(),
        state: '0',
      }),
    ],
  )
}
else {
  activeRecord.value.run({
    state: stateVal.value,
  })
}
</script>

<template>
  <section class="tg-app-tab-record user-record-wrap">
    <div class="top flex items-center justify-between">
      <BaseTab v-model="tab" class="record-tab" :list="tabs" :center="false" need-scroll-at-init scroll-inline="center"
        @change="tabChange" />
      <BaseSelect v-if="!isOther && !isMobile" class="custom-select1"
        style="--tg-base-select-popper-style-padding-y: 11px;" :model-value="stateVal" popper :options="stateList"
        @select="selectStateChange" />
      <!-- <template #label="{ data }">
            <div :class="appContentWidth < 350 ? 'min-w-[60px] whitespace-normal' : ''">
              {{ data?.label ?? '' }}
            </div>
          </template>
<template #option="{ data: { item } }">
            <div class="center">
              {{ item.label }}
            </div>
          </template> -->
    </div>
    <div v-if="activeRecord.loading" class="center record-loading">
      <BaseLoading />
    </div>
    <div v-else>
      <div class="middle">
        <div v-if="getList.length" class="record-box record-wrap">
          <div v-for="item of getList" :key="item.order_number" class="center record-item"
            :class="[isOther ? '' : 'cursor-pointer']" @click="(!isOther) && openDepositDetailDialog(item)">
            <div class="center item-left record-item-left">
              <AppCurrencyIcon v-if="item.state === 3 || item.state === 5" :currency-type="item.currency_name" />
              <component v-else :is="isOther ? IconUniRecordOther : getStateIcon(item.state)"
                :style="{ color: isOther ? '#24EE89': getStateIconColor(item.state) }" />
            </div>
            <div class="item-right record-item-right">
              <div class="flex-between">
                <span v-if="isOther" class="white">{{ item.cash_type_name }}</span>
                <span v-else class="white">
                  {{ props.contentType === 'deposit'
                    ? formatDepositState(item.state)
                    : formatWithdrawState(item.state) }}</span>
                <div class="center item-right-center">
                  <div class="mr-[4px]">
                    {{ $t('amount') }}
                  </div>
                  <AppAmount
                    :amount="(item.state === 1) ? (item.finally_amount ?? item.amount) : (item.pay_amount ?? item.amount ?? item.finally_amount)"
                    :currency-type="getCurrencyConfigByCode(item.currency_id)?.name" class="depositsAmountWith"
                    :style="isMobile ? '' : '--tg-app-amount-max-width:40ch;'" />
                </div>
              </div>
              <div class="flex-between">
                <span class="time-text-color">{{ timeToFormatFullTimeByBoss(item.created_at) }}</span>
                <div v-if="!isOther" class="center record-item-right-bottom" style="gap: var(--tg-spacing-4);">
                  <span class="over-ellipsis order-text-color">{{ item.order_number }}</span>
                  <IconTabbarBet style="font-size: var(--tg-font-size-xs);" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty">
          <BaseEmpty :description="emptyText" icon="empty-1">
            <template #icon>
              <BaseImage class="w-[80px]" url="/png/icon/empty-1.png" />
            </template>
          </BaseEmpty>
        </div>
        <div v-show="activeRecord.total > 0" class="tg-mt-24 page-stack-wrap">
          <AppStack :pagination-data="getPage" scroll @previous="pagePrevious" @next="pageNext" />
        </div>
        <!-- <div v-if="downloadText" class="download-btn tg-mt-24">
          <BaseButton size="md">
            {{ downloadText }}
          </BaseButton>
        </div> -->
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.custom-select1 {
  --tg-base-select-popper-bg-color: var(--tg-secondary-deepdark);

  @include webTheme('white') {
    --tg-base-select-popper-bg-color: #f2ca5c;
    --tg-base-select-popper-label-hover-bg-color: #cb980b;
  }
}

.empty {
  margin-top: var(--tg-spacing-24);

  :deep(.base-empty-description) {
    padding-bottom: 0;
    padding-top: var(--tg-spacing-16);
  }
}

// 给该页面用的组件限制最大宽度，限制换行，防止订单号被顶下去，组件穿透修改，组件为appamount
.depositsAmountWith {
  --tg-app-amount-max-width: 9ch;
}

.tg-app-tab-record {
  min-height: 220px;
  --tg-tab-style-wrap-bg-color: var(--tg-primary-main);
}

// .footer-buttons {
//   font-size: var(--tg-font-size-default);
//   color: var(--tg-text-white);
//   opacity: 0.5;
// }
.record-box {
  display: flex;
  flex-direction: column;
  // gap: var(--tg-spacing-12);
  align-items: flex-start;
  margin-top: var(--tg-spacing-16);
  overflow: hidden;

  >*:not(:last-child) {
    margin-bottom: var(--tg-spacing-12);
  }

  .record-item {
    height: 70px;
    width: 100%;
    box-shadow: var(--tg-box-shadow);
    border-radius: var(--tg-radius-default);
    background-color: var(--tg-secondary-grey);
    overflow: hidden;

    @include webTheme('green') {
      box-shadow: none;
    }
  }

  .item-left {
    width: 62px;
    height: 100%;
    flex-shrink: 0;
    font-size: var(--tg-font-size-lg);
    --tg-icon-color: var(--tg-primary-success);
    --tg-app-currency-icon-size: 20px;
    background-color: var(--tg-secondary-grey);

    @include webTheme('green') {
      background-color: var(--tg-secondary-main);
    }

    @include webTheme('white') {
      background-color: #f2ca5c;
      --tg-icon-color: #00a501;
    }
  }

  .item-right {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px 10px 12px;
    // gap: var(--tg-spacing-4);
    background: var(--tg-secondary-main);

    >*:not(:last-child) {
      margin-bottom: var(--tg-spacing-4);
    }

    @include webTheme('white') {
      background-color: #e8e8e8;
    }
  }

  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--tg-font-size-default);
    line-height: 1.3215;
    color: var(--tg-text-lightgrey);

    @include webTheme('green') {
      color: var(--tg-text-white);
    }
  }

  .flex-between+.flex-between {
    font-size: var(--tg-font-size-xs);
  }

  .time-text-color {
    // 时间颜色
    color: var(--tg-text-lightgrey);

    @include webTheme('green') {
      color: var(--tg-text-green-main);
    }
  }

  .order-text-color {
    // 订单号颜色
    color: var(--tg-text-white);

    @include webTheme('green') {
      color: var(--tg-text-green-main);
    }
  }

  .white {
    color: var(--tg-text-white);
    font-weight: bold;
  }
}

.record-loading {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  padding-top: 60px;
  background-color: #{rgba($color: var(--tg-color-grey-rgb), $alpha: 0.45)};

  @include webTheme('green') {
    background-color: transparent;
  }
}

.user-record-wrap {
  @include webTheme('green') {
    .record-tab {
      --tg-tab-style-wrap-bg-color: var(--tg-body-bg);
      --tg-tab-style-active-bg: var(--tg-green-dark);
      --tg-text-green-sub: var(--tw-ring-offset-color);
      --tg-tab-active-text-color: var(--tw-ring-offset-color);
    }

    .record-wrap {
      .record-item-right {
        --tg-secondary-main: var(--tg-body-bg);

        .item-right-center {
          color: var(--tg-text-placeholder);
        }

        .record-item-right-bottom {
          --tg-text-green-main: var(--tw-ring-offset-color);
        }
      }

      .record-item-left {
        --tg-secondary-main: var(--tg-sport-grey-deep);
      }
    }
  }
}
</style>
