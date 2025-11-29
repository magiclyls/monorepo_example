<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'
import { IconUniDoc, IconUniWallet } from '@tg/icons'

interface Props {
  data: {
    [t: string]: any
  }
}
defineOptions({
  name: 'AppDialogDepositDetail',
})
const props = withDefaults(defineProps<Props>(), {})
const closeDialog = inject('closeDialog', () => { })
const { openService } = useService()
const { rightIsExpand, currentRightSidebarContent, closeRightSidebar } = useRightSidebar()
const { isMobile } = storeToRefs(useWindowStore())

const { t } = useI18n()

// const {
//   EnumCurrencyKey,
// } = useCurrencyData()

const isDeposit = computed(() => {
  return !!props.data.pay_method_name
})
const isCoin = computed(() => {
  return application.isVirtualCurrency(props.data.currency_name)
})
const getAmount = computed(() => {
  const data = props.data
  return (data.state === 1) ? data.finally_amount : ((data.pay_amount ?? data.amount) || data.finally_amount)
})

// 是否存在预扣
const isHasLimit = computed(() => props.data.is_limit_balance)

function getPrefix() {
  return currencyConfig[props.data.currency_name as EnumCurrencyKey].prefix
}

function formatWithdrawState(state: number) {
  switch (state) {
    case 1: return t('withdraw_success')
    case 2: return t('withdraw_fail')
    case 3: return t('withdraw_in_process')
    case 4: return t('withdraw_fail')
    case 5: return t('withdraw_fail')
    case 6: return t('withdraw_in_process')
    default: return '--'
  }
}
function formatDepositState(state: number) {
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
  switch (state) {
    case 1: return 'navbar-wallet'
    case 2: return 'uni-warning'
    case 3: return ''
    case 4: return 'uni-warning'
    case 5: return isDeposit.value ? '' : 'uni-warning'
    case 6: return isDeposit.value ? 'uni-warning' : ''
    default: return '--'
  }
}
function onlineHelp() {
  closeDialog()
  if (isMobile.value)
    closeRightSidebar()
  setTimeout(() => {
    openService({ isFootBar: false, needDeal: true })
  }, 300)
}
</script>

<template>
  <div class="dialog-deposit-detail">
    <div class="flex text-[#B1BAD3] mb-[8px] h-[20px]">
      <span>{{ t('order_num') }}:</span>
      <AppTooltip popper-clazz="deep-tooltip" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']">
        <template #content>
          <div class="data color-white">
            <BaseButton type="text" size="none" @click="application.copy(data.order_number)">
              <span style="padding-right: var(--tg-spacing-4)">{{ data.order_number }}</span>
              <IconUniDoc />
            </BaseButton>
          </div>
        </template>
      </AppTooltip>
    </div>
    <div class="bg-[#213743] p-[16px] mb-[16px] rounded-[4px] shadow-[0_1px_3px_0_rgba(0,0,0,0.20),0_1px_2px_0_rgba(0,0,0,0.12)]">
      <div class="text-[#fff] font-[600] text-center h-[20px] mb-[6px] text-[14px]">
        {{ data.currency_name }}{{ isDeposit ? t('pop_up_wallet_tap_card_deposit') : t('menu_title_settings_withdrawals') }}
      </div>
      <div class="title h-[34px] text-[24px] font-[600]">
        <AppAmount v-if="isCoin" :amount="getAmount" :currency-type="getCurrencyConfigByCode(data.currency_id)?.name" />
        <span v-else>{{ getAmount }}</span>
      </div>
      <div class="content">
        <div class="item">
          <label>{{ $t('transaction_time') }}:</label>
          <span class="data">{{ timeToFormatFullTimeByBoss(data.created_at) }}</span>
        </div>
        <div class="item">
          <label>{{ $t('transaction_way') }}:</label>
          <span class="data">{{ data.pay_method_name || data.bank_name || data.withdraw_type || '-' }}</span>
        </div>
        <div class="item">
          <label>{{ $t('transaction_currency') }}:</label>
          <span class="data">
            <AppCurrencyIcon :show-name="true" :currency-type="data.currency_name" />
          </span>
        </div>
        <div class="item">
          <label>{{ $t('transaction_status') }}:</label>
          <div :class="`text-[${data.color}] font-[600] text-[14px] flex items-center gap-[4px]`">
            <IconUniWallet :style="`color: ${data.color}`" class="ml-[8px]" />
            {{ isDeposit ? formatDepositState(data.state) : formatWithdrawState(data.state) }}
          </div>
        </div>
        <template v-if="isHasLimit">
          <!-- 存款金额 -->
          <div class="item">
            <label>
              {{ t('deposit_amount_label') }}:
            </label>
            <div class="data">
              {{ data.pay_amount }}
            </div>
          </div>
          <!-- 预扣金额 -->
          <div class="item">
            <label>
              {{ t('withholding_amount') }}:
            </label>
            <div class="data">
              {{ data.limit_amount }}
            </div>
          </div>
          <!-- 实际到账 -->
          <div class="item">
            <label>
              {{ t('actual_amount') }}:
            </label>
            <div class="data">
              {{ data.actual_amount }}
            </div>
          </div>
        </template>
        <div class="item">
          <label>
            {{ t('arrival_time') }}:
          </label>
          <div class="data">
            {{ data.arrived_at ? timeToFormatFullTimeByBoss(data.arrived_at) : '-' }}
          </div>
        </div>
        <div v-if="data.state === 2 && data.reason" class="item">
          <label>{{ $t('reason_for_rejection') }}:</label>
          <span class="data">{{ $t(`deposit_reason${data.reason}`) || '-' }}</span>
        </div>
        <div
          v-if="data.remark && data.remark.length"
          class="text-tg-text-lightgrey flex text-[14px] leading-[1.4]"
          :class="[data.remark && data.remark.length ? 'flex-col items-start justify-start' : 'flex-row items-center justify-between']"
        >
          <label class="whitespace-nowrap">{{ t('remark_label') }}:</label>
          <div class="scroll-y bg-tg-secondary-dark mt-[3px] max-h-[115px] w-full rounded p-[6px]">
            {{ data.remark || '-' }}
          </div>
        </div>
      </div>
    </div>
    
    <BaseButton size="md" bg-style="primary" class="th-leading-5 help-btn" @click="onlineHelp">
      {{ $t('need_online_service') }}
    </BaseButton>
  </div>
</template>

<style lang='scss' scoped>
.icon-s{
  --tg-icon-color: var(--tg-primary-success);
  @include webTheme('white'){
    --tg-icon-color:#00A501;
  }
}
.dialog-deposit-detail {
  padding: 0 var(--tg-spacing-16) var(--tg-spacing-16);
  .title {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: var(--tg-spacing-4);
    font-size: var(--tg-font-size-lg);
    font-weight: var(--tg-font-weight-semibold);
    color: var(--tg-text-white);
    text-align: center;
    margin-bottom: var(--tg-spacing-16);
    --tg-app-amount-font-size: var(--tg-font-size-lg);
    --tg-app-currency-icon-size: 20px;
    .prefix{
      font-size: var(--tg-font-size-default);
      @include webTheme('green'){
        color:var(--tg-text-green-main)
      }
      @include webTheme('green'){
        color:#FFFFFF
      }
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: var(--tg-spacing-16);
    margin-bottom: var(--tg-spacing-16);

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: var(--tg-font-size-default);
      color: var(--tg-text-lightgrey);
      line-height: 1.4;
      @include webTheme('green'){
        color:#3CB389
      }

      .data {
        color: var(--tg-text-lightgrey);
        @include webTheme('green'){
          --tg-base-button-text-default-color: var(--tg-text-green-main);
          color: var(--tg-text-green-main);
        }
      }
      .color-white{
        color: var(--tg-text-white);
        --tg-icon-color: var(--tg-text-white);
        @include webTheme('green'){
          --tg-text-white:var(--tg-text-green-main)
        }
      }
    }
  }
  .help-btn{
    max-width: 311px;
    width: 100%;
    display: block;
    margin: 0 auto;
    @include webTheme('green'){
      --tg-base-button-color: #02432D;
      --tg-base-button-style-bg: #F6D14A;
      --tg-base-button-style-bg-hover: #E1970B;
    }
  }
}
</style>
