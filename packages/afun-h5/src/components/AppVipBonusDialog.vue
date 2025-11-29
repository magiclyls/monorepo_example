<script lang="ts" setup>
import type { CurrencyCode } from '@tg/types'
import { ApiMemberVipBonusApply, ApiMemberVipBonusApplyAll, ApiMemberVipBonusAvailable } from '@tg/apis'
import { AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseInput, AfunBaseLabel, AfunBaseSelect } from '@tg/bccomponents'
import { useVipStore } from '@tg/stores'
import { add, application, currencyMap, getCurrencyConfig, sub } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { Message } from '~/utils'

interface Props {
  /** 奖金id，-1表示晋级奖金，无值表示累计奖金 */
  vipBonusId?: string
  /** 奖金类型 */
  bonusType?: string
  /** 币种 */
  currencyId?: CurrencyCode
}
defineOptions({
  name: 'AppVipBonusDialog',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })
const { t } = useI18n()
const amountMax = ref(application.formatNumDecimal(0, currencyMap.USDT.decimal))
const {
  isVipDayBonusOpen,
  isVipWeekBonusOpen,
  isVipMonthBonusOpen,
} = storeToRefs(useVipStore())
const {
  value: amount,
  setValue: setAmount,
  resetField: resetAmount,
  errorMessage: amountMsg,
  validate: valiAmount,
  //   resetField: amountReset,
} = useField<string>('amount', (value) => {
  if (!value)
    return t('请输入金额')
  else if (Number(value) === 0)
    return t('金额不能为0')
  else if (Number(value) < 0)
    return t('金额不能为负数')
  else if (value && Number(value) > Number(amountMax.value))
    return t('金额不能超过最大值')
  return ''
})

const amountRef = ref()
const activeCurrency = ref(getCurrencyConfig(props.currencyId ?? '706'))

const {
  runAsync: runAsyncVipBonusApply,
  loading: loadVipBonusApply,
} = useRequest(ApiMemberVipBonusApply)

const { run: runVipBonusApplyAll, loading: loadApplyAll } = useRequest(ApiMemberVipBonusApplyAll, {
  onSuccess(data) {
    closeDialog()
  },
})
const typeVal = ref('vip')
const options = ref([
  { label: t('全部'), value: 'vip' },
  isVipDayBonusOpen.value ? { label: t('日奖金'), value: '819' } : undefined,
  isVipWeekBonusOpen.value ? { label: t('周奖金'), value: '820' } : undefined,
  isVipMonthBonusOpen.value ? { label: t('月奖金'), value: '821' } : undefined,
].filter(a => a !== void 0))

const { runAsync: runAsyncGetPromoBonus, data: lvPromoBonus, loading: loadLvPromoBonus }
  = useRequest(ApiMemberVipBonusAvailable, {
    onSuccess(data) {
      if (props.vipBonusId) { // 处理晋级奖金
        options.value = data?.map((item) => {
          return {
            label: `VIP${item.vip}`,
            value: item.id,
            // ...item,
          }
        }) ?? []
        options.value.unshift({ label: t('晋级奖金'), value: '-1' })
        if (props.vipBonusId) // 第一次打开是全部，需要从新计算金额
          selectTypeChange('-1')
      }
      else { // 处理累积奖金
        const item = (data && data?.length) ? data[0] : null
        if (!item || item.state === 2) {
          amountMax.value = application.formatNumDecimal(0, currencyMap.USDT.decimal)
          setAmount(amountMax.value, false)
        }
        else {
          let amount = 0
          if (typeVal.value === 'vip') { //  累积奖金全部领取
            amount = Number(data)
          }
          else {
            amount = Number(sub(Number(item.amount), Number(item.receive_amount)))
          }
          amountMax.value = application.formatNumDecimal(amount, currencyMap.USDT.decimal)
          setAmount(amountMax.value)
        }
      }
    },
  })

// 奖金类型切换
function selectTypeChange(val: string) {
  typeVal.value = val
  if (props.vipBonusId) { // 晋级奖金
    let amount = 0
    if (val !== '-1') {
      const item = lvPromoBonus.value?.find(t => t.id === val)
      amount = Number(sub(Number(item?.amount), Number(item?.receive_amount)))
    }
    else { // 全部领取
      amount = lvPromoBonus.value?.reduce((total, item) => Number(add(total, Number(sub(Number(item.amount), Number(item.receive_amount))))), 0) ?? 0
    }
    amountMax.value = application.formatNumDecimal(amount, currencyMap.USDT.decimal)
    resetAmount()
    setAmount(amountMax.value, false)
  }
  else { // 日周月奖金
    runAsyncGetPromoBonus(typeVal.value === 'vip'
      ? ({
          flag: 'vip',
          cur: activeCurrency.value.cur,
        })
      : ({
          cash_type: typeVal.value,
          cur: activeCurrency.value.cur,
        }))
  }
}

async function submitBonus() {
  if (amountRef.value)
    amountRef.value.setTouchTrue()
  await valiAmount()
  if (!amountMsg.value) {
    if (typeVal.value !== '-1') {
      if (typeVal.value === 'vip') { // 累积奖金全部领取
        runVipBonusApplyAll({ cur: activeCurrency.value?.cur ?? '', flag: '' })
      }
      else {
        runAsyncVipBonusApply({
          id: props.vipBonusId ? typeVal.value : ((lvPromoBonus.value && lvPromoBonus.value[0].id) ?? ''),
          cur: activeCurrency.value?.cur ?? '',
          amount: amount.value,
        }).then((data) => {
          closeDialog()
        })
      }
    }
    else { // 晋级奖金全部领取
      runVipBonusApplyAll({ cur: activeCurrency.value?.cur ?? '', flag: 'upgrade' })
    }
  }
  else {
    // 金额为0提示
    Message.info(t('您当前无奖金可领取'))
  }
}
function amountBlur() {
  if (Number(amount.value) > Number(amountMax.value))
    setAmount(amountMax.value)
}

await application.allSettled(
  [
    runAsyncGetPromoBonus(props.vipBonusId === '-1'
      ? ({ cash_type: props.bonusType ?? typeVal.value, cur: activeCurrency.value.cur })
      : ({ flag: 'vip', cur: activeCurrency.value.cur })),
  ],
)
</script>

<template>
  <div class="px-[16px] pt-[16px] pb-[32px]">
    <AfunBaseLabel :label="$t('活动奖金')" class="mb-[16px]" :style="{ '--tg-base-input-right-button-padding': vipBonusId ? '' : '0 0', '--afun-base-label-color': '#6D7693' }">
      <AfunBaseInput
        ref="amountRef" v-model="amount" class="theme-input" type="number" disabled msg-after-touched
        style="--afun-base-input-padding-right:0;--afun-base-input-padding-y:9px;" @blur="amountBlur"
      >
        <template #right>
          <div
            v-if="vipBonusId"
            class="min-w-[110px] pr-[7px] pl-[17px] flex items-center justify-center bg-[#2F4553] h-full whitespace-nowrap"
          >
            <AfunBaseCurrencyIcon :currency-type="activeCurrency.name" />
            <span class="ml-[3px] font-[600] text-[#fff]">{{ $t('晋级奖金') }}</span>
          </div>
          <AfunBaseSelect v-else v-model="typeVal" :auto-size="false" active-color="#F23038" :options="options" class="h-full" @change="selectTypeChange">
            <template #label="{ data }">
              <div class="min-w-[110px] rounded-tr-[4px] rounded-br-[4px]  pr-[31px] pl-[11px] flex items-center justify-center bg-[#2F4553] h-full whitespace-nowrap">
                <AfunBaseCurrencyIcon :currency-type="activeCurrency.name" />
                <span class="ml-[6px] font-[600] text-[#fff]">{{ data?.label }}</span>
              </div>
            </template>
            <template #item="{ item }">
              <div class="w-full center whitespace-nowrap">
                <AfunBaseCurrencyIcon :currency-type="activeCurrency.name" />
                <span class="ml-[6px] font-[600] ">{{ item.label }}</span>
              </div>
            </template>
          </AfunBaseSelect>
        </template>
      </AfunBaseInput>
    </AfunBaseLabel>
    <AfunBaseButton
      class="w-full" :loading="loadVipBonusApply || loadLvPromoBonus || loadApplyAll"
      style="--afun-base-button-padding-y:10px;"
      @click="submitBonus"
    >
      {{ $t('领取') }}
    </AfunBaseButton>
  </div>
</template>

<style lang="scss" scoped></style>
