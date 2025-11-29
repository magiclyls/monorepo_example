<script lang="ts" setup>
import type { Column, CurrencyCode, RechargeActivity } from '@tg/types'
import { PhBaseAmount, PhBaseButton, PhBaseCheckbox, PhBaseCurrencyIcon, PhBaseTable } from '@tg/bccomponents'
import { useCurrency, useLoginReloadDialog, useNotLoginReloadDialog } from '@tg/stores'
import { languageConfig } from '@tg/types'
import { formatAmountFunc, getCurrencyConfig, Local, toFixed } from '@tg/utils'
import { getLang, getLangForBackend } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Message } from '~/utils'

interface Props {
  data: RechargeActivity
  deposit?: boolean
}

defineOptions({
  name: 'AppDialogUnloginFirstRechargeBonus',
})

const props = defineProps<Props>()

const router = useRouter()

const HIDE_TODAY = 'local_hide_unlogin_first_recharge_today'
const HIDE_FOREVER = 'local_hide_unlogin_first_recharge'
const FORMAT1 = 'YYYY-MM-DD'
const today = dayjs()
const { t } = useI18n()
const userLanguage = getLang()
const notLoginReloadDialog = useNotLoginReloadDialog()
const { setShowFalse } = useLoginReloadDialog()
const currencyStore = useCurrency()
const { currentGlobalCurrencyMap } = storeToRefs(currencyStore)

// 参考其他 h5 组件的做法，创建 computed 简化币种获取并防止 undefined 错误
const currentGlobalCurrency = computed(() => currentGlobalCurrencyMap.value?.type || 'USDT')
const currentGlobalCurrencyCode = computed(() => currentGlobalCurrencyMap.value?.cur || '706')

const tableColumn: Column[] = [
  {
    title: t('充值金额'),
    dataIndex: 'deposit',
    align: 'center',
    width: '50%',
    slot: 'amount',
  },
  {
    title: t('奖金'),
    dataIndex: 'min',
    align: 'center',
    slot: 'bonus_rate',
    width: '50%',
  },
]
const hidePromoFirstRechargeDialogDate = ref(Local.get(HIDE_TODAY)?.value === today.format(FORMAT1))
const hidePromoFirstRechargeDialog = ref(Boolean(Local.get(HIDE_FOREVER)?.value) || false)
const currentLangCurrency = computed(() => {
  return getCurrencyConfig(languageConfig[userLanguage].currency).cur
})

const usedCurrencyCode = ref<CurrencyCode>(currentLangCurrency.value)
const usedCurrency = computed(() => {
  return getCurrencyConfig(usedCurrencyCode.value).name
})
const currentTitle = computed(() => {
  let title = ''
  try {
    title = props.data.promo_info ? JSON.parse(props.data.promo_info.names)[getLangForBackend()] : ''
  }
  catch (e) {

  }
  return title
})
const prize_config = computed(() => {
  return props.data.promo_info?.config.tongue?.[currentGlobalCurrencyCode.value] || []
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
    router.push('/wallet')
    return
  }
  if (props.data && usedCurrency) {
    notLoginReloadDialog.setShowFalse()
    Message.info(t('请先登录'))
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
  <div class="flex flex-col rounded-xl bg-[#F6F7F8] text-center">
    <h2 class="text-[20rem] text-[#111] mt-[16rem] px-[30rem] font-[500] ">
      <div class="flex center">
        {{ currentTitle }}
        <!--        <PhBaseCurrencyIcon :currency-type="currentGlobalCurrency" style="&#45;&#45;ph-app-currency-icon-size: 20rem" /> -->
      </div>
    </h2>
    <div class="scroll-y  data-content mx-[12rem] mt-[16rem] flex-1 ">
      <PhBaseTable
        style="--tg-table-th-height:48rem;--tg-table-th-color:#6D7693;--tg-table-odd-background:#fff;--tg-table-td-color:#6D7693;--tg-table-th-background:none;--tg-table-td-height:48rem;"
        :columns="tableColumn" last-first-padding :data-source="prize_config ?? []"
      >
        <template #amount="{ record }">
          <div class="flex items-center justify-center">
            <PhBaseAmount
              class="theme-amount"
              :amount="record.deposit" :currency-type="currentGlobalCurrency"
              style="--ph-app-currency-icon-size: 14rem;--afun-app-currency-icon-size: 14rem;--afun-app-amount-font-weight:500;"
            />
          </div>
        </template>
        <template #bonus_rate="{ record }">
          <div class="flex items-center justify-center">
            <span v-if="record.min && usedCurrency" class="">{{
              [formatAmountFunc(record.min, usedCurrency), `${formatAmountFunc(record.min, usedCurrency)}-${formatAmountFunc(record.max, usedCurrency)}`, `${toFixed(record.scale, 2)}%`][props.data.promo_info?.config.bonus - 1]
            }}</span>
            <span v-else-if="record.scale">{{ toFixed(record.scale, 2) }}%</span>
            &nbsp;<PhBaseCurrencyIcon :currency-type="currentGlobalCurrency" />
          </div>
        </template>
      </PhBaseTable>
      <div class=" bottom-mask" />
    </div>
    <div class="flex flex-1 flex-col items-center justify-center  py-[12rem] bg-[#EBEBEB] mt-[16rem]">
      <PhBaseButton
        class="w-[200rem] h-[38rem]"
        @click="goLogin"
      >
        {{ t('前往') }}
      </PhBaseButton>
      <div class="mt-[10rem] center gap-[36rem]">
        <!--        <div class="center"> -->
        <!--          <PhBaseCheckbox -->
        <!--            :model-value="hidePromoFirstRechargeDialogDate" -->
        <!--            style="&#45;&#45;tg-base-checkbox-size:12rem;&#45;&#45;tg-base-checked-border:#D8D8D8;" -->
        <!--            @change="checkTodayChange" -->
        <!--          /> -->
        <!--          <div class="text-[#6D7693] ml-[2rem] text-[12rem] font-[500] leading-[12rem]"> -->
        <!--            {{ t('今日不再提示') }} -->
        <!--          </div> -->
        <!--        </div> -->
        <div class="center">
          <PhBaseCheckbox
            :model-value="hidePromoFirstRechargeDialog"
            style="--tg-base-checkbox-size:12rem;--tg-base-checked-border:#D8D8D8;"
            @change="checkChange"
          />
          <div class="text-[#6D7693] ml-[2rem] text-[12rem] font-[500] leading-[12rem]">
            {{ t('我知道了，不再提醒') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.data-content {
  max-height: 220rem;
  position: relative;

  .bottom-mask {
    position: absolute;
    width: 100%;
    height: 16rem;
    left: 0;
    bottom: 0;
  }

  --tg-table-odd-background: #e8e8e8;
  --tg-table-even-background: var(--tg-secondary-grey);
  --tg-table-th-background: white;
}

.charge-btn {
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  // @include getBackgroundImage('/promotions/recharge_dialog_btn');
}
</style>
