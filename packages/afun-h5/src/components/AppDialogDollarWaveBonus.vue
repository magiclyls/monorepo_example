<script lang="tsx" setup>
import type { CurrencyCode } from '@tg/types'
import { ApiMemberPromoRedBonus } from '@tg/apis'
import { AfunBaseAmount, AfunBaseDialog, BaseAspectRatio } from '@tg/bccomponents'
import { IconUniClose } from '@tg/icons'
import { useAppStore, useDialogStore, usePromoStore } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus, getCurrencyConfig } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppPromoNotifications from '~/components/AppPromoNotifications.vue'
import { Message } from '~/utils'

interface Props {
  /* pid: string
  firstBonusData: any
  bonusData: any
  nextScope: string
  isBRL?: boolean
  isCrystal?: boolean
  exchangeCb?: () => void
  closeCb?: () => void
  showCount?: boolean
  currencyName: CurrencyCode */
}
defineOptions({
  name: 'AppDialogDollarWaveBonus',
})
const props = defineProps<Props>()

const { t } = useI18n()
const userLanguage = getLang()
const appStore = useAppStore()
const dialogStore = useDialogStore()
const { isLogin } = storeToRefs(appStore) // , currentGlobalCurrency
const { dialogBonusData } = storeToRefs(dialogStore)
const promoStore = usePromoStore()
const { redCountCurrent: current, lastBonusData } = storeToRefs(promoStore)
const sorryTxt = computed(() => {
  if (dialogBonusData.value.isBRL)
    return t('本场金钱雨已被领完')
  if (dialogBonusData.value.isCrystal)
    return t('本场水晶已被领完')
  return t('本场红包已被领完')
})
const nextScopeTxt = computed(() => dialogBonusData.value.isBRL ? t('下一场金钱雨') : dialogBonusData.value.isCrystal ? t('下一场水晶') : t('下一场红包'))
const bgImg1 = computed(() => dialogBonusData.value.isBRL ? '/brl-bg-0' : dialogBonusData.value.isCrystal ? '/crystal-bg-0' : '/dollar-bg-0')
const bgImg2 = computed(() => dialogBonusData.value.isBRL ? '/yellow-btn-brl' : '/yellow-btn')
const showTime = computed(() => {
  if (!current.value)
    return '00:00'
  const m = current.value.minutes < 10 ? `0${current.value.minutes}` : current.value.minutes
  const s = current.value.seconds < 10 ? `0${current.value.seconds}` : current.value.seconds
  return `${m}:${s}`
})

const globalCurrencyCode = computed(() => dialogBonusData.value.currencyName ?? '701' as CurrencyCode)
const languageCurrencyType = computed(() => getCurrencyConfig(globalCurrencyCode.value).name)

const canReceive = computed(() => {
  // dialogBonusData.value.bonusData.state === 2
  return dialogBonusData.value.bonusData.amount > 0
})

const notifyThrottle = throttle(() => {
  Message.success(
    (
      <div class="center">
        <span class="">{`${t('领取成功')}，`}</span>
        <AppPromoNotifications
          amount={dialogBonusData.value.bonusData.amount}
          type="2"
          currencyType={languageCurrencyType.value}
          t={t}
        />
      </div>
    ),
  )
}, 5 * 1000)

const { data: bonusData, runAsync: runGetBonus, loading: bonusLoading } = useRequest(ApiMemberPromoRedBonus, {
  ready: isLogin,
  manual: true,
  onAfter: () => {
    appEventBus.emit(EventBusNames.USER_REFRESH_RED_CLAIMED)
  },
})

function langNotify(m: string) {
  Message.info(t('请切换至{0}领取', [m]))
}

const notifyLangThrottle = throttle(langNotify, 5 * 1000, { leading: true, trailing: false })

// 兑换回调
function dealExchange() {
  // if (exchangeLoading.value)
  //   return
  // runExchangeBonus(dialogBonusData.value.pid)
  const code = globalCurrencyCode.value
  runGetBonus(dialogBonusData.value.pid, code, 1).then((res: any) => {
    if (res === 0) {
      Message.info(t('活动未开始请稍后再试'))
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
  if (dialogBonusData.value.bonusData && dialogBonusData.value.bonusData.amount)
    dealExchange()
}

function closeDom() {
  dialogBonusData.value?.closeCb && dialogBonusData.value.closeCb()
  dialogBonusData.value = undefined
}

watch(current, (val, old) => {
  if (val && val.total < 1000)
    closeDom()
})
</script>

<template>
  <AfunBaseDialog v-model="dialogBonusData" style="--afun-base-dialog-background-color:transparent;" :show-header="false">
    <BaseAspectRatio v-if="dialogBonusData" :ratio="dialogBonusData.isBRL ? '1428/1500' : '1429/1684'" class="flex items-center justify-center px-[9px]">
      <section
        v-bg-image="bgImg1"
        class="app-dollar-wave-bonus relative mx-auto h-full w-full flex flex-col justify-center"
        :class="[`wave-${userLanguage}`, dialogBonusData.isBRL ? 'brl-wave' : dialogBonusData.isCrystal ? 'crystal-wave' : 'red-wave']"
      >
        <template v-if="dialogBonusData.showCount">
          <div class="no-bonus  on-counting" :class="dialogBonusData.isCrystal ? 'flex flex-col justify-between mt-[20px]' : 'h-[70%] w-[70%] mx-auto flex flex-col justify-between'">
            <div class="text-[28px] text-center  font-semibold text-[#FF0834]">
              <div class="warm-title " :class="[dialogBonusData.isCrystal && 'crystal-warm-title', userLanguage]" :text="t('温馨提示')">
                {{ t('温馨提示') }}
              </div>
              <div class="sorry-text mt-[6px] text-[18px] flex justify-center  text-[#271C08]" :text="t('活动还未开启')">
                {{ t('活动还未开启') }}
              </div>
            </div>
            <div class="sorry-div h-[8px] empty-div " :class="[`empty-div-${userLanguage}`]" />
            <div
              class="text-[20px] text-white next-scope mx-auto w-full flex flex-col items-center justify-center  font-semibold"

              :class="{
                isCrystal: dialogBonusData.isCrystal,
                isBRL: dialogBonusData.isBRL,
              }"
            >
              <div class="next-desc w-[84%] text-center" :text="t('倒计时')">
                {{ t('倒计时') }}
              </div>
              <div class="mt-[6px]  font-[600]" :class="[dialogBonusData.isCrystal && 'crystal-countdown']" :text="showTime">
                {{ showTime }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="canReceive" class="has-bonus " :class="dialogBonusData.isBRL ? 'h-[65%] flex flex-col justify-between ' : !dialogBonusData.isCrystal ? 'h-[60%] flex flex-col justify-between mt-[-15%]' : ''">
            <div class="text-[28px] text-center  font-semibold text-[#FF0834]">
              <div class="b-title mb-[4px] mt-[8px]" :text="$t('幸运奖金')" :class="[dialogBonusData.isCrystal && 'crystal-lucky-money']">
                {{ $t('幸运奖金') }}
              </div>
              <div class="flex justify-center" style="--ph-app-currency-icon-size:20px;   --ss-base-amount-font-size:38px;">
                <AfunBaseAmount class="currency-img" :amount="dialogBonusData.firstBonusData.amount || 100" :currency-type="languageCurrencyType" :show-icon="true" />
              </div>
            </div>
            <div class="empty-div luck-div h-12[px]" :class="[`empty-div-${userLanguage}`]" />
            <div
              v-bg-image="bgImg2"
              class="receive text-[28px] h-[55px] mx-auto  max-w-[210px]  flex cursor-pointer items-center justify-center font-semibold text-[#DE3535]"
              :class="[dialogBonusData.isCrystal && 'crystal-btn']"
              @click="close"
            >
              <span :text="$t('立即领取')">{{ $t('立即领取') }}</span>
            </div>
          </div>
          <div v-else class="no-bonus   mx-auto w-full" :class="[`bonus-state-${dialogBonusData.bonusData.state}`, dialogBonusData.isCrystal ? '!w-[140px]' : dialogBonusData.isBRL ? 'h-[70%] w-[80%] flex flex-col justify-between items-center' : 'h-[60%] mt-[-10%] flex flex-col justify-between items-center']">
            <div class="text-[28px] sorry-top w-full text-center  font-semibold text-[#FF0834]" :class="[userLanguage]">
              <div class="title " :text="$t('抱歉')" :class="[dialogBonusData.isCrystal && '']">
                {{ $t('抱歉') }}
              </div>
              <div class="sorry-text mt-[6px] text-[18px] mx-auto  flex justify-center   text-[#271C08]" :text="sorryTxt" :class="dialogBonusData.isCrystal ? 'w-[140px]' : 'w-[230px]'">
                {{ sorryTxt }}
              </div>
            </div>
            <div class="empty-div sorry-div h-[8px] " :class="[`empty-div-${userLanguage}`]" />
            <div
              class="next-scope text-[20px] mx-auto w-full flex flex-col items-center justify-center  font-semibold text-white"
              :class="{
                isCrystal: dialogBonusData.isCrystal,
                isBRL: dialogBonusData.isBRL,
              }"
            >
              <div class="next-desc  text-center" :text="nextScopeTxt" :class="dialogBonusData.isCrystal ? 'w-[100px]' : 'w-[70%]'">
                {{ nextScopeTxt }}
              </div>
              <div class=" next-time mt-[6px]  font-[600] " :text="dialogBonusData.nextScope?.split('-')[0]">
                {{ dialogBonusData.nextScope?.split('-')[0] }}
              </div>
            </div>
          </div>
        </template>
        <div v-if="!canReceive" class="close  absolute cursor-pointer" :class="[dialogBonusData.isBRL ? 'brl-close  bottom-[-40px]' : 'bottom-0']" @click.stop="closeDom">
          <div class="rounded-full w-[30px] h-[30px] center border-[#fff] border-solid border-[2px]">
            <IconUniClose style="font-size: 18px;color: #fff;" />
          </div>
        </div>
      </section>
    </BaseAspectRatio>
  </AfunBaseDialog>
</template>

<style lang="scss" scoped>
.empty-div {
  display: none;
}
.b-title {
  font-family: Proxima Nova;
}

.wave-vi-VN {
  * {
    font-family: 'proxima-nova';
  }
  .sorry-text {
    word-spacing: -1.5px;
  }
}

.app-dollar-wave-bonus {
  --tg-app-amount-font-size: 26px;
  line-height: 1.4;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  .crystal-warm-title {
    text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.4);
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
  .next-scope {
    margin-bottom: 30px;
    &.isCrystal {
      margin-bottom: 0;
    }
    &.isBRL {
      margin-bottom: -20px;
    }
  }
  &.brl-wave {
    .empty-div {
      display: block;
    }
    background-position: center;
  }
  &.crystal-wave {
    .empty-div {
      display: block;
    }
    background-position: center;
    background-size: var(--pc-max-width);
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
  }

  .receive {
    background-position: center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
</style>
