<script setup lang="ts">
import { IconUniConfirmed1 } from '@tg/icons'
import { ApiMemberTurntableBonusApply } from '@tg/apis'

interface Props {
  data?: {
    [key: string]: string | number
  }
  prefix?: string
  surplus?: string
  achieved?: string
  // callBack: (data: any) => void
  // changeState: () => void
}
defineOptions({
  name: 'AppDialogTurnWithdraw',
})
const props = withDefaults(defineProps<Props>(), {})

const closeDialog = inject('closeDialog', () => { })
const { t } = useI18n()
const route = useRoute()
// const { openNotify } = useNotify()
const { openInviteFriendHelpDialog } = useDialogInviteFriendHelp()
const { loading: loadTurntableBonusApply, runAsync: runAsyncTurntableBonusApply } = useRequest(ApiMemberTurntableBonusApply, {
  // onSuccess() {
  // openNotify({
  //   title: '提取奖金',
  //   icon: 'navbar-wallet-notify',
  //   message: '奖金提取成功',
  // })
  // },
})

const pid = props.data?.pid ?? (route.query.pid as string)

// 是否可领取 1未解锁 2已解锁 3过期 4已领取 5待审核 6已取消
const ableReceive = computed(() => {
  return props.data?.state === 2
})
// 是否需要申请 1直接转入钱包 2需审核
const isApply = computed(() => {
  return props.data?.withdraw_type === 2
})
function format() {
  switch (props.data?.state) {
    case 1: return t('invite_friends_to_help')
    case 2: return isApply.value ? t('apply_immediately') : t('transfer_wallet_immediately')
    case 3: return t('expired')
    case 4: return t('received')
    case 5: return t('promo_invite_pending')
    case 6: return t('cancelled')
    default: return t('invite_friends_to_help')
  }
}
function getState() {
  return ableReceive.value && !isApply.value
}
function handleBtn() {
  if ((!props.data) || props.data.state === 1) { // 打开邀请朋友帮忙
    closeDialog()
    openInviteFriendHelpDialog({ pid })
  }
  else { // 立即申请&&立即转入钱包
    // closeDialog()
    nextTick(() => {
      runAsyncTurntableBonusApply({
        pid: props.data?.pid ?? '',
        cur: props.data?.currency_id,
      }).then(() => {
        if (props.data?.state === 2 && isApply.value)
          usePromoNotifications({ payload: JSON.stringify({ type: '5' }) })

        // if (getState())
        //   props.changeState()
        // closeDialogBonusApplyAndExchange()
        closeDialog()
      })
      // openDialogBonusApplyAndExchange({
      //   bonus: props?.achieved ?? 0,
      //   callback: (currencyId: string) => {
      //     runAsyncTurntableBonusApply({
      //       pid: props.data?.pid ?? '',
      //       cur: currencyId,
      //     }).then(() => {
      //       // if (getState())
      //       //   props.changeState()
      //       closeDialogBonusApplyAndExchange()
      //       // closeDialog()
      //     })
      //   },
      // })
    })

    // runAsyncTurntableBonusApply({ pid: props.data?.pid ?? '' }).then(() => {
    //   if (getState())
    //     props.changeState()
    //   closeDialog()
    // })
  }
}

// onUnmounted(() => {
//   applyResult.value && !getState() && props?.callBack({ pid: props.data?.pid ?? '' })
// })
</script>

<template>
  <div class="root flex flex-col p-[16px]">
    <div class="theme-text text-[18px] font-500">
      {{ $t('withdrawal_progress') }}
    </div>
    <div class="amount flex flex-col items-center">
      <div v-if="getState()" class="text-tg-secondary-light text-center text-[12px] font-500">
        {{ t('total_amount_paid') }}
      </div>
      <!-- <AppAmount
        v-else :amount="data?.total_prize ?? 0" :currency-type="prefix"
        class="text-tg-secondary-light font-500"
        style="--tg-app-amount-font-size:12px;--tg-app-currency-icon-size: 13px"
      /> -->
      <AppAmount
        :amount="achieved ?? 0" :currency-type="prefix"
        style="--tg-app-amount-font-size: 36px;--tg-app-currency-icon-size: 28px"
      />
      <!-- <div class="text-tg-text-white mt-[6px] text-center text-[36px] font-600">
        {{ `${achieved} ${prefix}` }}
      </div> -->
    </div>
    <div class="theme-bg rounded-[4px] px-[12px] py-[16px]">
      <div>
        <div class="flex items-center">
          <IconUniConfirmed1 class="text-[17px]" />
          <span class="text-tg-text-white ml-[8px] text-[12px]">{{ $t('payment_request_submitted') }}</span>
        </div>
        <div class="active-line my-[2px] ml-[8px] h-[16px] w-[1px]" />
      </div>
      <div>
        <div class="flex items-center">
          <IconUniConfirmed1 class="text-[17px]" />
          <span class="text-tg-text-white ml-[8px] text-[12px]">{{ ableReceive ? (isApply ? $t('apply_transfer_wallet')
            : $t('you_transfer_wallet')) : `${$t('need_money_withdraw', [surplus])}`
          }}</span>
        </div>
        <div class="my-[2px] ml-[8px] h-[16px] w-[1px]" :class="[ableReceive && !isApply ? 'active-line' : 'line']" />
      </div>
      <div>
        <div class="flex items-center">
          <IconUniConfirmed1 v-if="ableReceive && !isApply" class="text-[17px]" />
          <div v-else class="dot mx-[5px] h-[7px] w-[7px] rounded-[50%]" />
          <AppAmount
            :amount="data?.total_prize ?? 0" :currency-type="prefix" class="theme-sec-text mx-[8px] font-500"
            style="--tg-app-amount-font-size:12px;--tg-app-currency-icon-size: 13px"
          />
          <span class="theme-sec-text text-[12px]">{{ t('will_transferred_wallet_account') }}</span>
        </div>
      </div>
    </div>
    <BaseButton
      bg-style="secondary" size="md" :disabled="data?.state === 5" :loading="loadTurntableBonusApply"
      @click="handleBtn"
    >
      {{ format() }}
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.root {
  > *:not(:first-child) {
    margin-top: 16px;
  }
  .amount {
    > *:not(:first-child) {
      margin-top: 10px;
    }
  }
  .theme-text {
    @include webTheme('green') {
      color: #fff;
    }
  }
  .theme-bg {
    background-color: var(--tg-secondary-main);
    --tg-icon-color: #00e701;
    @include webTheme('white') {
      background-color: #fff;
      font-weight: 500;
      --tg-icon-color: #ff9e36;
    }
    @include webTheme('green') {
      background-color: #02432d;
    }
    .line {
      background-color: var(--tg-secondary-light);
      @include webTheme('white') {
        background-color: #555555;
      }
      @include webTheme('green') {
        background-color: #197b59;
      }
    }
    .active-line {
      background-color: #00e701;
      @include webTheme('white') {
        background-color: #ff9e36;
      }
    }
    .dot {
      background-color: var(--tg-secondary-light);
      @include webTheme('white') {
        background-color: #555555;
      }
      @include webTheme('green') {
        background-color: #197b59;
      }
    }
  }
  .theme-sec-text {
    color: var(--tg-text-lightgrey);
    @include webTheme('green') {
      color: #3cb389;
    }
    @include webTheme('white') {
      color: #555;
    }
  }
}
</style>
