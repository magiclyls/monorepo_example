<script lang="ts" setup>
import type { CurrencyData } from '~/composables/useCurrencyData'

import type { FeedBackItem } from '~/stores/chat'
import { ApiExchangeRateFromTo, ApiMemberApplyVipBonus, ApiMemberFeedbackBonusDraw } from '@tg/apis'

interface Props {
  feedBackItem?: FeedBackItem
  totalBonus?: string
  vipBonus?: string
  vipBonusId?: string
}
defineOptions({
  name: 'AppReceiveBonusDialog',
})
const props = defineProps<Props>()

const emit = defineEmits(['confirm'])

const closeDialog = inject('closeDialog', () => {})

const { t } = useI18n()
const appStore = useAppStore()
const chatStore = useChatStore()
const languageStore = useLanguageStore()
const { userLanguage } = storeToRefs(languageStore)
const { openNotify } = useNotify()
const { width } = useWindowSize()

const currentNetwork = ref('')
const activeCurrency = ref<CurrencyData | null>()
const isMobile = ref(width.value < 768)
const rate = ref('0')

const { runAsync: runGetReateFromTo } = useRequest(ApiExchangeRateFromTo, {
  onSuccess(res, params) {
    const code = params[0].from
    rate.value = scientificToString(toFixed(res[code], 8))
  },
})

const money = computed(() =>
  props.feedBackItem?.amount ?? props.totalBonus ?? props.vipBonus ?? '0')
const ratedMoney = computed(() => {
  if (rate.value && activeCurrency.value)
    return mul(+money.value, +rate.value)
  return +money.value
})

const { run: runDrawBonus, loading } = useRequest(ApiMemberFeedbackBonusDraw, {
  onSuccess: () => {
    if (props.feedBackItem)
      chatStore.setFeedbackItem({ ...props.feedBackItem, bonusState: 2 })
    openNotify({ type: 'success', message: t('receive_success') })
    appStore.getBalanceData()
    closeDialog()
  },
})

const { run: runDrawVipBonus, loading: vipLoading } = useRequest(ApiMemberApplyVipBonus, {
  onSuccess: () => {
    openNotify({ type: 'success', message: t('receive_success') })
    appStore.getBalanceData()
    closeDialog()
  },
})

function receiveBonus() {
  emit('confirm')
  if (props.feedBackItem
    && props.feedBackItem.bonusState === 1
    && props.feedBackItem.feed_id
    && !loading.value) {
    runDrawBonus({ feed_id: props.feedBackItem.feed_id, cur: activeCurrency.value?.cur ?? '706' })
  }

  else if (props.totalBonus && +props.totalBonus > 0) {
    runDrawBonus({ feed_id: '', cur: activeCurrency.value?.cur ?? '706' })
  }

  else if (props.vipBonus) {
    runDrawVipBonus({ cur: activeCurrency.value?.cur ?? '706', id: props.vipBonusId ?? '' })
  }
}

function changeCurrency(item: CurrencyData, network: string) {
  activeCurrency.value = item
  currentNetwork.value = network
}

watch(activeCurrency, (a) => {
  if (a)
    runGetReateFromTo({ from: '706', to: a.cur })
})
</script>

<template>
  <div class="app-receive-bonus" :class="{ 'is-mobile': isMobile }">
    <div class="choose-label mb-[16px]">
      <span>{{ $t('current_wait_receive_label') + userLanguage === 'vi-VN' ? ' ' : '' }}</span>
      <span class="money">{{ money }}
        <BaseImage url="/png/icon/coin-usdt.png" />
      </span>
      <span>{{ $t('choose_bonus_receive_label') }}</span>
    </div>
    <div class="currency-wrap mb-[16px]">
      <AppSelectCurrency
        :show-balance="false"
        :network="false"
        placeholder="search"
        @change="changeCurrency"
      />
      <div class="rate">
        {{ $t('current_exchange_rate') }}：{{ rate }}
      </div>
    </div>
    <div v-if="activeCurrency" class="about-receive mb-[16px]">
      {{ $t('bonus_receive_expect') }}：
      <span>
        <AppAmount class="amount1" :amount="`${ratedMoney}`" :currency-type="activeCurrency.type" />
      </span>
    </div>
    <div class="buttons">
      <BaseButton class="mr-[6px]" size="md" @click="closeDialog">
        {{ $t('cancel') }}
      </BaseButton>
      <BaseButton
        bg-style="secondary"
        class="ml-[6px]"
        size="md"
        :loading="loading || vipLoading"
        @click="receiveBonus"
      >
        {{ $t('confirm_receive') }}
      </BaseButton>
    </div>
  </div>
</template>

<style>
:root {
  --app-receive-bonus-text-color: var(--tg-text-warn);
}

[theme='greenblack'] {
  --app-receive-bonus-text-color: var(--tg-text-greenblack-main);
}
</style>

<style lang="scss" scoped>
.amount1 {
  color: var(--app-receive-bonus-text-color);
  @include webTheme('green') {
    color: #eca30c;
  }
}
.app-receive-bonus {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  // gap: var(--tg-spacing-16);
  text-align: center;
  padding: var(--tg-spacing-4) var(--tg-spacing-16) var(--tg-spacing-16);
  font-size: var(--tg-font-size-default);
  color: var(--tg-text-white);

  &.is-mobile {
    .choose-label {
      display: inline;
      text-align: left;
    }
  }

  .money {
    color: var(--app-receive-bonus-text-color);
    font-size: var(--tg-font-size-default);
    font-weight: var(--tg-font-weight-semibold);
    display: inline-flex;
    align-items: center;
    @include webTheme('white') {
      color: #ff9800;
    }

    // gap: var(--tg-spacing-4);
    svg {
      margin-left: var(--tg-spacing-4);
      margin-right: var(--tg-spacing-6);
    }
  }

  .choose-label {
    display: flex;
    align-items: center;
    color: var(--tg-text-lightgrey);
    line-height: var(--tg-spacing-20);
    flex-wrap: wrap;
    word-break: break-all;
  }

  .currency-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    // gap: var(--tg-spacing-8);
    flex-wrap: wrap;
    width: 100%;

    .rate {
      margin-left: var(--tg-spacing-8);
      font-weight: var(--tg-font-weight-semibold);
      color: var(--tg-text-white);
    }
  }

  .about-receive {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--tg-font-weight-semibold);
    color: var(--tg-text-white);
    > span {
      color: var(--tg-text-warn);
    }
  }

  .buttons {
    display: flex;
    align-items: center;
    // gap: var(--tg-spacing-12);
    width: 100%;

    button {
      flex: 1;
    }
    > button:nth-of-type(1) {
      border: var(--tg-border-width-sm) solid var(--tg-text-green);
      &:first-child {
        color: var(--tg-text-green);
      }
      @include webTheme('white') {
        --tg-text-green: #111;
        --tg-base-button-style-bg: #c1c1c1;
        --tg-base-button-style-bg-hover: #919191;
        border: none;
      }
      @include webTheme('green') {
        --tg-text-green: #ffffff;
        --tg-base-button-style-bg: #0e6746;
        --tg-primary-active: #659d89;
        border: none;
      }
    }
  }
}
</style>
