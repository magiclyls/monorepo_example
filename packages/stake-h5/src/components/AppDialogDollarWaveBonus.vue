<script lang="ts" setup>
import type { CurrencyCode } from '~/composables/useCurrencyData'

import { ApiMemberPromoRedBonus } from '@tg/apis'
import AppAmountNotify from './AppAmountNotify.vue'

interface Props {
  pid: string
  firstBonusData: any
  bonusData: any
  nextScope: string
  isBRL?: boolean
  isCrystal?: boolean
  exchangeCb?: () => void
  closeCb?: () => void
  showCount?: boolean
  currencyName: CurrencyCode
}
defineOptions({
  name: 'AppDialogDollarWaveBonus',
})
const props = defineProps<Props>()

const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const appStore = useAppStore()
const { isLogin, currentGlobalCurrency } = storeToRefs(appStore) // , currentGlobalCurrency
const promoStore = usePromoStore()
const { redCountCurrent: current, lastBonusData } = storeToRefs(promoStore)
const { openNotify } = useNotify()
const { userLanguage } = storeToRefs(useLanguageStore())
const sorryTxt = computed(() => {
  if (props.isBRL)
    return t('money_empty_brl')
  if (props.isCrystal)
    return t('money_empty_crystal')
  return t('money_empty')
})
const nextScopeTxt = computed(() => props.isBRL ? t('next_money_brl') : props.isCrystal ? t('next_money_crystal') : t('next_money'))
const showTime = computed(() => {
  if (!current.value)
    return '00:00'
  const m = current.value.minutes < 10 ? `0${current.value.minutes}` : current.value.minutes
  const s = current.value.seconds < 10 ? `0${current.value.seconds}` : current.value.seconds
  return `${m}:${s}`
})

const globalCurrencyCode = computed(() => props.currencyName ?? '701' as CurrencyCode)
const languageCurrencyType = computed(() => getCurrencyConfigByCode(globalCurrencyCode.value).name)

const canReceive = computed(() => {
  // props.bonusData.state === 2
  return props.bonusData.amount > 0
})

const notifyThrottle = throttle(() => {
  openNotify({
    type: 'success',
    title: t('receive_success'),
    message: () => {
      return h(AppAmountNotify, {
        data: [{ currency: globalCurrencyCode.value, currencyName: languageCurrencyType.value, amount: props.bonusData.amount }],
      })
    },
  })
}, 5 * 1000)

const { data: bonusData, runAsync: runGetBonus, loading: bonusLoading } = useRequest(ApiMemberPromoRedBonus, {
  ready: isLogin,
  manual: true,
  onAfter: () => {
    appEventBus.emit(EventBusNames.USER_REFRESH_RED_CLAIMED)
  },
})

function langNotify(m: string) {
  openNotify({
    type: 'info',
    message: t('promo_lang_receive', [m]),
  })
}

const notifyLangThrottle = throttle(langNotify, 5 * 1000, { leading: true, trailing: false })

// 兑换回调
function dealExchange() {
  // if (exchangeLoading.value)
  //   return
  // runExchangeBonus(props.pid)
  const code = globalCurrencyCode.value
  runGetBonus(props.pid, code, 1).then((res: any) => {
    if (res === 0) {
      openNotify({
        icon: 'chess-gameshow',
        iconColor: '--tg-text-alltheme-green',
        title: t('warm_tip'),
        message: t('activity_not_start'),
      })
    }
    else if (res) {
      if (res.tongue && +res.state === 4)
        notifyLangThrottle(t(`lang_${res.tongue}`))
    }
    if (res?.state === 2) {
      notifyThrottle()
      appEventBus.emit(EventBusNames.USER_CLAIMED_DOLLAR_BONUS)
      if (lastBonusData.value)
        promoStore.setLastBonusData({ ...res })
    }
  }).finally(() => {
    closeDom()
  })
}

function close() {
  if (props.bonusData && props.bonusData.amount)
    dealExchange()
}

function closeDom() {
  props.closeCb && props.closeCb()
  closeDialog()
}

watch(current, (val, old) => {
  if (val && val.total < 1000)
    closeDom()
})

console.log('nextScope', props.nextScope, props.isCrystal)
</script>

<template>
  <BaseAspectRatio :ratio="isBRL ? '1428/1500' : '1429/1684'" class="flex items-center justify-center px-[9px]">
    <section class="app-dollar-wave-bonus relative mx-auto h-full w-full flex flex-col justify-center" :class="[`wave-${userLanguage}`, isBRL ? 'brl-wave' : isCrystal ? 'crystal-wave' : 'red-wave']">
      <template v-if="showCount">
        <div class="no-bonus on-counting" :class="isCrystal ? 'flex flex-col justify-between mt-[20px]' : 'h-[70%] w-[70%] mx-auto flex flex-col justify-between'">
          <div class="xs:text-[36px] text-center text-[9.6vw] font-semibold text-[#FF0834]">
            <div class="warm-title mb-[4px]" :class="[isCrystal && 'crystal-warm-title', userLanguage]" :text="t('warm_tip')">
              {{ t('warm_tip') }}
            </div>
            <div class="sorry-text xs:mt-[12px] xs:text-[24px] flex justify-center text-[6.4vw] text-[#271C08]" :text="t('promo_not_active')">
              {{ t('promo_not_active') }}
            </div>
          </div>
          <div class="sorry-div xs:h-[8px] empty-div h-[2.13vw]" :class="[`empty-div-${userLanguage}`]" />
          <div
            class="xs:text-[24px] xs: text-tg-text-white next-scope mx-auto w-full flex flex-col items-center justify-center text-[6.4vw] font-semibold"
            :class="isCrystal || isBRL ? '' : 'mb-[30px] xs:mb-[60px]'"
          >
            <div class="next-desc w-[84%] text-center" :text="t('count_down_label')">
              {{ t('count_down_label') }}
            </div>
            <div class="xs:text-[36px] mt-[6px] text-[8vw] font-medium" :class="[isCrystal && 'crystal-countdown']" :text="showTime">
              {{ showTime }}
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-if="canReceive" class="has-bonus" :class="isBRL ? 'h-[65%] flex flex-col justify-between ' : !isCrystal ? 'h-[60%] flex flex-col justify-between mt-[-15%]' : ''">
          <div class="xs:text-[36px] text-center text-[8vw] font-semibold text-[#FF0834]">
            <div class="b-title mb-[4px] mt-[8px]" :text="$t('luck_money')" :class="[isCrystal && 'crystal-lucky-money']">
              {{ $t('luck_money') }}
            </div>
            <div class="flex justify-center" style="--tg-app-currency-icon-size:20px;" :class="[isCrystal && 'crystal-bonus-amount']">
              <AppAmount class="currency-img" :amount="firstBonusData.amount || 100" :currency-type="languageCurrencyType" :show-icon="true" />
            </div>
          </div>
          <div class="empty-div luck-div xs:h-[12px] h-[3.2vw]" :class="[`empty-div-${userLanguage}`]" />
          <div
            class="receive xs:text-[28px] xs:h-[55px] mx-auto h-[40px] max-w-[210px] w-[56vw] flex cursor-pointer items-center justify-center text-[7.47vw] font-semibold text-[#DE3535]"
            :class="[isCrystal && 'crystal-btn']"
            @click="close"
          >
            <span :text="$t('vip_right_now')">{{ $t('vip_right_now') }}</span>
          </div>
        </div>
        <div v-else class="no-bonus mx-auto w-full" :class="[`bonus-state-${props.bonusData.state}`, isCrystal ? '!w-[140px]' : isBRL ? 'h-[70%] w-[80%] flex flex-col justify-between items-center' : 'h-[60%] mt-[-10%] flex flex-col justify-between items-center']">
          <div class="xs:text-[36px] sorry-top w-full text-center text-[8vw] font-semibold text-[#FF0834]" :class="[userLanguage]">
            <div class="title mb-[8px]" :text="$t('sorry')" :class="[isCrystal && mt - 30]">
              {{ $t('sorry') }}
            </div>
            <div class="sorry-text xs:mt-[12px] xs:text-[24px] mx-auto mt-[3vw] w-[70%] flex justify-center text-[6.4vw] leading-[20px] text-[#271C08]" :text="sorryTxt" :class="isCrystal ? 'w-[140px]' : 'w-[250px]'">
              {{ sorryTxt }}
            </div>
          </div>
          <div class="empty-div sorry-div xs:h-[8px] h-[2.1vw]" :class="[`empty-div-${userLanguage}`]" />
          <div
            class="next-scope xs:text-[24px] mx-auto w-full flex flex-col items-center justify-center text-[6.4vw] font-semibold text-white"
          >
            <div class="next-desc mb-[4px] text-center leading-[20px]" :text="nextScopeTxt" :class="isCrystal ? 'w-[100px]' : 'w-[70%]'">
              {{ nextScopeTxt }}
            </div>
            <div class="xs:text-[20px] xs:leading-[28px] next-time mt-[6px] text-[5.33vw] font-medium leading-[7.4vw]" :text="nextScope?.split('-')[0]">
              {{ nextScope?.split('-')[0] }}
            </div>
          </div>
        </div>
      </template>
      <div v-if="!canReceive" class="close absolute cursor-pointer" :class="[isBRL ? 'brl-close bottom-[-10vw] xs:bottom-[-40px]' : 'bottom-0']" @click.stop="closeDom">
        <BaseImage url="/png/icons/uni-close-line.png" class="w-[36px] h-[36px]" />
      </div>
    </section>
  </BaseAspectRatio>
</template>

<style lang="scss" scoped>
.empty-div {
  display: none;
}
.b-title {
  font-family: Proxima Nova;
}

.wave-th-TH {
  .sorry-text {
    font-size: 5.33vw;
  }
}
.wave-vi-VN {
  * {
    font-family: 'proxima-nova';
  }
  .has-bonus {
    .b-title {
      font-size: 8vw;
      line-height: 8vw;
      padding: 0 10vw;
      font-weight: 600;
    }
  }
  .sorry-text {
    word-spacing: -1.5px;
  }
  .no-bonus.on-counting {
    .warm-title {
      font-size: 8.5vw;
    }
    .sorry-text {
      font-size: 5.86vw;
    }
  }
}
.wave-hi-IN {
  .next-scope {
    margin-top: 20.5vw;
  }
  &.brl-wave {
    .no-bonus.on-counting {
      .next-scope {
        margin-top: 29vw;
      }
    }
  }
}
.wave-en-US {
  .no-bonus.on-counting {
    .sorry-text {
      font-size: 5.06vw;
    }
  }
  .bonus-state-1 {
    .sorry-text {
      font-size: 5.06vw;
    }
    .next-desc {
      font-size: 6vw;
    }
  }
  .bonus-state-3 {
    .sorry-text {
      font-size: 4.53vw;
      line-height: 5.86vw;
    }
    .next-scope {
      margin-top: 25.6vw;
    }
  }
}
.wave-pt-BR {
  .b-title {
    font-size: 7.5vw;
  }
  .sorry-text {
    font-size: 5vw;
    word-spacing: -1px;
  }
  .next-scope {
    font-size: 5.33vw;
  }
  .receive {
    font-size: 7.47vw;
  }
  .no-bonus.on-counting {
    .next-desc {
      line-height: 6.4vw;
      padding-top: 3.2vw;
    }
  }
}
.app-dollar-wave-bonus {
  --tg-app-amount-font-size: 26px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  @include getBackgroundImage('/promotions/dollar-bg-0');
  .crystal-warm-title {
    text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.4);
    font-family: 'PingFang SC';
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 30px;
    background: linear-gradient(90deg, #ffe7ba 0%, #ffc65b 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    &.zh-CN {
      font-size: 24.435px;
    }
  }

  .crystal-countdown {
    text-shadow: 0px 0.651px 2.605px rgba(0, 0, 0, 0.4);
    font-family: 'PingFang SC';
    font-size: 15.913px;
    font-style: normal;
    font-weight: 600;
    filter: brightness(1.3);
    background: linear-gradient(90deg, #ffffff 0%, #b4aaf4 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .crystal-lucky-money {
    text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.4);
    font-family: 'PingFang SC';
    font-size: 24.435px;
    font-style: normal;
    font-weight: 600;
    background: linear-gradient(180deg, #fff 0%, #aeaeff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: brightness(1.3);
    line-height: 30px;
    width: 130px;
    padding: 0 !important;
    margin: 0 auto;
  }
  &.brl-wave {
    .empty-div {
      display: block;
    }
    background-position: center;
    @include getBackgroundImage('/promotions/brl-bg-0');
    &.wave-pt-BR {
      .no-bonus.bonus-state-1 {
        .next-scope {
          margin-top: 11vw;
        }
        .next-desc {
          line-height: 5.86vw;
        }
      }
    }
  }
  &.crystal-wave {
    .empty-div {
      display: block;
    }
    background-position: center;
    @include getBackgroundImage('/promotions/crystal-bg-0');
    background-size: 375px;
    .sorry-top {
      text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.4);
      background: linear-gradient(90deg, #ffe7ba 0%, #ffc65b 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 20px;
      font-style: normal;
      font-weight: 600;
      filter: brightness(1.3);
      &.zh-CN {
        font-size: 24.435px;
      }
    }
    .sorry-text {
      text-shadow: 0px 1px 1.7px rgba(0, 0, 0, 0.3);
      font-family: 'PingFang SC';
      font-size: 15.227px;
      font-style: normal;
      font-weight: 600;
      margin-top: 10 !important;
      filter: brightness(1.3);
      background: linear-gradient(90deg, #ffe7ba 0%, #ffc65b 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .next-scope {
      margin-top: 20px !important;
    }
    .next-time {
      text-shadow: 0px 0.651px 2.605px rgba(0, 0, 0, 0.4);
      font-family: 'PingFang SC';
      font-size: 15.913px;
      font-style: normal;
      font-weight: 600;
      background: linear-gradient(90deg, #ffffff 0%, #b4aaf4 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: 0 !important;
      line-height: 14px;
      filter: brightness(1.3);
    }
    .next-desc {
      font-size: 15px !important;
    }
  }
  .close {
    font-size: 9.33vw;
    left: calc((50% - 4.66vw));
    display: flex;
    // &.brl-close {
    //   bottom: -40px;
    // }
    @include webTheme('green') {
      --tg-icon-color: #fff;
    }
    @include webTheme('white') {
      --tg-icon-color: #fff;
    }
  }
  &.brl-wave {
    .receive {
      @include getBackgroundImage('/promotions/yellow-btn-brl');
    }
  }
  .receive {
    background-position: center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    @include getBackgroundImage('/promotions/yellow-btn');
  }
}

@media screen and (min-width: 375px) {
  .wave-th-TH {
    .sorry-text {
      font-size: 20px;
    }
  }
  .wave-vi-VN {
    .has-bonus {
      .b-title {
        font-size: 30px;
        line-height: 30px;
        padding: 0 80px;
        font-weight: 600;
      }
    }
    .sorry-text {
      word-spacing: -1.5px;
    }
    .no-bonus.on-counting {
      .warm-title {
        font-size: 32px;
      }
      .sorry-text {
        font-size: 22px;
      }
    }
  }
  .wave-hi-IN {
    .sorry-text {
      padding-left: 50px;
      padding-right: 50px;
    }
    .next-scope {
      margin-top: 77px;
    }
    &.brl-wave {
      .no-bonus.on-counting {
        .next-scope {
          margin-top: 110px;
        }
      }
    }
    &.crystal-wave {
      .no-bonus.on-counting {
        .next-scope {
          margin-top: 20px;
        }
      }
    }
  }
  .wave-en-US {
    .bonus-state-1 {
      .sorry-text {
        font-size: 19px;
      }
      .next-scope {
        margin-top: 96px;
      }
      .next-desc {
        font-size: 20px;
      }
    }
    .bonus-state-3 {
      .sorry-text {
        font-size: 17px;
        line-height: 22px;
      }
      .next-scope {
        margin-top: 96px;
      }
    }
    .no-bonus.on-counting {
      .sorry-text {
        font-size: 19px;
      }
    }
  }
  .wave-pt-BR {
    .b-title {
      font-size: 31px;
    }
    .sorry-text {
      font-size: 19px;
      word-spacing: -1px;
    }
    .next-scope {
      font-size: 20px;
    }
    .receive {
      font-size: 26px;
    }
    .no-bonus.on-counting {
      .next-desc {
        line-height: 24px;
        padding-top: 12px;
      }
    }
  }
  .app-dollar-wave-bonus {
    --tg-app-amount-font-size: 24px;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @include getBackgroundImage('/promotions/dollar-bg-0');
    .crystal-warm-title {
      text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.4);
      font-family: 'PingFang SC';
      font-size: 20px;
      font-style: normal;
      font-weight: 600;
      line-height: 30px;
      background: linear-gradient(90deg, #ffe7ba 0%, #ffc65b 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: brightness(1.3);
      &.zh-CN {
        font-size: 24.435px;
      }
    }
    .crystal-countdown {
      text-shadow: 0px 0.651px 2.605px rgba(0, 0, 0, 0.4);
      font-family: 'PingFang SC';
      font-size: 15.913px;
      font-style: normal;
      font-weight: 600;
      background: linear-gradient(90deg, #ffe7ba 0%, #ffc65b 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: brightness(1.3);
    }
    .crystal-btn {
      margin-top: 10px !important;
      width: 152px;
      height: 40px;
      font-size: 20px;
      span {
        background: linear-gradient(180deg, #4354da 9.15%, #242d74 91.61%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 600;
      }
    }
    .crystal-bonus-amount {
      background: linear-gradient(90deg, #ffe7ba 0%, #ffc65b 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.4);
      font-family: 'PingFang SC';
      font-size: 26px;
      font-style: normal;
      font-weight: 600;
      filter: brightness(1.3);
    }
    &.brl-wave {
      .empty-div {
        display: block;
      }
      background-position: center;
      @include getBackgroundImage('/promotions/brl-bg-0');
      &.wave-pt-BR {
        .no-bonus.bonus-state-1 {
          .next-scope {
            margin-top: 80px;
          }
          .next-desc {
            line-height: 22px;
          }
        }
      }
      &.wave-en-US {
        .no-bonus.bonus-state-1 {
          .next-scope {
            margin-top: 100px;
            .next-desc {
              font-size: 20px;
            }
          }
        }
      }
      &.wave-hi-IN {
        .no-bonus.bonus-state-1 {
          .sorry-text {
            font-size: 22px;
          }
          .next-scope {
            margin-top: 118px;
          }
        }
      }
    }
    &.crystal-wave {
      .empty-div {
        display: block;
      }
      background-position: center;
      @include getBackgroundImage('/promotions/crystal-bg-0');
      background-size: 375px;
      .sorry-top {
        text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.4);
        background: linear-gradient(90deg, #ffe7ba 0%, #ffc65b 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        filter: brightness(1.3);
        &.zh-CN {
          font-size: 24.435px;
        }
      }
      .sorry-text {
        text-shadow: 0px 1px 1.7px rgba(0, 0, 0, 0.3);
        font-family: 'PingFang SC';
        font-size: 15.227px;
        font-style: normal;
        font-weight: 600;
        background: linear-gradient(90deg, #ffffff 0%, #b4aaf4 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-top: 0 !important;
        filter: brightness(1.3);
      }
      .next-desc {
        text-shadow: 0px 1px 1.7px rgba(0, 0, 0, 0.3);
        font-family: 'PingFang SC';
        font-size: 15.227px;
        font-style: normal;
        font-weight: 600;
        font-weight: 600;
        background: linear-gradient(90deg, #ffffff 0%, #b4aaf4 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        filter: brightness(1.3);
      }
      .next-scope {
        margin-top: 20px !important;
      }
      .next-time {
        text-shadow: 0px 0.651px 2.605px rgba(0, 0, 0, 0.4);
        font-family: 'PingFang SC';
        font-size: 15.913px;
        font-style: normal;
        font-weight: 600;
        background: linear-gradient(90deg, #ffe7ba 0%, #ffc65b 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-top: 0 !important;
        line-height: 14px;
        filter: brightness(1.3);
      }
      &.wave-en-US {
        .no-bonus.bonus-state-1 {
          .next-scope {
            margin-top: 106px;
            .next-desc {
              font-size: 20px;
            }
          }
        }
      }
      &.wave-hi-IN {
        .no-bonus.bonus-state-1 {
          .sorry-text {
            font-size: 22px;
          }
          .next-scope {
            margin-top: 118px;
          }
        }
      }
    }
    .close {
      font-size: 35px;
      left: calc((50% - 17.5px));
      display: flex;
      // &.brl-close {
      //   bottom: -40px;
      // }
    }
    &.brl-wave {
      .receive {
        @include getBackgroundImage('/promotions/yellow-btn-brl');
      }
    }
    .receive {
      background-position: center;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      @include getBackgroundImage('/promotions/yellow-btn');
    }
  }
}
</style>
