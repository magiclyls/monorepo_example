<script lang="ts" setup>
import type { CurrencyCode } from '@tg/types'
import { AfunBaseButton, AfunBaseCheckbox, AfunBaseCurrencyIcon, AfunBaseImage } from '@tg/bccomponents'
import { IconUniClose } from '@tg/icons'
import { useAppStore, useLoginReloadDialog } from '@tg/stores'
import { getCurrencyConfig, Local } from '@tg/utils'

import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppCountdown from '~/components/AppCountdown.vue'

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

const loginReloadDialog = useLoginReloadDialog()

const router = useRouter()
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

const currencyType = computed(() => {
  return getCurrencyConfig(props.data?.currency || '701').name
})

function goRecharge() {
  // closeDialog()
  loginReloadDialog.setShowFalse()
  if (props.data && props.data.currency) {
    router.push('/wallet')
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
      <!--   <h2 class="xs:text-[20px] xs:leading-[28px] text-tg-text-white mt-16 px-24 text-[6.66vw] font-semibold leading-[9.06vw]">
        {{ t('successfully_registered') }}
      </h2> -->
      <div v-if="showCountDown" class="h-[var(--tg-app-countdown-item-height)] flex items-center justify-center">
        <AppCountdown :duration="duration" :gradient-border="true" />
      </div>
      <div class="mt-[12px]">
        <AfunBaseImage class="mx-auto h-[211px] w-[274px]" url="/m/afun-h5/png/recharge.png" loading="eager" />
      </div>
      <div v-if="data" class="relative top-[-12px] z-[2] max-w-[269px] px-[12px] py-[4px] text-[14px] font-normal leading-[21px] text-[#0D2245]">
        <div class="bg-tip" />
        <i18n-t v-if="showCountDown" keypath="{0}首充，将有机会获得{1}{2}" tag="div" class="relative center z-[2] text-center">
          <span>{{ data.ty === 2 ? t('{0}小时内', [data.time]) : t('{0}分钟内', [data.time]) }}</span>
          <span>{{ data.amount }}&nbsp;</span><AfunBaseCurrencyIcon class="h-[16px] " :currency-type="currencyType" />
        </i18n-t>
        <i18n-t v-else keypath="首充将有机会获得{0}{1}" tag="div" class="relative center z-[2] text-center">
          <span>{{ data.amount }}&nbsp;</span><AfunBaseCurrencyIcon class="h-[16px]" :currency-type="currencyType" />
        </i18n-t>
      </div>
      <div class="relative top-[-2px] flex flex-col items-center justify-center">
        <AfunBaseButton
          style="--tg-base-button-font-size:20px;--afun-base-button-padding-y:5px;"
          class="charge-btn w-[209px]"
          @click="goRecharge"
        >
          {{ t('立即充值') }}
        </AfunBaseButton>
        <div class="mt-[14px]">
          <AfunBaseCheckbox :model-value="hidePromoFirstRechargeDialog" style="--tg-base-checkbox-size: 12px;" @check="checkChange">
            <div class="color3 text-[12px] font-semibold leading-[16px]">
              {{ t('我知道了，不再提醒') }}
            </div>
          </AfunBaseCheckbox>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.first-recharge-root {
  --tg-app-countdown-bg: #0d1f28;
  --tg-app-countdown-border: #699ab9;
  --tg-app-countdown-border-radius: 8px;
  --tg-app-countdown-item-width: 50px;
  --tg-app-countdown-item-height: 55px;
  --tg-app-countdown-font-weight: 500;
  --tg-app-countdown-font-size: 22px;
}
.close-round {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fff;
  color: #fff;
}
.bg-tip {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  /* 内阴影效果 */
  box-shadow: inset 3px 2px 2px rgba(0, 0, 0, 0.15);
  &::after {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 1;
    border-radius: 4px;
    background: #fff;
    transform: skewY(0deg) skewX(-5deg);
  }
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    z-index: -1;
    background: linear-gradient(to bottom, #dfab71, #4a2d11);
    border-radius: 4px;
    transform: skewY(0deg) skewX(-5deg);
  }
}

.charge-btn {
  color: #4a281a;
  border-radius: 120px;
  background: linear-gradient(270deg, #daa672 0%, #fcdfb7 100%);
  box-shadow:
    0px 2px 0px 0px #572e22,
    1px 1px 0px 0px rgba(255, 247, 232, 0.65) inset;
}

.color3 {
  color: #fff;
}
</style>
