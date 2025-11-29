<script lang="ts" setup>
import type {
  CurrencyData,
  EnumCurrencyKey,
  IMemberBalanceLockerUpdate,
} from '@tg/types'
import { ApiMemberBalanceLockerUpdate, ApiMemberInterestConfig } from '@tg/apis'
import { AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseInput, AfunBaseLabel, AfunBaseTabs } from '@tg/bccomponents'
import { useBoolean, useFrontLang } from '@tg/hooks'
import { IconUniArrowDown } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
import { application, currencyMap, getCurrencyConfig } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import { Message } from '~/utils'
import AppSelectCurrency from './AppSelectCurrency.vue'

defineOptions({ name: 'AppInterest' })
const currencyStore = useCurrency()
const { runGetMemberBalance } = useCurrency()
const { currencyList, currentGlobalCurrencyMap, renderBalanceLockerList } = storeToRefs(currencyStore)
const { t } = useI18n()
const { bool: isMenuShown } = useBoolean(false)
const tab = ref('deposit')
const maxAmount = ref('0.00')
const amountRef = ref()
const router = useRouter()
const passwordRef = ref()
const showRules = ref(false)
const tabOptions = [
  { label: t('存款'), value: 'deposit' },
  { label: t('提款'), value: 'withdraw' },
]
const appStore = useAppStore()
const { isLogin } = storeToRefs(appStore)
const { runAsyncFrontLang } = useFrontLang()
const localCurrency = ref<EnumCurrencyKey>()
const localCurrencyData = ref<CurrencyData>()

const { data: interestConfig, runAsync: runAsyncInterestConfig } = useRequest(ApiMemberInterestConfig, {
  debounceInterval: 1000,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
})

// 当前币种配置
const vaultFig = computed(() => {
  return interestConfig.value ? interestConfig.value.rate : { interest_rate: 0, min_deposit: 0, bill_time: 0 }
})
const updateType = computed(() => tab.value === 'deposit' ? 1 : 2)
const currentGlobalCurrency = computed(() => currentGlobalCurrencyMap.value.type)
const renderCurrencyList = computed(() => tab.value === 'deposit' ? currencyList.value : renderBalanceLockerList.value)
const _curGlobalCurrency = computed(() => isLogin.value ? currentGlobalCurrency.value : appStore.getLanguageCurrency())
const currentGlobalCurrencyCode = computed(() => currentGlobalCurrencyMap.value.cur)
const rate = computed(() => interestConfig.value?.rate)
const rule = computed(() => interestConfig.value?.rule)

const billTime = computed(() => {
  if (rate.value && rate.value.bill_time) {
    const _billTime = +(rate.value.bill_time || 0) // 秒
    const hour = Math.floor(_billTime / 60 / 60)
    const day = Math.floor(hour / 24)

    if (hour < 24)
      return t('结算周期小时', { data: hour })

    return t('结算周期天', { data: day })
  }

  return 0
})

const minDepositAmount = computed(() => {
  if (rate.value)
    return rate.value.min_deposit // data.value.find(a => a.currency_name === curType.value)?.min_deposit ?? 0

  return 0
})

const interestRate = computed(() => {
  if (rate.value)
    return rate.value.interest_rate // data.value.find(a => a.currency_name === curType.value)?.interest_rate ?? 0
  return 0
})

const detailTitle = computed(() => {
  if (rule.value) {
    return rule.value.detail.split(/[\r\n]+/).map((item) => {
      const detail = { title: item.split('：')[0].trim(), content: item.split('：')[1] }
      console.log(detail)
      return detail
    })
  }
  return null
})
const enabled = computed(() => {
  const _list = tab.value === 'withdraw' ? renderBalanceLockerList : currencyList
  return _list.value.length > 1
})
const {
  value: amount,
  errorMessage: errAmount,
  resetField: resetAmount,
  validate: validateAmount,
  setValue: setAmount,
} = useField<string>('amount', (value) => {
  if (!isLogin.value)
    return ''
  if (tab.value === 'deposit') {
    if (!value || Number(value) <= 0 || (localCurrencyData.value && Number(value) > Number(localCurrencyData.value?.balance)) || Number(amount.value) < Number(vaultFig.value?.min_deposit ?? 0))
      return t('利息宝存入金额限制', { min: `${Number(vaultFig.value?.min_deposit ?? 0)} ${localCurrency.value}`, max: `${Number(localCurrencyData.value?.balance)} ${localCurrency.value}` })
  }
  else {
    if (!value || Number(value) <= 0 || (localCurrencyData.value && Number(value) > Number(localCurrencyData.value?.balance)))
      return t('利息宝取款金额限制', { min: `${Number(vaultFig.value?.min_deposit ?? 0)} ${localCurrency.value}`, max: `${Number(localCurrencyData.value?.balance)} ${localCurrency.value}` })
  }

  return ''
})
const updateParams = computed<IMemberBalanceLockerUpdate | null>(() => {
  if (localCurrencyData.value) {
    return {
      amount: amount.value,
      flag: updateType.value,
      currency_id: Number(localCurrencyData.value.cur),
      device: 0,
    }
  }
  return null
})

const {
  runAsync: runLockerUpdate,
  loading: lockerUpdateLoading,
} = useRequest(ApiMemberBalanceLockerUpdate, {
  ready: isLogin,
  async onSuccess() {
    Message.success(tab.value === 'deposit' ? t('成功存入利息宝', { amount: amount.value, icon: localCurrency.value }) : t('确认从利息宝提取', { amount: amount.value, icon: localCurrency.value }))
    resetMaxAmount()
    currencyStore.initCurrencyList()
    appStore.getLockerData()
    runGetMemberBalance()
    passwordRef.value?.resetPassword()
  },
})

const {
  value: password,
  errorMessage: errPassword,
  resetField: resetPassword,
  validate: validatePassword,
  setValue: setPassword,
} = useField<string>('password', (value) => {
  if (!isLogin.value)
    return ''
  if (!value)
    return t('请输入资金密码')
  return ''
})

function changeCurrency(item: CurrencyData) {
  const config = getCurrencyConfig(_curGlobalCurrency.value)
  item = item ?? { type: _curGlobalCurrency.value, balance: '0.00', balanceWithSymbol: '0.00', cur: config.cur, prefix: config.prefix } as CurrencyData
  localCurrency.value = item?.type
  localCurrencyData.value = item
  setAmount(application.formatNumDecimal(0, currencyMap[localCurrencyData.value.type].decimal), false)
  runAsyncInterestConfig({ cur: item.cur })
}

function resetMaxAmount() {
  resetAmount()
  resetPassword()
  if (localCurrencyData.value) {
    maxAmount.value = application.formatNumDecimal(localCurrencyData.value.balance, currencyMap[localCurrencyData.value.type].decimal)
    setAmount(application.formatNumDecimal(0, currencyMap[localCurrencyData.value.type].decimal), false)
    runAsyncInterestConfig({ cur: localCurrencyData.value?.cur || '' })
  }
}

async function handleUpdate() {
  if (!isLogin.value) {
    router.push('/login')
    return
  }
  amountRef.value.setTouchTrue()
  if (passwordRef.value)
    passwordRef.value.setTouchTrue()
  await validateAmount()
  if (errAmount.value)
    return
  if (tab.value === 'deposit') {
    runLockerUpdate(updateParams.value!)
  }
  else {
    await validatePassword()
    if (!errAmount.value && !errPassword.value && updateParams.value)
      runLockerUpdate({ ...updateParams.value, password: password.value, auth_type: +passwordRef.value.authType })
  }
}

watch(renderCurrencyList, (val) => {
  if (!renderCurrencyList.value)
    return
  localCurrency.value = currentGlobalCurrency.value
  localCurrencyData.value = renderCurrencyList.value.find((item: CurrencyData) => item.type === localCurrency.value)
  runAsyncInterestConfig({ cur: localCurrencyData.value?.cur || '' })
}, { immediate: true })

watch(localCurrencyData, () => {
  resetMaxAmount()
}, { immediate: true })

watch(tab, () => {
  if (!renderCurrencyList.value)
    return
  amount.value = ''
  localCurrency.value = currentGlobalCurrency.value
  localCurrencyData.value = renderCurrencyList.value.find((item: CurrencyData) => item.type === localCurrency.value)
  runAsyncInterestConfig({ cur: localCurrencyData.value?.cur || '' })
  resetMaxAmount()
})

watch(isLogin, (val) => {
  amountRef.value?.setTouchFalse()
  if (val) {
    // changeCurrency(activeCurrency.value)
    currencyStore.initCurrencyList().then(() => {
      appStore.getLockerData().then(() => {
        runAsyncInterestConfig({ cur: localCurrencyData.value?.cur || '' })
        resetMaxAmount()
      })
    })
    setTimeout(() => {
      resetMaxAmount()
    }, 2000)
  }
})

onMounted(() => {
  runAsyncInterestConfig({ cur: currentGlobalCurrencyCode.value })
  runAsyncFrontLang('vault_des')
  if (isLogin.value) {
    currencyStore.initCurrencyList()
    appStore.getLockerData()
    runGetMemberBalance()
  }
})
</script>

<template>
  <div>
    <AfunBaseTabs v-model="tab" :type="5" :list="tabOptions" class="mb-[16px] flex justify-center items-center" bottom-rounded style="--afun-tabs-wrap-padding-y: 5px;--afun-tabs-item-gap: 5px" />
    <div>
      <AfunBaseLabel :label="t('当前货币')" class="mb-[16px]">
        <AfunBaseInput
          v-model="maxAmount"
          name="maxAmount"
          class="mb-[16px]"
          type="number"
          disabled
          :label="t('当前货币')"
          inputmode="number"
          :placeholder="$t('0.00')"
          style="--afun-base-input-background-color: #F6F7F8;"
        >
          <template #right>
            <AppSelectCurrency :t="t" :options="tab === 'withdraw' ? renderBalanceLockerList : null" :currency="localCurrencyData?.cur" @choose="changeCurrency">
              <div class="flex items-center justify-center bg-[#2F4553] px-[10px] mr-[-12px] rounded-r-[2px] h-[42px] min-w-[110px]">
                <AfunBaseCurrencyIcon :currency-type="localCurrency as EnumCurrencyKey" show-name style="--ph-app-currency-icon-size: 18px" />
                <div class="flex items-center ml-[6px] mr-[5px]">
                  <IconUniArrowDown v-if="enabled" class="text-[#9dabc9]" :class="isMenuShown ? 'rotate-[-180deg]' : ''" />
                </div>
              </div>
            </AppSelectCurrency>
          </template>
        </AfunBaseInput>
      </AfunBaseLabel>
      <AfunBaseLabel :label="t(tab === 'withdraw' ? '金额' : '存入金额')" class="mb-[16px]">
        <AfunBaseInput
          ref="amountRef"
          v-model="amount"
          name="amount"
          class="mb-[16px]"
          type="number"
          msg-after-touched
          :msg="errAmount"
          :label="tab === 'withdraw' ? t('提款金额') : t('存入金额')"
          inputmode="number"
          :placeholder="tab === 'withdraw' ? t('提款金额') : t('存入金额')"
        >
          <template #right>
            <div class="flex items-center justify-center text-center bg-[#2F4553] px-[10px] mr-[-12px] rounded-r-[2px] h-[42px] min-w-[110px] font-[600]" @click="amount = maxAmount">
              {{ t('最大值') }}
            </div>
          </template>
        </AfunBaseInput>
      </AfunBaseLabel>
      <AfunBaseLabel
        v-if="tab === 'withdraw'" :label="t('资金密码')" required
        class="mb-[16px]"
      >
        <AfunBaseInput
          ref="passwordRef"
          v-model="password"
          name="password"
          class="mb-[16px]"
          type="password"
          msg-after-touched
          :msg="errPassword"
          :label="t('资金密码')"
          required
          inputmode="number"
          :placeholder="$t('资金密码')"
        >
          <template #right>
            <div class="flex items-center justify-center text-center bg-[#2F4553] px-[10px] mr-[-12px] rounded-r-[2px] h-[42px] min-w-[95px] font-[600]">
              {{ t('资金密码') }}
            </div>
          </template>
        </AfunBaseInput>
      </AfunBaseLabel>
      <div v-if="tab === 'deposit'" class="text-[#B1BAD3] font-[600] text-[12px] mb-[16px]">
        <span v-if="billTime">{{ t('利息宝当前利率', { unit: billTime }) }} {{
          vaultFig?.interest_rate ? vaultFig?.interest_rate : 0 }}%</span>
        <span v-else>-</span>
      </div>

      <AfunBaseButton type="primary" html-type="submit" :loading="lockerUpdateLoading" class="h-[44px] mt-[16px] w-full" style="--afun-base-button-font-size: 14px; --afun-base-button-font-weight: 500; --afun-base-button-border-color: #2F4553;--afun-base-button-secondary-background-color:#fff" @click="handleUpdate">
        {{ tab === 'withdraw' ? t('利息宝取款') : t('存入利息宝') }}
      </AfunBaseButton>
    </div>
    <div v-if="!showRules" class="bg-[#0f212e] rounded-[8px] py-[16px] flex flex-col justify-center items-center gap-[10px] mt-[16px]">
      <div class="text-[#B1BAD3] px-[16px] text-center font-[600]">
        {{ t('启用2FA描述') }}
      </div>
      <AfunBaseButton type="secondary" html-type="submit" :loading="lockerUpdateLoading" class="h-[40px]" style="--afun-base-button-font-size: 14px; --afun-base-button-font-weight: 500; --afun-base-button-border-color: transparent;--afun-base-button-primary-background-color:#025BE8;--afun-base-button-padding-x:16px;" @click="router.push('/double-verify');">
        {{ t('启用2FA') }}
      </AfunBaseButton>
      <div class="text-[#B1BAD3] px-[16px] text-center font-[600]" @click="showRules = true">
        {{ t('了解更多关于利息宝的信息') }}
      </div>
    </div>
    <div v-else class="border-t border-t-[#304454] mt-[16px] pt-[16px]">
      <div class="text-[28px] font-[600] text-[#fff] text-center w-full">
        {{ t('利息宝规则') }}
      </div>
      <div class=" rounded mb-[16px] overflow-x-scroll">
        <!-- 表头 -->
        <table class="px-4 py-2 text-[#B1BAD3] text-[14px] font-[600] text-center leading-[58px] min-w-full">
          <thead class="whitespace-nowrap">
            <tr>
              <th class="px-[15px]">
                {{ t('币种') }}
              </th>
              <th class="px-[15px]">
                {{ t('最低存入金额') }}
              </th>
              <th class="px-[15px]">
                {{ t('结算周期') }}
              </th>
              <th class="px-[15px]">
                {{ t('年利率') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="flex items-center justify-center bg-[#213743] rounded-l-[4px]">
                <AfunBaseCurrencyIcon :currency-type="localCurrency as EnumCurrencyKey" show-name />
              </td>
              <td class="bg-[#213743]">
                {{ minDepositAmount || '-' }}
              </td>
              <td class="bg-[#213743]">
                {{ billTime || '-' }}
              </td>
              <td class="bg-[#213743] rounded-r-[2px]">
                {{ interestRate ? `${application.numberToLocaleString(+interestRate)}%` : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex flex-col gap-[16px]">
        <div v-for="item in detailTitle" :key="item.title">
          <div class="text-[#fff] font-[600] text-[20px] mb-[7px]">
            {{ item.title }}
          </div>
          <div class="text-[#B1BAD3] font-[600] text-[14px] flex">
            <div class="size-[6px] rounded-full bg-[#B1BAD3] mr-[8px] mt-[7px] shrink-0" />
            <div>{{ item.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
