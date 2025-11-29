<script setup lang="ts">
import gsap from 'gsap'

interface Props {
  showRoll?: boolean
  data?: {
    [key: string]: string
  }
  state?: number
  pid?: string
  amount?: string
}
defineOptions({
  name: 'AppDialogFreeGetMany',
})
const props = withDefaults(defineProps<Props>(), {
  showRoll: false,
  amount: '0',
  pid: '',
})

const closeDialog = inject('closeDialog', () => { })
const { openInviteFriendHelpDialog } = useDialogInviteFriendHelp()
const resultRoll = ref(props.amount)
const turntableConfig = ref(props.data)
const resultGsap = reactive({
  showNumber: 0,
})

const getCurrencyConfig = computed(() => {
  return getCurrencyConfigByCode(turntableConfig.value?.currency_id ?? '706')
})
const getPercent = computed(() => {
  return toFixed(Number(mul(Number(div(Number(resultRoll.value), Number(turntableConfig.value?.withdraw_amount))), 100)), 2)
})
const getSurplusBalance = computed(() => {
  return toFixed(Number(sub(Number(turntableConfig.value?.withdraw_amount), Number(resultRoll.value))), 2)
})

watch(() => resultRoll.value, (newVal) => {
  gsap.to(resultGsap, { duration: 1.2, showNumber: newVal, ease: 'power4.out' })
}, { immediate: true })

function pathTo() {
  closeDialog()
  openInviteFriendHelpDialog({ pid: props.pid })
}
</script>

<template>
  <div class="component-root flex flex-col items-center">
    <div class="center text-[14px] leading-[6px]">
      <AppCurrencyIcon
        style="--tg-app-currency-icon-size: var(--tg-font-size-md)"
        :currency-type="getCurrencyConfig?.name"
      />
      <span class="ml-[4px]">
        {{ $t('minimum_withdrawal_money', {
          mount: application.formatNumDecimal(turntableConfig?.withdraw_amount ?? 0,
                                              getCurrencyConfig.decimal),
        }) }}
      </span>
    </div>
    <div class="text-tg-secondary-light text-[12px] font-[600]">
      {{ $t('congratulations_good_luck_won_money') }}
    </div>
    <div class="center">
      <BaseImage class="mr-[8px] w-[30px]" url="/png/promotions/price-money.png" />
      <AppAmount
        :amount="resultGsap.showNumber" :currency-type="getCurrencyConfig?.name"
        style="--tg-app-amount-font-size: 36px;--tg-app-currency-icon-size: 28px"
      />
    </div>
    <div class="rate-text w-[92%]">
      <div class="text-tg-text-white text-right text-[14px] font-[500]">
        {{ getPercent }}%
      </div>
      <div>
        <BaseProgress
          width="100%" :percent="Number(getPercent)" :show-info="false" :stroke-width="8"
          stroke-color="var(--tg-primary-success)" style="--tg-base-progress-inner-bg:var(--tg-secondary-dark)"
        />
      </div>
    </div>
    <div class="text-tg-secondary-light center text-[14px] font-[600]">
      <AppWithI18n keypath="transferring_wallet_still_requires" class="rate-text">
        <AppAmount :amount="getSurplusBalance" :currency-type="getCurrencyConfig?.name" class="text-tg-secondary-light" />
      </AppWithI18n>
    </div>
    <BaseButton class="btn-receive" bg-style="secondary" size="md" @click="pathTo">
      {{ $t('request_more_cash') }}
    </BaseButton>
  </div>
  <div class="text-tg-secondary-light mt-[16px] bg-[var(--tg-secondary-dark)] p-[24px] text-center text-[14px] font-[600]">
    {{ $t('spin_free_win_real_money') }}
  </div>
</template>

<style lang="scss" scoped>
.component-root{
  > *:not(:first-child) {
   margin-top: 16px;
  }

}
.rate-text {
  @include webTheme('green'){
    --tg-text-white: #42BC91;
    --tg-secondary-light: #fff;
    --tg-primary-success: #42BC91;
  }
}
</style>
