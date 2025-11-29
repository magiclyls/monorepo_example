<script lang="ts" setup>
import type {
  CurrencyData,
  EnumCurrencyKey,
  IMemberBalanceLockerUpdate,
} from '@tg/types'
import { ApiMemberAuthConfig, ApiMemberBalanceLockerUpdate, ApiMemberInterestConfig } from '@tg/apis'
import { PhBaseButton, PhBaseCurrencyIcon, PhBaseInput, PhBaseSelectCurrency, PhBaseTabs } from '@tg/bccomponents'
import { useBoolean, useFrontLang } from '@tg/hooks'
import { IconUniArrowDown1 } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
import { application, currencyMap, getCurrencyConfig } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import { Message } from '~/utils'

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

const {
  data: authConfig,
  runAsync: runMemberAuthConfig,
} = useRequest(ApiMemberAuthConfig, {
  ready: isLogin,
  manual: false,
  throttleInterval: 500,
})

const isSetAuth = computed(() => {
  return authConfig.value?.is_secret === '1'
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
  runMemberAuthConfig()
  if (isLogin.value) {
    currencyStore.initCurrencyList()
    appStore.getLockerData()
    runGetMemberBalance()
  }
})
</script>

<template>
  <div>
    <PhBaseTabs v-model="tab" :type="4" :list="tabOptions" class="mb-[16rem] flex justify-center items-center" bottom-rounded />
    <div class="bg-[#fff] rounded-[8rem] p-[12rem]">
      <PhBaseInput
        v-model="maxAmount"
        name="maxAmount"
        class="mb-[16rem]"
        type="number"
        disabled
        :label="t('当前货币')"
        inputmode="number"
        :placeholder="$t('0.00')"
        style="--ph-base-input-background-color: #F6F7F8;--ph-base-input-border-color: #F6F7F8"
      >
        <template #right>
          <PhBaseSelectCurrency :t="t" :options="tab === 'withdraw' ? renderBalanceLockerList : null" :currency="localCurrencyData?.cur" @choose="changeCurrency">
            <div class="flex items-center justify-center bg-[#EBEBEB] px-[10rem] mr-[-12rem] rounded-r-[6rem] h-[42rem] min-w-[110rem]">
              <PhBaseCurrencyIcon :currency-type="localCurrency as EnumCurrencyKey" show-name style="--ph-app-currency-icon-size: 18rem" />
              <div class="flex items-center ml-[6rem] mr-[5rem]">
                <IconUniArrowDown1 v-if="enabled" class="text-[#9dabc9]" :class="isMenuShown ? 'rotate-[-180deg]' : ''" />
              </div>
            </div>
          </PhBaseSelectCurrency>
        </template>
      </PhBaseInput>
      <PhBaseInput
        ref="amountRef"
        v-model="amount"
        name="amount"
        class="mb-[16rem]"
        type="number"
        msg-after-touched
        :msg="errAmount"
        :label="tab === 'withdraw' ? t('提款金额') : t('存入金额')"
        inputmode="number"
        :placeholder="tab === 'withdraw' ? t('提款金额') : t('存入金额')"
      >
        <template #right>
          <div class="flex items-center justify-center text-center bg-[#EBEBEB] px-[10rem] mr-[-12rem] rounded-r-[6rem] h-[42rem] min-w-[110rem] font-[500]" @click="amount = maxAmount">
            {{ t('最大值') }}
          </div>
        </template>
      </PhBaseInput>
      <PhBaseInput
        v-if="tab === 'withdraw'"
        ref="passwordRef"
        v-model="password"
        name="password"
        class="mb-[16rem]"
        type="password"
        msg-after-touched
        :msg="errPassword"
        :label="t('资金密码')"
        required
        inputmode="number"
        :placeholder="$t('资金密码')"
      >
        <template #right>
          <div class="flex items-center justify-center text-center bg-[#EBEBEB] px-[10rem] mr-[-12rem] rounded-r-[6rem] h-[42rem] min-w-[95rem] font-[500]">
            {{ t('资金密码') }}
          </div>
        </template>
      </PhBaseInput>
      <div v-if="tab === 'deposit'" class="text-[#6D7693] font-[500] text-[12rem] mb-[16rem]">
        <span v-if="billTime">{{ t('利息宝当前利率', { unit: billTime }) }} {{
          vaultFig?.interest_rate ? vaultFig?.interest_rate : 0 }}%</span>
      </div>

      <PhBaseButton type="primary" html-type="submit" :loading="lockerUpdateLoading" class="h-[44rem] mt-[16rem] w-full" style="--ph-base-button-font-size: 14rem; --ph-base-button-font-weight: 500; --ph-base-button-border-color: #EBEBEB;--ph-base-button-secondary-background-color:#fff" @click="handleUpdate">
        {{ tab === 'withdraw' ? t('利息宝取款') : t('存入利息宝') }}
      </PhBaseButton>
    </div>
    <div v-if="!showRules" class="bg-[#fff] rounded-[8rem] py-[16rem] flex flex-col justify-center items-center gap-[10rem] mt-[16rem]">
      <div v-if="!isSetAuth" class="text-[#6D7693] px-[16rem] text-center font-[500]">
        {{ t('启用2FA描述') }}
      </div>
      <PhBaseButton v-if="!isSetAuth" type="primary" html-type="submit" :loading="lockerUpdateLoading" class="h-[40rem]" style="--ph-base-button-font-size: 14rem; --ph-base-button-font-weight: 500; --ph-base-button-border-color: transparent;--ph-base-button-primary-background-color:#025BE8;--ph-base-button-padding-x:16rem" @click="router.push('/double-verify');">
        {{ t('启用2FA') }}
      </PhBaseButton>
      <div class="text-[#6D7693] px-[16rem] text-center font-[500]" @click="showRules = true">
        {{ t('了解更多关于利息宝的信息') }}
      </div>
    </div>
    <div v-else class="border-t border-t-[#EBEBEB] mt-[16rem] pt-[16rem]">
      <div class="text-[28rem] font-[600] text-[#0D2245] text-center w-full">
        {{ t('利息宝规则') }}
      </div>
      <div class="bg-[#F5F6F8] rounded mb-[16rem] overflow-x-scroll">
        <!-- 表头 -->
        <table class="px-4 py-2 text-[#6D7693] text-[14rem] font-[600] text-center leading-[58rem] min-w-full">
          <thead class="whitespace-nowrap">
            <tr>
              <th class="px-[15rem]">
                {{ t('币种') }}
              </th>
              <th class="px-[15rem]">
                {{ t('最低存入金额') }}
              </th>
              <th class="px-[15rem]">
                {{ t('结算周期') }}
              </th>
              <th class="px-[15rem]">
                {{ t('年利率') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="flex items-center justify-center bg-[#fff] rounded-l-[4rem]">
                <PhBaseCurrencyIcon :currency-type="localCurrency as EnumCurrencyKey" show-name />
              </td>
              <td class="bg-[#fff]">
                {{ minDepositAmount || '-' }}
              </td>
              <td class="bg-[#fff]">
                {{ billTime || '-' }}
              </td>
              <td class="bg-[#fff] rounded-r-[4rem]">
                {{ interestRate ? `${application.numberToLocaleString(+interestRate)}%` : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex flex-col gap-[16rem]">
        <div v-for="item in detailTitle" :key="item.title">
          <div class="text-[#0D2245] font-[600] text-[20rem] mb-[7rem]">
            {{ item.title }}
          </div>
          <div class="text-[#6D7693] font-[500] text-[14rem] flex">
            <div class="size-[6rem] rounded-full bg-[#6D7693] mr-[8rem] mt-[7rem] shrink-0" />
            <div>{{ item.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
