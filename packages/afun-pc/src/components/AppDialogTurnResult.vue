<script setup lang="ts">
import gsap from 'gsap'

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

// const { userInfo } = useAppStore()
const closeDialog = inject('closeDialog', () => { })
const { openInviteFriendHelpDialog } = useDialogInviteFriendHelp()

const resultGsap = reactive({
  showNumber: 0,
})

const getCurrencyConfig = computed(() => {
  return getCurrencyConfigByCode(props.data?.currency_id ?? '706')
})
const getPercent = computed(() => {
  return toFixed(Number(mul(Number(div(Number(props.data?.achieved_prize), Number(props.data?.total_prize))), 100)), 2)
})
const getSurplusBalance = computed(() => {
  return toFixed(Number(sub(Number(props.data?.total_prize), Number(props.data?.achieved_prize))), 2)
})

function share() {
  closeDialog()
  openInviteFriendHelpDialog({ pid: props.pid })
}

onMounted(() => {
  gsap.to(resultGsap, { duration: 1, showNumber: props.data?.achieved_prize })
})
</script>

<template>
  <div class="components-root flex flex-col px-[16px] pb-[16px]">
    <div class="center text-[14px] font-semibold leading-tight">
      {{ data?.username }} {{ $t('lucky_you') }}
    </div>
    <div class="theme-text text-center text-[12px] font-[600]">
      {{ $t('invite_friends_help_withdrawals') }}
    </div>
    <div class="center">
      <BaseImage class="mr-[4px] w-[30px]" url="/png/promotions/price-money.png" />
      <AppAmount
        :amount="resultGsap.showNumber" :currency-type="getCurrencyConfig?.name"
        style="--tg-app-amount-font-size: 36px;--tg-app-currency-icon-size: 28px"
      />
    </div>
    <div class="rate-text w-[100%]">
      <div class="text-tg-text-white text-right text-[14px] font-[500]">
        {{ getPercent }}%
      </div>
      <div>
        <BaseProgress
          width="100%" :percent="Number(getPercent)" :show-info="false" :stroke-width="8"
          stroke-color="var(--tg-primary-success)" class="progress-bg"
        />
      </div>
    </div>
    <div class="theme-text center text-[14px] font-[600]">
      <AppWithI18n keypath="transferring_wallet_still_requires" class="rate-text">
        <AppAmount :amount="getSurplusBalance" :currency-type="getCurrencyConfig?.name" class="text-color" />
      </AppWithI18n>
    </div>
    <BaseButton bg-style="primary" size="md" @click="share">
      {{ $t('share_with_friends') }}
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.theme-text{
  color: var(--tg-secondary-light);
  @include webTheme('white') {
    color: #555;
  }
  @include webTheme('green') {
    color: #3CB389;
  }
}
.components-root{
  > *:not(:first-child) {
    margin-top: 16px;
  }
}
.progress-bg {
  --tg-base-progress-inner-bg: #0F212E;
  @include webTheme('green') {
    --tg-primary-success: #1FFF20;
    --tg-base-progress-inner-bg:#197B59;
  }
  @include webTheme('white') {
    --tg-base-progress-inner-bg: #C1C1C1;
  }
}
.rate-text {
  @include webTheme('green'){
    --tg-secondary-light: #fff;
    --tg-primary-success: #42BC91;
  }
  @include webTheme('white'){
    --tg-primary-success:#F2CA5C;
  }
}
.text-color {
  @include webTheme('green'){
    color: #3CB389;
  }
}
</style>
