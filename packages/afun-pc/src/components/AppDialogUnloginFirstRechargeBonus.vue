<script lang="ts" setup>
import type { CurrencyCode } from '~/composables/useCurrencyData'
import type { RechargeActivity } from '@tg/types'

interface Props {
  data: RechargeActivity
  deposit?: boolean
}
defineOptions({
  name: 'AppDialogUnloginFirstRechargeBonus',
})

const props = defineProps<Props>()
const HIDE_TODAY = 'local_hide_unlogin_first_recharge_today'
const HIDE_FOREVER = 'local_hide_unlogin_first_recharge'
const FORMAT1 = 'YYYY-MM-DD'
const today = dayjs()
const closeDialog = inject('closeDialog', () => { })
const { t } = useI18n()
const { openLoginDialog } = useLoginDialog()
const { isLogin, currentGlobalCurrency, userInfo } = storeToRefs(useAppStore())
const notLoginReloadDialog = useNotLoginReloadDialog()
const { setShowFalse } = useLoginReloadDialog()
const { openWalletDialog } = useWalletDialog({
  activeTab: 'deposit',
})

const tableColumn: Column[] = [
  {
    title: t('deposit_amount'),
    dataIndex: 'deposit',
    align: 'center',
    width: '50%',
    slot: 'amount',
  }, {
    title: t('Bonus'),
    dataIndex: 'min',
    align: 'center',
    slot: 'bonus_rate',
    width: '50%',
  },
]
const hidePromoFirstRechargeDialogDate = ref(Local.get(HIDE_TODAY)?.value === today.format(FORMAT1))
const hidePromoFirstRechargeDialog = ref(Boolean(Local.get(HIDE_FOREVER)?.value) || false)
const currentLang = getCurrentLanguageForBackend()
const currentLangCurrency = computed(() => {
  return currencyConfig[languageConfig[getCurrentLanguageForFrontend()].currency].cur
})
const globalCurrencyCode = computed(() => {
  if (isLogin.value)
    return application.isVirtualCurrency(currentGlobalCurrency.value) ? currencyConfig.USDT.cur : currencyConfig[currentGlobalCurrency.value].cur

  return currentLangCurrency.value
})
const usedCurrencyCode = ref<CurrencyCode>(globalCurrencyCode.value)
const usedCurrency = computed(() => {
  return getCurrencyConfigByCode(usedCurrencyCode.value).name
})
const currentTitle = computed(() => {
  let title = ''
  try {
    title = props.data.promo_info ? JSON.parse(props.data.promo_info.names)[currentLang] : ''
  }
  catch (e) {

  }
  return title
})
const prize_config = computed(() => {
  return props.data.promo_info?.config.tongue?.[globalCurrencyCode.value] || []
})
const sortedPrizeConfig = computed(() => {
  const s = prize_config.value || []
  return s.sort((a, b) => Number(a.deposit) - Number(b.deposit))
})
const max_prize = computed<string>(() => {
  const state = props.data?.state || 0 // 0(待获取资格)，1(待领取)，2(已领取)，3(没有资格)，4（待审核），5（重新提交）6. 可领取，未到时间  10 活动结束
  const bonusType = props.data.promo_info?.config.bonus || 1 // 奖金方式 1(固定金额)  2(随机金额  3(比例金额)
  const lockState = [1, 2, 4, 5, 6]
  if (lockState.includes(state)) {
    const info_str = props.data?.cashback_info
    let info
    if (!info_str)
      return ''

    try {
      info = JSON.parse(info_str)
    }
    catch (e) {

    }
    let res: string = [formatAmountFunc(info.bonus_amount, usedCurrency.value), info.apply_amount, `${toFixed(info.apply_amount, 2)}%`][bonusType - 1]
    if (state === 2)
      // 比例，已领取显示金额
      res = formatAmountFunc(info.bonus_amount, usedCurrency.value)

    return res
  }
  if (!sortedPrizeConfig.value || sortedPrizeConfig.value.length === 0)
    return ''
  const minItem = sortedPrizeConfig.value[0]
  const { max, min, scale, deposit } = sortedPrizeConfig.value[sortedPrizeConfig.value.length - 1]
  return [formatAmountFunc(min, usedCurrency.value), `${formatAmountFunc(minItem.min, usedCurrency.value)}-${formatAmountFunc(max, usedCurrency.value)}`, `${toFixed(scale, 2)}%`][bonusType - 1]
})

function goLogin() {
  // closeDialog()

  if (props.deposit) {
    setShowFalse()
    openWalletDialog()
    return
  }
  if (props.data && usedCurrency) {
    notLoginReloadDialog.setShowFalse()
    openLoginDialog()
  }
}
function checkTodayChange(v: boolean) {
  hidePromoFirstRechargeDialogDate.value = v
  Local.set(HIDE_TODAY, v ? today.format(FORMAT1) : '')
}
function checkChange(v: boolean) {
  hidePromoFirstRechargeDialog.value = v
  Local.set(HIDE_FOREVER, v)
}
</script>

<template>
  <div class="text-tg-text-lightgrey flex flex-col rounded-xl bg-light text-center">
    <h2 class="xs:text-[20px] xs:leading-[28px] text-tg-text-white mt-[16px] px-[30px] text-[6.66vw] font-semibold leading-[9.06vw]">
      <div>
        {{ currentTitle }}
      </div>
    </h2>
    <!-- max-h-[424px] -->
    <div class="scroll-y second-bg data-content mx-[10px] mt-[16px] flex-1 rounded-md p-[10px]">
      <BaseTable class="second-color" style="--tg-table-th-height:50px;" :columns="tableColumn" last-first-padding :data-source="prize_config ?? []">
        <template #amount="{ record }">
          <div class="flex items-center justify-center">
            <AppAmount
              class="theme-amount"
              :amount="record.deposit" :currency-type="currentGlobalCurrency"
              style="--afun-base-amount-font-size: 14px;--afun-app-currency-icon-size: 14px;--afun-app-amount-font-weight:500;"
            />
          </div>
        </template>
        <template #bonus_rate="{ record }">
          <div class="flex items-center justify-center">
            <span class="">{{ [formatAmountFunc(record.min, usedCurrency), `${formatAmountFunc(record.min, usedCurrency)}-${formatAmountFunc(record.max, usedCurrency)}`, `${toFixed(record.scale, 2)}%`][ props.data.promo_info?.config.bonus - 1 ] }}</span>&nbsp;<AppCurrencyIcon
            :currency-type="currentGlobalCurrency"/>
          </div>
        </template>
      </BaseTable>
      <div class="second-bg bottom-mask" />
    </div>

    <div class="flex flex-1 flex-col items-center justify-center px-[22px] py-[16px] bg-[#0F212E]">
      <BaseButton
        style="--tg-base-button-font-size:20px;--tg-spacing-button-padding-vertical-xs:9px;"
        class="w-full" bg-style="primary" size="xs"
        @click="goLogin"
      >
        {{ t('goto') }}
      </BaseButton>
      <div class="mt-[14px] flex center" style="--tg-base-checkbox-box-width: 16px;">
<!--        <BaseCheckBox :model-value="hidePromoFirstRechargeDialogDate" @check="checkTodayChange">-->
<!--          <div class="color3 text-[12px] font-semibold leading-[16px]">-->
<!--            {{ t('no_remind_today') }}-->
<!--          </div>-->
<!--        </BaseCheckBox>-->
        <BaseCheckBox :model-value="hidePromoFirstRechargeDialog" @check="checkChange">
          <div class="color3 text-[12px] font-semibold leading-[16px]">
            {{ t('never_remind') }}
          </div>
        </BaseCheckBox>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg-light{
  background-color: var(--tg-primary-main);
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
  @include webTheme('green') {
    background-color: #055434;
  }
}
 .data-content {
    max-height: 220px;
    position: relative;
    .bottom-mask{
      position: absolute;
      width: 100%;
      height: 10px;
      left: 0;
      bottom: 0;
    }
    --tg-table-even-background: transparent;
    //--tg-table-odd-background:var(--tg-secondary-dark);
    //--tg-table-th-background:var(--tg-secondary-grey);
    @include webTheme('greenblack') {
      --tg-table-even-background:var(--tg-secondary-dark);
      --tg-table-odd-background: #222;
      --tg-table-th-background:var( --tg-secondary-dark);
    }
    @include webTheme('white') {
      --tg-table-odd-background:white;
      --tg-table-even-background: var(--tg-secondary-grey);
      --tg-table-th-background:white;
    }
    @include webTheme('green') {
      --tg-table-odd-background:#02432D;
      --tg-table-even-background: #055434;
      --tg-table-th-background:#055434;;
    }
  }
@media screen and (min-height: 480px) {
  .data-content {
    max-height: 220px;
  }
}
@media screen and (min-height: 580px) {
  .data-content {
    max-height: 320px;
  }
}
@media screen and (min-height: 630px) {
  .data-content {
    max-height: 370px;
  }
}
@media screen and (min-height: 680px) {
  .data-content {
    max-height: 420px;
  }
}
.charge-btn {
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  @include getBackgroundImage('/promotions/recharge_dialog_btn');
}
.second-color{
  color: inherit;
  @include webTheme('green'){
    color: var(--tg-text-green-main);
  }
  @include webTheme('greenblack') {
    color: var(--tg-primary-active);
  }
  @include webTheme('white') {
    --tg-table-odd-background:#E8E8E8;
    --tg-table-even-background:#fff;
  }

}
.second-bg{
  //background: var(--tg-secondary-dark);
  @include webTheme('greenblack') {
    background: #222;
  }
  @include webTheme('white') {
    background: var(--tg-secondary-grey);
  }
  @include webTheme('green'){
    background: #02432D;
  }
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
</style>
