<script setup lang="ts">
import { PhBaseAmount, PhBaseButton, PhBaseDialog, PhBaseImage, PhBaseProgress } from '@tg/bccomponents'
import { div, getCurrencyConfig, mul, sub, toFixed } from '@tg/utils'
import gsap from 'gsap'
import { computed, inject, onMounted, reactive, ref, watch } from 'vue'
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

function animateNumber() {
  const targetValue = Number(props.data?.achieved_prize) || 0
  resultGsap.showNumber = 0
  gsap.to(resultGsap, { duration: 1, showNumber: targetValue })
}

watch(() => props.data?.achieved_prize, () => {
  if (props.data?.achieved_prize) {
    animateNumber()
  }
}, { immediate: true })

onMounted(() => {
  animateNumber()
})
</script>

<template>
  <div class="components-root flex flex-col px-[16rem] py-[16rem]">
    <div class="center text-[14rem] font-[500] leading-[1.2]">
      {{ data?.username }} {{ t('你真幸运') }}
    </div>
    <div class="theme-text text-center text-[12rem] text-[#6D7693] font-[500]">
      {{ t('邀请好友帮忙提款') }}
    </div>
    <div class="center">
      <PhBaseImage class="mr-[4rem] w-[30rem]" url="/ph-h5/png/price-money.png" />
      <PhBaseAmount
        :amount="resultGsap.showNumber" :currency-type="getCurrencyConfigAll?.name"
        style="--ph-base-amount-font-size: 36rem;--ph-app-currency-icon-size: 28rem"
      />
    </div>
    <div class="rate-text w-[100%]">
      <div class="text-tg-text-white text-right text-[14rem] font-[500]">
        {{ getPercent }}%
      </div>
      <div>
        <PhBaseProgress
          width="100%" :value="Number(getPercent)" :show-info="false" :stroke-width="8"
          :show-percentage="false"
          stroke-color="var(--tg-primary-success)" class="progress-bg"
        />
      </div>
    </div>
    <div class="theme-text center text-[14rem] font-[500]">
      <AppWithI18n keypath="transferring_wallet_still_requires" class="rate-text">
        <PhBaseAmount :amount="getSurplusBalance" :currency-type="getCurrencyConfigAll?.name" class="text-color" />
      </AppWithI18n>
    </div>
    <PhBaseButton type="primary" size="md" @click="share">
      {{ $t('分享朋友') }}
    </PhBaseButton>
  </div>
  <PhBaseDialog v-model="showInviteFriendHelp" :title="t('邀请好友帮忙提款')" style="--ph-base-dialog-background-color: #F6F7F8;">
    <AppDialogInviteFriendHelp v-model="showInviteFriendHelp" :pid="pid" />
  </PhBaseDialog>
</template>

<style lang="scss" scoped>
.theme-text {
  color: var(--tg-secondary-light);
}
.components-root {
  > *:not(:first-child) {
    margin-top: 16rem;
  }
}
.progress-bg {
  --tg-base-progress-inner-bg: #0f212e;
}
</style>
