<script lang="ts" setup>
import type { CurrencyCode } from '@tg/types'
import { PhBaseButton, PhBaseCheckbox, PhBaseCurrencyIcon, PhBaseImage } from '@tg/bccomponents'
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
    <div class="first-recharge-root relative flex flex-col overflow-hidden px-[6rem] pt-[20rem] text-center" @click.stop.prevent @touchmove.stop.prevent>
      <div
        class="close-round absolute right-[0] top-[0] h-[18rem] w-[18rem] cursor-pointer rounded-full"
        @click="loginReloadDialog.next"
      >
        <IconUniClose class="text-[12rem]" />
      </div>
      <!--   <h2 class="xs:text-[20rem] xs:leading-[28rem] text-tg-text-white mt-16 px-24 text-[6.66vw] font-semibold leading-[9.06vw]">
        {{ t('successfully_registered') }}
      </h2> -->
      <div v-if="showCountDown" class="h-[var(--tg-app-countdown-item-height)] flex items-center justify-center">
        <AppCountdown :duration="duration" :gradient-border="true" />
      </div>
      <div class="mt-[12rem]">
        <PhBaseImage class="mx-auto h-[211rem] w-[274rem]" url="/ph-h5/png/recharge.png" loading="eager" />
      </div>
      <div v-if="data" class="relative top-[-12rem] z-[2] max-w-[269rem] px-[12rem] py-[4rem] text-[14rem] font-normal leading-[21rem] text-[#0D2245]">
        <div class="bg-tip" />
        <i18n-t v-if="showCountDown" keypath="{0}首充，将有机会获得{1}{2}" tag="div" class="relative center z-[2] text-center">
          <span>{{ data.ty === 2 ? t('{0}小时内', [data.time]) : t('{0}分钟内', [data.time]) }}</span>
          <span>{{ data.amount }}&nbsp;</span><PhBaseCurrencyIcon class="h-[16rem] " :currency-type="currencyType" />
        </i18n-t>
        <i18n-t v-else keypath="首充将有机会获得{0}{1}" tag="div" class="relative center z-[2] text-center">
          <span>{{ data.amount }}&nbsp;</span><PhBaseCurrencyIcon class="h-[16rem]" :currency-type="currencyType" />
        </i18n-t>
      </div>
      <div class="relative top-[-2rem] flex flex-col items-center justify-center">
        <PhBaseButton
          style="--tg-base-button-font-size:20rem;--ph-base-button-padding-y:5rem;"
          class="charge-btn w-[209rem]"
          @click="goRecharge"
        >
          {{ t('立即充值') }}
        </PhBaseButton>
        <div class="mt-[14rem]">
          <PhBaseCheckbox :model-value="hidePromoFirstRechargeDialog" style="--tg-base-checkbox-size: 12rem;" @check="checkChange">
            <div class="color3 text-[12rem] font-semibold leading-[16rem]">
              {{ t('我知道了，不再提醒') }}
            </div>
          </PhBaseCheckbox>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.first-recharge-root {
  --tg-app-countdown-bg: #0d1f28;
  --tg-app-countdown-border: #699ab9;
  --tg-app-countdown-border-radius: 8rem;
  --tg-app-countdown-item-width: 50rem;
  --tg-app-countdown-item-height: 55rem;
  --tg-app-countdown-font-weight: 500;
  --tg-app-countdown-font-size: 22rem;
}
.close-round {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1rem solid #fff;
  color: #fff;
}
.bg-tip {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  /* 内阴影效果 */
  box-shadow: inset 3rem 2rem 2rem rgba(0, 0, 0, 0.15);
  &::after {
    content: '';
    position: absolute;
    top: 0rem;
    left: 0rem;
    right: 0rem;
    bottom: 0rem;
    z-index: 1;
    border-radius: 4rem;
    background: #fff;
    transform: skewY(0deg) skewX(-5deg);
  }
  &::before {
    content: '';
    position: absolute;
    top: -1rem;
    left: -1rem;
    right: -1rem;
    bottom: -1rem;
    z-index: -1;
    background: linear-gradient(to bottom, #dfab71, #4a2d11);
    border-radius: 4rem;
    transform: skewY(0deg) skewX(-5deg);
  }
}

.charge-btn {
  color: #4a281a;
  border-radius: 120rem;
  background: linear-gradient(270deg, #daa672 0%, #fcdfb7 100%);
  box-shadow:
    0rem 2rem 0rem 0rem #572e22,
    1rem 1rem 0rem 0rem rgba(255, 247, 232, 0.65) inset;
}

.color3 {
  color: #fff;
}
</style>
