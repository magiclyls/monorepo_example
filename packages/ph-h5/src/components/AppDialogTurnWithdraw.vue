<script setup lang="ts">
import type { EnumCurrencyKey } from '@tg/types'
import { ApiMemberTurntableBonusApply } from '@tg/apis'
import { PhBaseAmount, PhBaseButton, PhBaseDialog } from '@tg/bccomponents'
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
  <div class="root flex flex-col p-[16rem]">
    <div class="flex flex-col justify-center items-center w-full">
      <div v-if="getState()" class="text-tg-secondary-light text-center text-[12rem] font-[500]">
        {{ t('即将支付的总金额') }}
      </div>
      <PhBaseAmount
        :amount="achieved ?? 0" :currency-type="prefix as EnumCurrencyKey"
        style="--ph-base-amount-font-size: 36rem;--ph-app-currency-icon-size: 28rem"
      />
    </div>
    <div class="theme-bg rounded-[4rem] px-[12rem] py-[16rem]">
      <div>
        <div class="flex items-center">
          <IconUniConfirmed class="text-[17rem] text-[#F23038]" />
          <span class="text-tg-text-white ml-[8rem] text-[12rem]">{{ t('付款请求已提交') }}</span>
        </div>
        <div class="active-line my-[2rem] ml-[8rem] h-[16rem] w-[1rem]" />
      </div>
      <div>
        <div class="flex items-center">
          <IconUniConfirmed class="text-[17rem] text-[#F23038]" />
          <span class="text-tg-text-white ml-[8rem] text-[12rem]">{{ ableReceive ? (isApply ? $t('申请转入钱包')
            : $t('您可以转入到钱包')) : `${$t('您还需要多少才能提现到钱包', [surplus])}`
          }}</span>
        </div>
        <div class="my-[2rem] ml-[8rem] h-[16rem] w-[1rem]" :class="[ableReceive && !isApply ? 'active-line' : 'line']" />
      </div>
      <div>
        <div class="flex items-center">
          <IconUniConfirmed v-if="ableReceive && !isApply" class="text-[17rem] text-[#F23038]" />
          <div v-else class="dot mx-[5rem] h-[7rem] w-[7rem] rounded-[50%]" />
          <PhBaseAmount
            :amount="data?.total_prize ?? 0" :currency-type="prefix as EnumCurrencyKey" class="theme-sec-text mx-[8rem] font-500"
            style="--ph-base-amount-font-size: 12rem;--ph-app-currency-icon-size: 13rem"
          />
          <span class="theme-sec-text text-[12rem]">{{ t('将转入您的钱包账户') }}</span>
        </div>
      </div>
    </div>
    <PhBaseButton
      type="primary" size="md" :disabled="data?.state === 5" :loading="loadTurntableBonusApply"
      @click="handleBtn"
    >
      {{ format() }}
    </PhBaseButton>
  </div>
  <PhBaseDialog v-model="showInviteFriendHelp" :title="t('邀请好友帮忙提款')" style="--ph-base-dialog-background-color: #F6F7F8;">
    <AppDialogInviteFriendHelp v-model="showInviteFriendHelp" :pid="pid" />
  </PhBaseDialog>
</template>

<style lang="scss" scoped>
.root {
  > *:not(:first-child) {
    margin-top: 16rem;
  }
  .amount {
    > *:not(:first-child) {
      margin-top: 10rem;
    }
  }
  .theme-bg {
    background-color: #ffffff;
    .line {
      background-color: #6d7693;
    }
    .active-line {
      background-color: #f23038;
    }
    .dot {
      background-color: #6d7693;
    }
  }
  .theme-sec-text {
    color: var(--tg-text-lightgrey);
  }
}
</style>
