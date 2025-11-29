<script setup lang="ts">
import { AfunBaseAmount, AfunBaseButton, AfunBaseDialog, AfunBaseImage, AfunBaseProgress } from '@tg/bccomponents'
import { div, getCurrencyConfig, mul, sub, toFixed } from '@tg/utils'
import gsap from 'gsap'
import { computed, inject, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppDialogInviteFriendHelp from './AppDialogInviteFriendHelp.vue'
import AppWithI18n from './AppWithI18n.vue'

interface Props {
  data?: any
  pid?: string
  amount?: string
}
defineOptions({
  name: 'AppDialogTurnResult',
})
const props = withDefaults(defineProps<Props>(), {
  showRoll: false,
  amount: '0',
})
const { t } = useI18n()
const showInviteFriendHelp = ref(false)
const pid = computed(() => props.pid)
// const { userInfo } = useAppStore()
const closeDialog = inject('closeDialog', () => { })
//  const { openInviteFriendHelpDialog } = useDialogInviteFriendHelp()

const resultGsap = reactive({
  showNumber: 0,
})

const getCurrencyConfigAll = computed(() => {
  return getCurrencyConfig(props.data?.currency_id ?? '706')
})
const getPercent = computed(() => {
  const achievedPrize = Number(props.data?.achieved_prize) || 0
  const totalPrize = Number(props.data?.total_prize) || 0

  if (totalPrize === 0) {
    return '0.00'
  }

  return toFixed(Number(mul(Number(div(achievedPrize, totalPrize)), 100)), 2)
})
const getSurplusBalance = computed(() => {
  const totalPrize = Number(props.data?.total_prize) || 0
  const achievedPrize = Number(props.data?.achieved_prize) || 0

  return toFixed(Number(sub(totalPrize, achievedPrize)), 2)
})

function share() {
  closeDialog()
  showInviteFriendHelp.value = true
  // openInviteFriendHelpDialog({ pid: props.pid })
}

onMounted(() => {
  const targetValue = Number(props.data?.achieved_prize) || 0
  gsap.to(resultGsap, { duration: 1, showNumber: targetValue })
})
</script>

<template>
  <div class="components-root flex flex-col px-[16px] py-[16px]">
    <div class="center text-[14px] font-[600] leading-[1.2]">
      {{ data?.username }} {{ t('你真幸运') }}
    </div>
    <div class="theme-text text-center text-[12px] text-[#6D7693] font-[600]">
      {{ t('邀请好友帮忙提款') }}
    </div>
    <div class="center">
      <AfunBaseImage class="mr-[4px] w-[30px]" url="/m/afun-h5/png/price-money.png" />
      <AfunBaseAmount
        :amount="resultGsap.showNumber" :currency-type="getCurrencyConfigAll?.name"
        style="--afun-base-amount-font-size: 36px;--afun-app-currency-icon-size: 28px"
      />
    </div>
    <div class="rate-text w-[100%]">
      <div class="text-tg-text-white text-right text-[14px] font-[600]">
        {{ getPercent }}%
      </div>
      <div>
        <AfunBaseProgress
          width="100%" :value="Number(getPercent)" :show-info="false" :stroke-width="8"
          :show-percentage="false"
          stroke-color="var(--tg-primary-success)" class="progress-bg" background-color="#0F212E" bar-color="#1fff20"
        />
      </div>
    </div>
    <div class="theme-text center text-[14px] font-[600]">
      <AppWithI18n keypath="transferring_wallet_still_requires" class="rate-text">
        <AfunBaseAmount :amount="getSurplusBalance" :currency-type="getCurrencyConfigAll?.name" class="text-color" />
      </AppWithI18n>
    </div>
    <AfunBaseButton type="primary" size="md" @click="share">
      {{ $t('分享朋友') }}
    </AfunBaseButton>
  </div>
  <AfunBaseDialog v-model="showInviteFriendHelp" :title="t('邀请好友帮忙提款')" style="--afun-base-dialog-background-color: #F6F7F8;">
    <AppDialogInviteFriendHelp v-model="showInviteFriendHelp" :pid="pid" />
  </AfunBaseDialog>
</template>

<style lang="scss" scoped>
.theme-text {
  --afun-base-amount-font-size: 14rem;
  color: var(--tg-secondary-light);
}
.components-root {
  > *:not(:first-child) {
    margin-top: 16px;
  }
}
.progress-bg {
  --tg-base-progress-inner-bg: #0f212e;
}
</style>
