<script lang="ts" setup>
import type { CurrencyCode } from '~/composables/useCurrencyData'
import { IconUniClose } from '@tg/icons'

interface Props {
  data?: {
    time: number
    amount: string
    currency: CurrencyCode
    /** 1 分钟 2 小时 */
    ty: 1 | 2
    /** 1 表示有时间，0表示不限制时间 */
    flag: 1 | 0

    duration: number // 改为直接传结束时间
  }
}

defineOptions({
  name: 'AppDialogFirstRechargeBonus',
})

const props = withDefaults(defineProps<Props>(), {})

const closeDialog = inject('closeDialog', () => { })
const loginReloadDialog = useLoginReloadDialog()

const { t } = useI18n()
const { userInfo } = storeToRefs(useAppStore())

/* const beginMill = ref(new Date().getTime())

const endTime = computed(() => {
  if (props.data && props.data.time && +props.data.time > 0) {
    if (+props.data.ty === 2)
      return dayjs(+props.data.time * 60 * 60 * 1000 + beginMill.value)
    else
      return dayjs(+props.data.time * 60 * 1000 + beginMill.value)
  }
  return dayjs(beginMill.value)
}) */
const duration = computed(() => {
  return props.data?.duration || 0
})

const showCountDown = computed(() => props.data && props.data.flag && +props.data.flag === 1)
const hidePromoFirstRechargeDialog = ref(Boolean(Local.get(`local_hide_first_recharge_${userInfo.value?.uid}`)?.value) || false)

function goRecharge() {
  // closeDialog()
  loginReloadDialog.setShowFalse()
  if (props.data && props.data.currency) {
    const { openWalletDialog } = useWalletDialog({ activeTab: 'deposit', initCurrency: getCurrencyConfigByCode(`${props.data?.currency}`).name })
    openWalletDialog()
  }
}

function checkChange(v: boolean) {
  hidePromoFirstRechargeDialog.value = v
  Local.set(`local_hide_first_recharge_${userInfo.value?.uid}`, v)
}
</script>

<template>
  <div class="center fixed left-0 top-0 h-[100%] w-[100%]" @click="loginReloadDialog.next">
    <div class="first-recharge-root relative flex flex-col overflow-hidden px-[6px] pt-[20px] text-center" @click.stop.prevent @touchmove.stop.prevent>
      <div
        class="close-round absolute right-[0] top-[0] h-[18px] w-[18px] cursor-pointer rounded-full"
        @click="loginReloadDialog.next"
      >
        <IconUniClose class="text-[12px]" />
      </div>
      <!--   <h2 class="xs:text-[20px] xs:leading-[28px] text-tg-text-white mt-[16px] px-[24px] text-[6.66vw] font-semibold leading-[9.06vw]">
        {{ t('successfully_registered') }}
      </h2> -->
      <div v-if="showCountDown" class="h-[var(--tg-app-countdown-item-height)] flex items-center justify-center">
        <AppCountdown :duration="duration" :gradient-border="true" />
      </div>
      <div class="mt-[12px]">
        <AppImage class="mx-auto h-[211px] w-[274px]" url="/webp/promotions/recharge.webp" loading="eager" />
      </div>
      <div v-if="data" class="relative top-[-12px] z-[2] max-w-[269px] px-[12px] py-[3px] text-[14px] font-normal leading-[20px] text-white">
        <div class="bg-tip" />
        <i18n-t v-if="showCountDown" keypath="recharge_bonus_with_time" tag="div" class="cont text-center">
          <span>{{ data.ty === 2 ? t('in_hours_label', [data.time]) : t('in_minutes_label', [data.time]) }}</span>
          <span>{{ data.amount }}&nbsp;</span><AppCurrencyIcon class="h-[16px] align-middle" style="--tg-app-currency-display:inline-block" :currency-type="getCurrencyConfigByCode(data.currency).name" />
        </i18n-t>
        <i18n-t v-else keypath="first_recharge_bonus_label" tag="div" class="cont text-center">
          <span>{{ data.amount }}&nbsp;</span><AppCurrencyIcon class="h-[16px] align-middle" style="--tg-app-currency-display:inline-block" :currency-type="getCurrencyConfigByCode(data.currency).name" />
        </i18n-t>
      </div>
      <div class="relative top-[-2px] flex flex-col items-center justify-center">
        <BaseButton
          style="--tg-base-button-font-size:20px;--tg-spacing-button-padding-vertical-xs:7px;"
          class="charge-btn w-[209px]" size="xs"
          @click="goRecharge"
        >
          {{ t('fast_go_recharge') }}
        </BaseButton>
        <div class="mt-[10px]" style="--tg-base-checkbox-box-width: 16px;">
          <BaseCheckBox :model-value="hidePromoFirstRechargeDialog" @check="checkChange">
            <div class="color3 text-[12px] font-semibold leading-[16px]">
              {{ t('known_no_tip') }}
            </div>
          </BaseCheckBox>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.first-recharge-root{
  --tg-app-countdown-bg:#0D1F28;
  --tg-app-countdown-border: #699AB9;
  --tg-app-countdown-border-radius:8px;
  --tg-app-countdown-item-width: 50px;
  --tg-app-countdown-item-height: 55px;
  --tg-app-countdown-font-weight: 500;
  --tg-app-countdown-font-size: 22px;
}
.close-round{
  display: flex;
  align-items: center;
  justify-content: center;
  border:1px solid #B1BAD3;
  --tg-icon-color:#B1BAD3;
  @include webTheme('white') {
    border:1px solid #c1c1c1;
    --tg-icon-color:#c1c1c1;
  }
  @include webTheme('green') {
    border:1px solid #5ECEA6;
    --tg-icon-color:#5ECEA6;
  }
}
.bg-tip{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  /* 内阴影效果 */
  box-shadow: inset 3px 2px 2px rgba(0,0,0,0.15);
  &::after {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 1;
    border-radius: 4px;
    background: #0D1F28;
    transform: skewY(0deg) skewX(-5deg);
    @include webTheme('green') {
      background: #02432D;
    }
  }
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    z-index: -1;
    background: linear-gradient(to bottom, #DFAB71, #4A2D11);
    border-radius: 4px;
    transform: skewY(0deg) skewX(-5deg);
  }

}
.cont{
  position: relative;
  z-index: 2;
}
.charge-btn {
  color: #4A281A;
  border-radius: 120px;
  background: linear-gradient(270deg, #DAA672 0%, #FCDFB7 100%);
  box-shadow: 0px 2px 0px 0px #572E22, 1px 1px 0px 0px rgba(255, 247, 232, 0.65) inset;
}
.color3{
  color: #B1BAD3;
  @include webTheme('green') {
    color: white;
  }
}
</style>
