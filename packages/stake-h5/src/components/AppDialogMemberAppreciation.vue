<script lang="ts" setup>
import type { CurrencyCode } from '~/composables/useCurrencyData'

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
  name: 'AppDialogMemberAppreciation',
})

const props = defineProps<Props>()

const closeDialog = inject('closeDialog', () => { })
const loginReloadDialog = useLoginReloadDialog()

const { t } = useI18n()
const { userInfo } = storeToRefs(useAppStore())

const { push } = useLocalRouter()
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
  push('/promotions/promotion/member-appreciation')
  // loginReloadDialog.setShowFalse()
  // if (props.data && props.data.currency) {
  //   const { openWalletDialog } = useWalletDialog({ activeTab: 'deposit', initCurrency: getCurrencyConfigByCode(`${props.data?.currency}`).name })
  //   openWalletDialog()
  // }
}

function checkChange(v: boolean) {
  hidePromoFirstRechargeDialog.value = v
  Local.set(`local_hide_first_recharge_${userInfo.value?.uid}`, v)
}
</script>

<template>
  <div class="flex flex-col overflow-hidden bg-light" :class="[showCountDown ? 'min-h-[437px]' : 'min-h-[391px]']">
    <h2 class="xs:text-[20px] xs:leading-[28px] text-tg-text-white mt-[13px] px-[16px] text-[6.66vw] font-semibold leading-[9.06vw]">
      {{ t('member_appreciation_title') }}
    </h2>
    <div class="pt-[13px]">
      <AppImage class="mx-auto" url="/webp/promotions/member-appreciation.webp" loading="eager" />
    </div>
    <div class="describe xs:text-[12px] xs:leading-[18px] my-[12px] px-[16px] text-[3.73vw] font-normal leading-[5.33vw]">
      {{ t('member_appreciation_text') }}
    </div>
    <div class="flex flex-1 flex-col items-center justify-center">
      <button
        style="--tg-base-button-font-size:20px;--tg-spacing-button-padding-vertical-xs:9px;"
        class="button h-[64px] w-[200px]"
        @click="goRecharge"
      >
        <!-- {{ t('vip_right_now') }} -->
      </button>
      <!-- <div class="mt-[10px]" style="--tg-base-checkbox-box-width: 16px;">
        <BaseCheckBox :model-value="hidePromoFirstRechargeDialog" @check="checkChange">
          <div class="color3 text-[12px] font-semibold leading-[16px]">
            {{ t('known_no_tip') }}
          </div>
        </BaseCheckBox>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg-light{
  background-color: var(--tg-primary-main);
  @include webTheme('white') {
    background-color:#f5f5f5;
  }
  @include webTheme('green') {
    background-color: #055434;
  }
}
.bg-deep{
  background-color: var(--tg-secondary-dark);
  @include webTheme('white') {
    background-color:#E8E8E8;
  }
  @include webTheme('green') {
    background-color: #02432D;
  }
}
.charge-btn {
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  @include getBackgroundImage('/promotions/recharge_dialog_btn');
}
.color3{
  color: var(--tg-secondary-light);
  @include webTheme('white') {
    color: #555;
  }
  @include webTheme('green') {
    color: #3CB389;
  }
}
.describe{
  color:#FFFBDA;
  @include webTheme('white') {
   color:#111111;
  }
}
  .button{
    background-size: 100% 100%;
    background-image: url(/webp/promotions/member-appreciation-button.webp);
  }
</style>
