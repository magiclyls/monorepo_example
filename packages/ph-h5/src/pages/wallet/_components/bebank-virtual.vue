<script setup lang="ts">
import type { CurrencyCode, EnumCurrencyKey, IAvailableCurrency } from '@tg/types'
import { ApiFinanceDepositWalletInvalidCurrency, ApiMemberWalletInsert, ApiMemberWalletUpdate } from '@tg/apis'
import { PhBaseButton, PhBaseCheckbox, PhBaseCurrencyIcon, PhBaseInput, PhBaseLabel } from '@tg/bccomponents'
import { useAppStore } from '@tg/stores'
import { Local, STORAGE_WALLET_ROUTE, virtualCoinAddressReg } from '@tg/utils'
import { cloneDeep } from 'lodash'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppPasswordInput from '~/components/AppPasswordInput.vue'
import AppSelect from '~/components/AppSelect.vue'
import { Message } from '~/utils'

interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: CurrencyCode
}
interface IAllContractList {
  [k: string]: Array<{
    label: string
    value: string
  }>
}
defineOptions({
  name: 'AppWalletWithDrawVirtBeBankV3',
})
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const appStore = useAppStore()
const { allContractListData } = storeToRefs(appStore)
const routeData = (Local.get(STORAGE_WALLET_ROUTE)?.value as any[])?.[0]
const isDefault = computed(() => Number(routeData?.isFirst) === 1)
const isEdit = computed(() => (Number(routeData?.isEdit) === 1))
const initData = ref((JSON.parse((routeData?.data || '{}') as string)))
const {
  value: address,
  errorMessage: addressMsg,
  validate: valiAddress,
  resetField: resetAddress,
} = useField<string>('address', (value) => {
  if (!value)
    // return t('this_field_is_required')
    return t('请输入钱包地址')
  else if (!virtualCoinAddressReg.test(value))
    return t('请输入正确提币地址')
  return ''
}, { initialValue: isEdit.value ? initData.value.address : '' })
const passwordRef = ref()
const password = ref('')
const currencyId = ref<CurrencyCode>(routeData?.currencyId as CurrencyCode)

const virCurrencyList = ref(JSON.parse((routeData?.virCurrencyList || '[]') as string))
const currentNetwork = ref(routeData?.contractId as string)
const currencySelectRef = ref()
// 会员钱包显示不可绑定的货币
const { data: invalidCurrencyData, runAsync: runGetInvalidCurrency } = useRequest(ApiFinanceDepositWalletInvalidCurrency)
// 经过过滤的协议列表
const contractListFiltered = computed(() => {
  if (invalidCurrencyData.value && invalidCurrencyData.value.length > 0) {
    // 获取所有的协议id
    const contractIdList: Array<string> = []

    for (let i = 0; i < invalidCurrencyData.value.length; i++) {
      for (let ii = 0; ii < invalidCurrencyData.value[i].contract_id.length; ii++)
        contractIdList.push(invalidCurrencyData.value[i].contract_id[ii].id)
    }

    // 提取不包含这些id的协议
    const _allContractList: any = cloneDeep(allContractListData.value)
    const newAllContractList: any = {}
    for (const currencyType in _allContractList) {
      const arr = []
      for (let i = 0; i < _allContractList[currencyType].length; i++) {
        if (!contractIdList.includes(_allContractList[currencyType][i].value))
          arr.push(_allContractList[currencyType][i])
      }
      newAllContractList[currencyType] = arr
    }

    // 过滤没有协议的货币
    for (const key in newAllContractList) {
      if (newAllContractList[key].length === 0)
        delete newAllContractList[key]
    }
    return newAllContractList
  }

  return allContractListData.value
})
// 经过过滤的货币列表
const virCurrencyListFiltered = computed(() => {
  if (invalidCurrencyData.value && invalidCurrencyData.value.length > 0) {
    const keyArr = Object.keys(contractListFiltered.value)
    const arr = []
    for (let i = 0; i < keyArr.length; i++) {
      const item = virCurrencyList.value.find(a => a.currency_name === keyArr[i])
      if (item)
        arr.push(item)
    }
    return arr
  }
  return virCurrencyList.value
})
// 当前选择的货币item
const curCurrencyItem = computed(() => {
  if (!virCurrencyListFiltered.value || virCurrencyListFiltered.value.length === 0)
    return null

  return virCurrencyListFiltered.value.find(a => a.currency_id === currencyId.value)
})
// 协议类型
const curContractList = computed(() => {
  const currencyType = virCurrencyList.value.find(a => a.currency_id === currencyId.value)?.currency_name
  return currencyType ? contractListFiltered.value[currencyType] : []
})

const {
  run: runMemberWalletInsert,
  loading: addWalletInsertLoading,
} = useRequest(ApiMemberWalletInsert, {
  onSuccess() {
    Message.success(t('绑定成功'))
    if (curCurrencyItem.value)
      router.back()
  },
})

const {
  run: runMemberWalletUpdate,
  loading: updateWalletLoading,
} = useRequest(ApiMemberWalletUpdate, {
  onSuccess() {
    Message.success(t('编辑成功'))
    if (curCurrencyItem.value)
      router.back()
  },
})

async function handleBindAddress() {
  await valiAddress()
  passwordRef.value.setTouchTrue()
  await passwordRef.value.validatePassword()
  if (!addressMsg.value && !passwordRef.value.errPassword) {
    if (isEdit.value) {
      runMemberWalletUpdate({
        id: initData.value.id,
        address: address.value,
        is_default: isDefault.value ? 1 : 2,
        pay_password: password.value,
        auth_type: +passwordRef.value.authType,
      })
    }
    else {
      runMemberWalletInsert({
        contract_type: Number(currentNetwork.value),
        currency_id: currencyId.value,
        address: address.value,
        is_default: isDefault.value ? 1 : 2,
        pay_password: password.value,
        auth_type: +passwordRef.value.authType,
      })
    }
  }
}
function onVirCurrencyChange(id: CurrencyCode) {
  currencyId.value = id
  nextTick(() => {
    resetAddress()
    passwordRef.value?.resetPassword()
  })
}

watch(() => curContractList.value, (a) => {
  currentNetwork.value = a && a.length > 0 ? a[0].value : ''
})
watch(() => currentNetwork, (c) => {
  resetAddress()
})
onMounted(() => {
  runGetInvalidCurrency()
})
</script>

<template>
  <AppPageLayout :title="$t('绑定加密货币')">
    <div class="flex flex-col gap-[16rem] bg-[#fff] p-[12rem] rounded-[8rem]">
      <PhBaseLabel :label="t('货币')" required>
        <AppSelect
          ref="currencySelectRef"
          v-model="currencyId"
          :disabled="isEdit"
          :options="virCurrencyListFiltered"
          full
          item-align="left"
          @change="onVirCurrencyChange"
        >
          <template #item-icon="{ item }">
            <PhBaseCurrencyIcon :currency-type="item.label as EnumCurrencyKey" />
          </template>
        </AppSelect>
      </PhBaseLabel>
      <PhBaseLabel
        v-if="curContractList?.length" :label="t('协议')" required
      >
        <AppSelect
          ref="currencySelectRef"
          v-model="currentNetwork"
          :options="curContractList"
          :disabled="isEdit"
          full
          item-align="left"
          :place-holder="t('协议')"
        />
      </PhBaseLabel>

      <PhBaseLabel :label="t('钱包地址')" required>
        <PhBaseInput v-model="address" style="--ph-base-input-padding-y:10rem;" :placeholder="t('钱包地址')" :msg="addressMsg" />
      </PhBaseLabel>
      <AppPasswordInput ref="passwordRef" v-model="password" />
      <div class="flex items-center">
        <PhBaseCheckbox v-model="isDefault" style="--tg-base-checkbox-box-width:16rem;" />
        <span class="ml-[4rem] text-[#6D7693] text-[12rem] font-[400] ">
          {{ $t('是否设为默认地址') }}
        </span>
      </div>
      <div class="text-[#6D7693] text-[12rem] font-[400]">
        {{ $t('请认真核对地址，地址错误资金将无法到账') }}
      </div>
      <PhBaseButton
        :loading="Boolean(addWalletInsertLoading || updateWalletLoading)"
        @click="handleBindAddress"
      >
        {{ t('确认绑定') }}
      </PhBaseButton>
    </div>
  </AppPageLayout>
</template>

<style lang='scss' scoped>
</style>
