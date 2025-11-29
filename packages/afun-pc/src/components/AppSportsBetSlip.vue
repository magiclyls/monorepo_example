<script setup lang='ts'>
import type { ICartInfoData } from '~/types'
import { IconUniShareSlip, IconUniClose } from '@tg/icons'
import type {
  EnumsBetSlipBetSlipTabStatus as EnumsBetSlipBetSlipTabStatusType,
} from '~/utils/enums'
import BaseInput from '~/components/BaseInput.vue'

defineOptions({
  name: 'AppSportsBetSlip',
})

const props = withDefaults(defineProps<Props>(), {
  index: 0,
  betSlipType: EnumsBetSlipBetSlipTabStatus.single,
  prohibitedOperation: false,
})
const emit = defineEmits(
  ['update:modelValue', 'update:errorMsg', 'redirect'],
)
interface Props {
  index: number
  /**
   * 下注类型
   *
   * 单项：EnumsBetSlipBetSlipTabStatus.single
   *
   * 组合：EnumsBetSlipBetSlipTabStatus.multi
   */
  betSlipType: EnumsBetSlipBetSlipTabStatusType
  /** 错误 */
  error?: boolean
  /** 禁用 */
  disabled?: boolean
  /** 是否是滚球 */
  live?: boolean
  /** 渲染的List数据 */
  cartInfoData: ICartInfoData
  modelValue?: string | number
  /** 购物车所有注单 */
  cartDataList: ICartInfoData[]
  /** 复式总赔率 */
  duplexOv: string
  /** 复式总投注额 */
  duplexInputValue?: number | string
  /** 复式预计支付额 */
  duplexTotalProfit?: number | string
  /** 禁止操作 */
  prohibitedOperation: boolean
  openKeyboard: (
    fn: (value: number) => void,
    deleteKey: () => void,
  ) => void
  closeKeyboard: () => void
  /**
   * h5 键盘是否显示，input失去焦点去是否验证
   */
  keyboardBool?: boolean
  /** 获取投注信息失败 */
  fetchBetInfoStatus?: boolean
}
const { t } = useI18n()
const appStore = useAppStore()
const { currentGlobalCurrency, isLogin } = storeToRefs(appStore)
const sportStore = useSportsStore()
const { userInfo } = storeToRefs(useAppStore())
const { openBetSlipDialogSports } = useDialogBetSlipSports()
const { isMobile } = storeToRefs(useWindowStore())
const { push } = useLocalRouter()

const inputRef = ref()

const suffixLength = computed(() =>
  currencyConfig[currentGlobalCurrency.value].decimal,
)
const notLoginAmount = ref(application.formatNumDecimal(0, suffixLength.value))
const notLoginAmountPlaceholder = ref(application.formatNumDecimal(0, suffixLength.value))
const isBetSingle = computed(() =>
  props.betSlipType === EnumsBetSlipBetSlipTabStatus.single,
)
const isBetMulti = computed(
  () => props.betSlipType === EnumsBetSlipBetSlipTabStatus.multi,
)

const {
  value: amount,
  errorMessage: amountErrorMsg,
  validate: validateAmount,
} = useField<number>('amount', (value) => {
  if (isBetMulti.value) {
    emit('update:errorMsg', '')
    return ''
  }

  let _msg = ''
  if (value < props.cartInfoData.mia)
    _msg = t('bet_min_tip', { amount: application.formatNumDecimal(props.cartInfoData.mia, suffixLength.value) })

  if (value > props.cartInfoData.maa)
    _msg = t('bet_max_tip', { amount: application.formatNumDecimal(props.cartInfoData.maa, suffixLength.value) })

  inputRef.value?.isTouched && emit('update:errorMsg', _msg)
  return _msg
})

useOutsideClick(inputRef, () => {
  props.closeKeyboard()
  if (props.keyboardBool)
    inputRef.value?.setTouchTrue()
  validateAmount()
})

const isFirst = computed(() => props.index === 0)
const isError = computed(() => {
  if (!isLogin.value)
    return false

  if (props.error)
    return true

  if (props.cartInfoData.result === 'rejected')
    return true

  if (
    sportStore.cart.getExistSameEventIdList.includes(props.cartInfoData.ei)
    && props.betSlipType === EnumsBetSlipBetSlipTabStatus.multi
  )
    return true

  if (
    sportStore.cart.getNotSupportWidList.includes(props.cartInfoData.wid)
    && props.betSlipType === EnumsBetSlipBetSlipTabStatus.multi
  )
    return true

  if (
    sportStore.cart.getOddsLessThanOnePointOneWidList.includes(props.cartInfoData.wid)
    && props.betSlipType === EnumsBetSlipBetSlipTabStatus.multi
  )
    return true

  if (
    sportStore.cart.getExistIcList.includes(props.cartInfoData.ic)
    && props.betSlipType === EnumsBetSlipBetSlipTabStatus.multi
  )
    return true
})
// 需要禁用并隐藏placeholder
const isNeedDisabledAndClearPlaceholder = computed(() => !sportStore.cart.isSupportCurrency || !props.fetchBetInfoStatus)
const isDisabled = computed(() => {
  return props.disabled || props.cartInfoData.os === 0 || isNeedDisabledAndClearPlaceholder.value
})
const isLive = computed(() => {
  if (props.live)
    return true

  if (props.cartInfoData.m === 3)
    return true
})

/** 是否已关闭 */
const isClosed = computed(() => {
  return props.cartInfoData.os === 0
})
// 详情路径
const eventDetailPath = computed(() => {
  const data = props.cartInfoData
  return `/sports/${SPORTS_PLAT_ID}/${data.si}/${data.pgid}/${data.ci}/${data.ei}`
})
const inputReadonlyBool = computed(() => {
  return isMobile.value
})

/**
 * 是否显示输入框的Placeholder
 *
 * cartInfoData.mia maa 都是0的时候不显示
 */
const amountPlaceholderIsShow = computed(() => {
  return props.cartInfoData.mia !== 0 || props.cartInfoData.maa !== 0
})

/**
 * 跳转详情
 */
function goEventDetailPage() {
  // if (isMobile.value)
  //   closeRightSidebar()
  emit('redirect')
  push(replaceSportsPlatId(eventDetailPath.value))
}

/** 弹窗详情 */
function showDetail() {
  let data = {}
  if (props.betSlipType === EnumsBetSlipBetSlipTabStatus.single) {
    const d = props.cartInfoData
    data = {
      a: d.amount,
      ov: d.ov,
      mwa: +d.amount * +d.ov,
      bt: new Date().getTime(),
      ono: '',
      os: 0,
      oc: 0,
      pa: 0,
      st: 0,
      bi: [{
        bt: d.bt,
        btn: d.btn,
        si: d.si,
        ei: d.ei,
        ov: d.ov,
        sn: d.sn,
        re: '',
        hdp: d.hdp,
        htn: d.homeTeamName,
        atn: d.awayTeamName,
        atpic: '',
        htpic: '',
        ed: d.ed,
        hp: d.hp,
        ap: d.ap,
        pgid: d.pgid,
        ci: d.ci,
        et: 1,
        reb: 1,
        wid: d.wid,
        mlid: d.mlid,
        mll: d.mll,
        ic: d.ic,
        m: d.m,
        pid: d.pid,
        sid: d.sid,
      }],
    }
  }
  else if (props.betSlipType === EnumsBetSlipBetSlipTabStatus.multi) {
    data = {
      a: props.duplexInputValue,
      ov: props.duplexOv,
      mwa: props.duplexTotalProfit,
      bt: new Date().getTime(),
      ono: '',
      os: 0,
      oc: 0,
      pa: 0,
      st: 0,
      bi: props.cartDataList.map((d) => {
        return {
          bt: d.bt,
          btn: d.btn,
          si: d.si,
          ei: d.ei,
          ov: d.ov,
          sn: d.sn,
          re: '',
          hdp: d.hdp,
          htn: d.homeTeamName,
          atn: d.awayTeamName,
          atpic: '',
          htpic: '',
          ed: d.ed,
          hp: d.hp,
          ap: d.ap,
          pgid: d.pgid,
          ci: d.ci,
          et: 1,
          reb: 1,
          wid: d.wid,
          mlid: d.mlid,
          mll: d.mll,
          ic: d.ic,
          m: d.m,
          pid: d.pid,
          sid: d.sid,
        }
      }),
    }
  }
  openBetSlipDialogSports({ data: { ...data, username: userInfo.value?.username } })
}

/**
 * 键盘点击事件，只在h5上有效
 */
function inputClickHandler() {
  if (isMobile.value) {
    props.openKeyboard(
      (v: number) => {
        emit('update:modelValue', `${amount.value}${v}`)
      },
      () => emit('update:modelValue', amount.value?.toString().slice(0, -1)),
    )
  }
}

function notLoginInputClickHandler() {
  if (isMobile.value) {
    props.openKeyboard(
      (v: number) => {
        notLoginAmount.value = `${notLoginAmount.value}${v}`
      },
      () => {
        notLoginAmount.value = notLoginAmount.value?.toString().slice(0, -1)
      },
    )
  }
}

function onAmountInputBlur() {
  inputRef.value?.setTouchTrue()
  // PC端输入框失焦时
  if (!props.modelValue)
    emit('update:modelValue', application.formatNumDecimal(0, suffixLength.value))
  else
    emit('update:modelValue', application.formatNumDecimal(props.modelValue, suffixLength.value))
}

watch(() => props.keyboardBool, (a) => {
  // H5端键盘消失时
  if (!a && !props.modelValue && isMobile.value)
    emit('update:modelValue', application.formatNumDecimal(0, suffixLength.value))
})
watch(currentGlobalCurrency, (_currency) => {
  sportStore.cart.updateCurrency(_currency)
})

watchEffect(() => {
  amount.value = props.modelValue as any
})

onMounted(() => {
  if (!isLogin.value) {
    notLoginAmountPlaceholder.value = application.formatNumDecimal(
      0,
      suffixLength.value,
    )
  }
})
</script>

<template>
  <div
    class="app-sports-bet-slip" :class="{
      mt12: !isFirst && isBetSingle && !isMobile,
      mt8: !isFirst && isBetMulti && !isMobile,
      before: !isFirst && isBetMulti,
      error: isError,
      disabled: isDisabled || prohibitedOperation,
    }"
  >
    <div class="header" :class="{ 'round-header': isFirst || isBetSingle }">
      <div class="fixture-name">
        <div v-if="isLive && cartInfoData.result === void 0" class="status live mr-[8px]">
          {{ t('sports_status_live') }}
        </div>
        <component
          v-if="cartInfoData.result"
          :is="cartInfoData.result === 'fulfilled' ? 'sport-success' : 'sport-error'"
          class="mr-[8px]"
        />
        <div class="text" @click="goEventDetailPage">
          {{ cartInfoData.homeTeamName }} - {{ cartInfoData.awayTeamName }}
        </div>
      </div>
      <BaseButton v-if="cartInfoData.result" type="text" size="none" @click="showDetail">
        <IconUniShareSlip />
      </BaseButton>
      <BaseButton
        v-else
        type="text" size="none"
        :disabled="prohibitedOperation"
        @click="sportStore.cart.remove(cartInfoData.wid)"
      >
        <IconUniClose
          />
      </BaseButton>
    </div>
    <div class="content">
      <!-- 盘口类型 -->
      <div class="market-name">
        {{ cartInfoData.btn }}
      </div>
      <!-- 最大下注金额 -->
      <div class="max-bet" />
      <!-- 下注盘口 -->
      <div class="outcome-name">
        <span>{{ cartInfoData.sn }}</span>
      </div>
      <!-- 状态或赔率 -->
      <div v-if="isClosed" class="closed">
        {{ t('closed') }}
      </div>
      <AppSportsOdds
        v-else
        :odds="cartInfoData.ov"
        arrow="left"
        keep
        :show-arrow="cartInfoData.result === void 0"
      />
      <!-- 单式金额输入框 -->
      <div v-show="isBetSingle && cartInfoData.result === void 0" class="footer">
        <div class="bet-amount">
          <BaseInput
            v-if="isLogin"
            ref="inputRef"
            :key="currentGlobalCurrency"
            class="base-input"
            :model-value="modelValue"
            type="number" mb0
            :show-error-msg="false"
            :msg="amountErrorMsg" input-mode="decimal"
            :disabled="isDisabled || prohibitedOperation"
            :msg-after-touched="true"
            @update:model-value="emit('update:modelValue', $event)"
            @blur="onAmountInputBlur"
          >
            <template #right-icon>
              <AppCurrencyIcon :currency-type="currentGlobalCurrency" />
            </template>
          </BaseInput>
          <BaseInput
            v-else
            v-model="notLoginAmount"
            class="base-input"
            type="number" input-mode="decimal"
            mb0
            :placeholder="notLoginAmountPlaceholder"
          >
            <template #right-icon>
              <AppCurrencyIcon :currency-type="currentGlobalCurrency" />
            </template>
          </BaseInput>
        </div>
        <div class="estimated-label">
          <span>{{ t('expect_win') }}</span>
        </div>
        <div
          class="estimated-amount"
          :style="{
            '--tg-app-amount-font-weight': '400',
          }"
        >
          <AppAmount
            :amount="mul(amount ?? 0, Number(cartInfoData.ov))"
            :currency-type="currentGlobalCurrency"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.app-sports-bet-slip {
  position: relative;
  color: var(--tg-text-lightgrey);
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: var(--tg-primary-main);
  border-radius: var(--tg-radius-default);
  font-size: var(--tg-font-size-default);
  font-weight: var(--tg-font-weight-semibold);

  .header {
    position: relative;
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--tg-secondary-main);
    padding: var(--tg-spacing-7) var(--tg-spacing-12);
    line-height: 20px;

    .fixture-name {
      width: 100%;
      max-width: calc(100% - var(--tg-spacing-48));
      display: inline-flex;
      align-items: center;
      // gap: var(--tg-spacing-8);

      .status {
        font-size: var(--tg-font-size-xs);
        display: inline-flex;
        font-weight: 600;
        align-items: center;
        justify-content: center;
        color: var(--tg-text-lightgrey);
        border-radius: 3px;
        padding: 0 var(--tg-spacing-4);
        font-feature-settings: "tnum";
        white-space: nowrap;
        line-height: 1.5;

        &.live {
          background: var(--tg-button-secondary-main);
          color: var(--tg-text-white);
        }
      }

      .text {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        transition: var(--tg-transition);

        &:active:not(:disabled) {
          color: var(--tg-text-white);
          transform: scale(0.96);
        }

        &:hover:not(:disabled) {
          color: var(--tg-text-white);
        }
      }
    }
  }

  .round-header {
    border-radius: var(--tg-radius-default) var(--tg-radius-default) 0 0;
  }

  .content {
    width: 100%;
    flex-shrink: 0;
    display: grid;
    align-items: flex-end;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: auto;
    position: relative;
    padding: var(--tg-spacing-8) var(--tg-spacing-12) var(--tg-spacing-12);
    box-shadow: var(--tg-header-shadow);
    background: var(--tg-secondary-grey);
    --tg-sports-odds-text-align: end;
    grid-template-areas:
      "market market market market maxBet maxBet"
      "outcome outcome outcome outcome outcome odds"
      "footer footer footer footer footer footer"
      "footer footer footer footer footer footer";

    .market-name {
      grid-area: market;
      line-height: 1.5;
      font-weight: var(--tg-font-weight-normal);
    }

    .max-bet {
      grid-area: maxBet;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      font-weight: var(--tg-font-weight-normal);
    }

    .outcome-name {
      font-weight: 600;
      color: var(--tg-text-white);
      display: inline-flex;
      grid-area: outcome;
      text-transform: capitalize;
      align-items: baseline;
      line-height: 1.5;

      span {
        text-align: left;
        display: inline-flex;
        align-items: center;
        word-break: break-all;
      }
    }

    .closed {
      justify-self: flex-end;
      color: var(--tg-text-error);
      white-space: nowrap;
    }

    .footer {
      display: grid;
      grid-area: footer;
      grid-template-columns: repeat(6, 1fr);
      margin-top: var(--tg-spacing-4);
      grid-template-areas:
        "amount amount amount return return return"
        "amount amount amount estimatedAmount estimatedAmount estimatedAmount";

      .bet-amount {
        display: flex;
        grid-area: amount;
      }

      .estimated-label {
        grid-area: return;
        justify-self: flex-end;
        align-self: flex-start;
        font-size: 14px;
        line-height: 1.5;
        font-weight:500;
      }

      .estimated-amount {
        font-weight: var(--tg-font-weight-normal);
        grid-area: estimatedAmount;
        justify-self: flex-end;
        align-self: flex-end;
        line-height: 1;
        font-weight:500;
      }
    }
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    height: 6px;
    width: 100%;
    bottom: -4px;
    background:
    radial-gradient(circle, transparent, transparent 50%,
    var(--tg-secondary-grey) 50%,
    var(--tg-secondary-grey) 100%) 0px 1px/0.7rem 0.7rem repeat-x;
  }
}

.duplicate-bet {
  padding: var(--tg-spacing-13) var(--tg-spacing-16);
  color: var(--tg-text-lightgrey);
  font-weight: var(--tg-font-weight-semibold);
  cursor: not-allowed;
  opacity: 0.5;
}

.mt12 {
  margin-top: var(--tg-spacing-12);
}

.mt8 {
  margin-top: var(--tg-spacing-8);
}

.error {
  .header {
    background: var(--tg-bet-slip-error);
  }
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.before {
  &::before {
    content: "";
    position: absolute;
    left: 0;
    height: 6px;
    width: 100%;
    top: -4px;
    background:
    radial-gradient(circle, transparent, transparent 50%,
    var(--tg-secondary-main) 50%,
    var(--tg-secondary-main) 100%) 0px -6px/0.7rem 0.7rem repeat-x;
  }
}

.base-input {
  @include webTheme('white'){
    --tg-base-input-style-bg:#fff;
  }
  @include webTheme('green'){
    --tg-base-input-style-bg: #02432D;
  }
}
</style>
