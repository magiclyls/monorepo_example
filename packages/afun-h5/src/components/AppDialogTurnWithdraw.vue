<script setup lang="ts">
import type { EnumCurrencyKey } from '@tg/types'
import { ApiMemberTurntableBonusApply } from '@tg/apis'
import { AfunBaseAmount, AfunBaseButton, AfunBaseDialog } from '@tg/bccomponents'
import { IconUniConfirmed } from '@tg/icons'
import { i18n } from '@tg/vue-i18n'
import { computed, inject, nextTick, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'
import { usePromoNotifications } from '~/hooks/usePromoNotifications'
import { Message } from '~/utils'
import AppDialogInviteFriendHelp from './AppDialogInviteFriendHelp.vue'

interface Props {
  data?: {
    [key: string]: string | number
  }
  prefix?: string
  surplus?: string
  achieved?: string
}
defineOptions({
  name: 'AppDialogTurnWithdraw',
})
const props = withDefaults(defineProps<Props>(), {})

const showInviteFriendHelp = ref(false)
const closeDialog = inject('closeDialog', () => { })

const { t } = i18n.global
const route = useRoute()
const { loading: loadTurntableBonusApply, runAsync: runAsyncTurntableBonusApply } = useRequest(ApiMemberTurntableBonusApply, {
})

const pid = (props.data?.pid as string) ?? (route.query.pid as string)

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
    case 1: return t('邀请朋友帮忙')
    case 2: return isApply.value ? t('立即申请') : t('立即转入钱包')
    case 3: return t('已过期')
    case 4: return t('已领取')
    case 5: return t('审核中')
    case 6: return t('已取消')
    default: return t('邀请朋友帮忙')
  }
}
function getState() {
  return ableReceive.value && !isApply.value
}
function handleBtn() {
  if ((!props.data) || props.data.state === 1) { // 打开邀请朋友帮忙
    closeDialog()
    showInviteFriendHelp.value = true
  }
  else { // 立即申请&&立即转入钱包
    nextTick(() => {
      runAsyncTurntableBonusApply({
        pid,
      }).then(() => {
        if (props.data?.state === 2 && isApply.value)
          Message.info('奖金提取成功')
        // 这里需要调用flutter的接口，通知flutter奖金提取成功
        usePromoNotifications({ payload: JSON.stringify({ type: '5' }) })
        // closeDialog()
      })
    })
  }
}
</script>

<template>
  <div class="root flex flex-col p-[16px]">
    <div class="h-[36px] flex flex-col justify-center items-center w-full">
      <div v-if="getState()" class="text-tg-secondary-light text-center text-[12px] font-[600]">
        {{ t('即将支付的总金额') }}
      </div>
      <AfunBaseAmount
        :amount="achieved ?? 0" :currency-type="prefix as EnumCurrencyKey"
        style="--afun-base-amount-font-size: 36px;--afun-app-currency-icon-size: 28px"
      />
    </div>
    <div class="theme-bg rounded-[4px] px-[12px] py-[16px]">
      <div>
        <div class="flex items-center">
          <IconUniConfirmed class="text-[17px] text-[#24EE89]" />
          <span class="text-tg-text-white ml-[8px] text-[12px]">{{ t('付款请求已提交') }}</span>
        </div>
        <div class="active-line my-[2px] ml-[8px] h-[16px] w-[1px]" />
      </div>
      <div>
        <div class="flex items-center">
          <IconUniConfirmed class="text-[17px] text-[#24EE89]" />
          <span class="text-tg-text-white ml-[8px] text-[12px]">{{ ableReceive ? (isApply ? $t('申请转入钱包')
            : $t('您可以转入到钱包')) : `${$t('您还需要多少才能提现到钱包', [surplus])}`
          }}</span>
        </div>
        <div class="my-[2px] ml-[8px] h-[16px] w-[1px]" :class="[ableReceive && !isApply ? 'active-line' : 'line']" />
      </div>
      <div>
        <div class="flex items-center">
          <IconUniConfirmed v-if="ableReceive && !isApply" class="text-[17px] text-[#24EE89]" />
          <div v-else class="dot mx-[5px] h-[7px] w-[7px] rounded-[50%]" />
          <AfunBaseAmount
            :amount="data?.total_prize ?? 0" :currency-type="prefix as EnumCurrencyKey" class="theme-sec-text mx-[8px] font-500"
            style="--afun-base-amount-font-size: 12px;--ph-app-currency-icon-size: 13px"
          />
          <span class="theme-sec-text text-[12px]">{{ t('将转入您的钱包账户') }}</span>
        </div>
      </div>
    </div>
    <AfunBaseButton
      class="turn-withdraw-btn"
      type="primary" size="md" :disabled="data?.state === 5" :loading="loadTurntableBonusApply"
      @click="handleBtn"
    >
      {{ format() }}
    </AfunBaseButton>
  </div>
  <AfunBaseDialog v-model="showInviteFriendHelp" :title="t('邀请好友帮忙提款')" style="--afun-base-dialog-background-color: #F6F7F8;">
    <AppDialogInviteFriendHelp v-model="showInviteFriendHelp" :pid="pid" />
  </AfunBaseDialog>
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
  .theme-bg {
    background-color: #2f4553;
    --afun-app-currency-icon-size: 14rem;

    .line {
      background-color: #b1bad3;
    }
    .active-line {
      background-color: #24ee89;
    }
    .dot {
      background-color: #b1bad3;
    }
  }
  .theme-sec-text {
    color: #b1bad3;
  }

  .turn-withdraw-btn {
    --afun-base-button-font-size: 14rem;
  }
}
</style>
