<script setup lang='ts'>
import type { CurrencyCode, EnumCurrencyKey, IAvailableCurrency, ISortedListItem, VirtualCoin } from '@tg/types'
import { ApiFinanceWithdrawBalance, ApiFinanceWithdrawCoin, ApiFinanceWithdrawFeeInfo, ApiFinanceWithdrawMethodList, ApiFinanceWithdrawWallet } from '@tg/apis'
import { AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseFinanceEmpty, AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniArrowDown } from '@tg/icons'
import { useAppStore, useBrandStore, useCurrency } from '@tg/stores'
import { application, getCurrencyConfig, Local, STORAGE_DEPOSIT_COUNT, STORAGE_WALLET_ROUTE } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import AppSelect from '~/components/AppSelect.vue'
import AppSelectCurrency from '~/components/AppSelectCurrency.vue'
import { Message } from '~/utils'
import AccountSelect from './account-select.vue'
import DeleteComfirm from './delete-comfirm.vue'
import DialogPassword from './dialog-password.vue'

type TWithdrawCurrencyList = IAvailableCurrency & ISortedListItem
interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: CurrencyCode
}
interface IVirAddressOption extends VirtualCoin {
  label: string
  value: string
  disabled: boolean
}
interface IVirCardOption extends VirtualCoin {
  label: string
  value: string
  disabled: boolean
}
interface Props {
  virCurrencyList: TWithdrawCurrencyList[]
}
defineOptions({
  name: 'AppVirWithDraw',
})
const props = defineProps<Props>()
const emit = defineEmits(['loaded'])
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const appStore = useAppStore()
const currencyStore = useCurrency()
const { currencyList } = storeToRefs(currencyStore)
const { allContractListData } = storeToRefs(appStore)
const { isKYCVerifyOpen } = storeToRefs(useBrandStore())
const { bool: isDataLoading } = useBoolean(false)
const { bool: showMaxAmount, setBool: setMaxAmount } = useBoolean(false)
/* const { openDeleteConfirm } = useDeleteConfirmDialog()
const { openPromptDialog } = useDialogPrompt() */

const { brandAmount } = storeToRefs(useBrandStore())
/** 最大提款额 */
const {
  data: withdrawBalance,
  runAsync: runWithdrawBalance,
} = useRequest(ApiFinanceWithdrawBalance)
/** KYC弹窗 */
/* const { openKYCDialog } = useDialogKYCVerify() */

const activeVirCurrency = ref()
const currentNetwork = ref()
const amountRef = ref()
const memoRef = ref()
const getMaxAmount = computed(() =>
  application.formatNumDecimal(withdrawBalance.value?.withdraw_balance ?? 0, getCurrencyConfig(activeVirCurrency.value?.currency_name).decimal),
)
const minWithdraw = computed(() => Number(brandAmount.value ? brandAmount.value[`c${activeVirCurrency.value?.currency_id}`].w ?? 0 : 0))
/** 当前是XRP */
const isXRP = computed(() => activeVirCurrency.value?.currency_name === 'XRP')
/** 当前是EOS */
const isEOS = computed(() => activeVirCurrency.value?.currency_name === 'EOS')

const {
  value: address,
  errorMessage: addressMsg,
  validate: valiAddress,
  setValue: setAddress,
} = useField<string>('address', (value) => {
  if (!value)
    return t('请选择地址')
  return ''
})
const {
  value: memo,
  errorMessage: memoMsg,
  validate: valiMemo,
  resetField: resetMemo,
} = useField<string>('memo', (value) => {
  if (!value)
    return t('请输入标签')
  return ''
})
const {
  value: amount,
  errorMessage: amountMsg,
  validate: valiAmount,
  setValue: setAmount,
  resetField: amountReset,
} = useField<string>('amount', (value) => {
  if (!value) {
    return t('请输入金额')
  }
  else if (Number(value) === 0) {
    return `${t('金额不能为')}0`
  }
  else if (Number(value) < minWithdraw.value) {
    return `${t('最小金额为')}${application.formatNumDecimal(minWithdraw.value, getCurrencyConfig(activeVirCurrency.value?.currency_name).decimal)}`
  }
  else if (value && Number(value) > Number(withdrawBalance.value?.withdraw_balance)) {
    setAmount(getMaxAmount.value)
    setMaxAmount(true)
  }
  // return t('金额不能超过最大值')
  return ''
}, { initialValue: '' })

/** 获取取款账号 */
const {
  runAsync: runAsyncWithdrawMethodList,
} = useRequest(ApiFinanceWithdrawMethodList)

/** 获取取款次数 */
const {
  runAsync: runAsyncWithdrawFeeInfo,
} = useRequest(ApiFinanceWithdrawFeeInfo)

/** 获取虚拟钱包列表 */
const {
  data: walletList,
  runAsync: runAsyncWalletList,
} = useRequest(ApiFinanceWithdrawWallet, {
  onSuccess(res) {
    if (res.d && res.d.length > 0) {
      const list = res.d.filter(a => a.state !== 2)
      // 判断列表中是否有默认地址，没有则选中第一个
      const defaultItem = list.find(i => i.is_default === 1)
      if (defaultItem)
        setAddress(defaultItem.id, false)
      else
        setAddress(list[0].id, false)
    }
  },
})
const {
  runAsync: runAsyncWithdrawCoin,
  loading: withdrawLoading,
} = useRequest(ApiFinanceWithdrawCoin, {
  onSuccess(data, params) {
    const type = activeVirCurrency.value?.currency_name
    Message.info(t('提款进行中'))
    /* openNotify({
      icon: `coin-${type.toLocaleLowerCase()}`,
      title: t('提款进行中'),
      message: () => h(AppMemberNotificationsMessage, {
        amount: application.formatNumDecimal(params[0].amount, getCurrencyConfig(type).decimal),
        currencyType: type,
        keypath: 'withdraw_info_going',
      }),
    }) */
    amountReset()
    setMaxAmount(false)
    resetMemo()
    currencyStore.initCurrencyList()
  },
})

/** 虚拟钱包列表 */
const addrOptions = computed(() => {
  if (walletList.value && walletList.value.d) {
    return walletList.value.d.map((i) => {
      return {
        ...i,
        label: i.address,
        value: i.id,
        disabled: i.state === 2,
      }
    })
  }
  return []
})
// 协议列表
const curContractList = computed(() => {
  const currencyType = props.virCurrencyList.find(a => a.currency_id === activeVirCurrency.value?.currency_id)?.currency_name
  return currencyType ? allContractListData.value[currencyType] : []
})

function onVirCurrencyChange(item: TWithdrawCurrencyList) {
  activeVirCurrency.value = item
  const network = allContractListData.value[item?.currency_name]
  currentNetwork.value = network[0]?.value ?? ''
  nextTick(() => {
    amountReset()
    setMaxAmount(false)
    resetMemo()
  })
}

/** 获取当前日期：格式如YYYYMMDD */
function getCurDate() {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}
// 绑定虚拟货币地址
function toAddVirAddress() {
  let isFirst = true
  if (addrOptions.value.length > 0)
    isFirst = false
  Local.push(STORAGE_WALLET_ROUTE, {
    currencyType: 'virtual',
    currencyId: activeVirCurrency.value?.currency_id,
    currencyName: activeVirCurrency.value?.currency_name,
    virCurrencyList: JSON.stringify(props.virCurrencyList),
    contractId: currentNetwork.value,
    isFirst: isFirst ? 1 : 0,
  })
  router.push({
    path: '/wallet/bebank/virtual',
    query: {

    },
  })
}
function onAddressClick(value: string) {
  address.value = value
}
function maxNumber() {
  setMaxAmount(true)
  setAmount(getMaxAmount.value)
}
function formatAmount() {
  setAmount(application.formatNumDecimal(amount.value, getCurrencyConfig(activeVirCurrency.value?.currency_name).decimal))
}
// 编辑
function toEdit(item: IVirCardOption) {
  if (item.disabled)
    return
  Local.push(STORAGE_WALLET_ROUTE, {
    currencyType: 'virtual',
    currencyId: activeVirCurrency.value?.currency_id,
    currencyName: activeVirCurrency.value?.currency_name,
    virCurrencyList: JSON.stringify(props.virCurrencyList),
    contractId: currentNetwork.value,
    isEdit: 1,
    addressId: item.value,
    data: JSON.stringify(item),
    isFirst: (item.is_default === 1) ? 1 : 0,
  })
  router.push({
    path: '/wallet/bebank/virtual',
    query: {

    },
  })
}

const showDeleteDialog = ref(false)
const deleteConfirmOptions = ref()
function toDeleteVirAddress(item: VirtualCoin) {
  deleteConfirmOptions.value = {
    item,
    updateWalletList: () => runAsyncWalletList({ currency_id: activeVirCurrency.value?.currency_id, contract_type: currentNetwork.value }),

  }
  showDeleteDialog.value = true
}

// 资金密码弹窗
const showPswDialog = ref(false)

const pswDialogOptions = ref({
  callBack: (pwdData: {
    auth_type: number
    password: string
  }) => {
    runAsyncWithdrawCoin({
      currency_id: Number(activeVirCurrency.value?.currency_id),
      contract_id: currentNetwork.value,
      amount: amount.value,
      pay_password: pwdData.password,
      wallet_id: address.value,
      auth_type: pwdData.auth_type,
      auth_code: pwdData.password,
      memo: memo.value || undefined,
    })
  },
})

async function handleWithdraw() {
  /** 增加kyc逻辑 */
/*   if (isLogin.value && isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog() */

  amountRef.value?.setTouchTrue()
  await valiAmount()

  if (isXRP.value) {
    memoRef.value?.setTouchTrue()
    await valiMemo()
  }
  await valiAddress()
  if (!amountMsg.value && !addressMsg.value && !memoMsg.value) {
    // 先判断取款次数再调取款接口
    runAsyncWithdrawFeeInfo({ currency_id: activeVirCurrency.value?.currency_id }).then((data): void => {
      if (data.withdraw_setting_count > 0 && data.withdraw_count >= data.withdraw_setting_count && !Local.get(STORAGE_DEPOSIT_COUNT + getCurDate() + data.withdraw_count)?.value) {
        /*  openPromptDialog(data) */
        Local.set(STORAGE_DEPOSIT_COUNT + getCurDate() + data.withdraw_count, data.withdraw_count)
      }
      else {
        // 打开输入资金密码弹窗
        showPswDialog.value = true
      }
    })
  }
}

watch(activeVirCurrency, (a) => {
  if (a) {
    runWithdrawBalance({ currency_id: a.currency_id })
  }
}, { immediate: true })
const refreshid = ref(0)
let resolveLoadingPromise: (value: unknown) => void
const loadingPromise = new Promise((resolve) => {
  resolveLoadingPromise = resolve
})
watch([activeVirCurrency, currentNetwork, refreshid], ([a, c]) => {
  if (a) {
    isDataLoading.value = true
    return Promise.allSettled([
      runAsyncWithdrawMethodList({ currency_id: a?.currency_id, contract_id: c }),
      runAsyncWalletList({ currency_id: a?.currency_id, contract_type: c }),
    ]).finally(() => {
      isDataLoading.value = false
      emit('loaded', true)
      resolveLoadingPromise(true)
    })
  }
}, { immediate: true })
const defaultCurrency = computed(() => {
  const routeCurrency = route.query.currency as CurrencyCode
  return props.virCurrencyList.find(a => a.currency_id === routeCurrency) || props.virCurrencyList[0]
})

watch([defaultCurrency, allContractListData], ([d, a]) => {
  if (a && d) {
    onVirCurrencyChange(d)
  }
}, { immediate: true })
watch(activeVirCurrency, (t) => {
  if (t) {
    router.replace({
      query: {
        ...route.query,
        currency: t.currency_id,
      },
    })
  }
}, { immediate: true })

watch(curContractList, (a) => {
  if (a && a.length > 0)
    currentNetwork.value = a && a.length > 0 ? a[0].value : ''
})
// 余额有变化，打码信息更新
watch(currencyList, () => {
  nextTick(() => {
    runWithdrawBalance({ currency_id: activeVirCurrency.value?.currency_id })
  })
})

if (activeVirCurrency.value) {
  refreshid.value++
}
await application.allSettled([loadingPromise])
</script>

<template>
  <div class="flex flex-col gap-[16px]">
    <!-- 选择货币 -->
    <AfunBaseLabel :label="t('提款货币')" required layout="horizontal" class="vir-withdraw-label">
      <template v-if="virCurrencyList.length > 0">
        <div
          v-if="virCurrencyList.length === 1"
          class="flex items-center justify-between h-[43px] px-[8px] bg-[#0F212E] rounded-[4px]"
        >
          <AfunBaseCurrencyIcon icon-align="left" :show-name="true" style="--afun-app-currency-icon-size:18px;" :currency-type="activeVirCurrency.currency_name" />
        </div>
        <AppSelectCurrency v-else v-slot="slotProps" :t="t" :options="virCurrencyList" :currency="activeVirCurrency?.cur" @choose="onVirCurrencyChange">
          <div
            class="flex items-center justify-between h-[43px] px-[8px] rounded-[4px] bg-[#0F212E]"
          >
            <AfunBaseCurrencyIcon icon-align="left" :show-name="true" style="--afun-app-currency-icon-size:18px;" :currency-type="activeVirCurrency.currency_name" />
            <IconUniArrowDown v-if="virCurrencyList.length > 1" class="ml-[4px] text-[#9dabc9]" />
          </div>
        </AppSelectCurrency>
      </template>
    </AfunBaseLabel>
    <AfunBaseLabel v-if="curContractList.length > 0" :label="t('选择网络')" required layout="horizontal" class="vir-withdraw-label">
      <AppSelect
        v-model="currentNetwork"
        :options="curContractList"
        placement="bottom-end"
        style="--app-select-label-border-color: #0F212E; --app-select-label-border-color-active: #0F212E;"
      />
    </AfunBaseLabel>
    <!-- 表单 -->
    <AppLoading v-if="isDataLoading" />
    <template v-else>
      <template v-if="curContractList && curContractList.length">
        <!-- 有银行卡 -->
        <template v-if="addrOptions.length">
          <AccountSelect
            v-model="address"
            :title="t('提款地址')"
            :msg="addressMsg"
            :list="addrOptions"
            :num="addrOptions.length"
            @change="onAddressClick"
            @edit="toEdit"
            @delete="toDeleteVirAddress"
            @bind="toAddVirAddress"
          />
          <AfunBaseLabel v-if="isXRP" :label="t('标签')" required class="vir-withdraw-label">
            <AfunBaseInput
              ref="memoRef" v-model="memo" :msg="memoMsg" msg-after-touched :placeholder="t('标签')"
            />
          </AfunBaseLabel>
          <AfunBaseLabel v-if="isEOS" :label="t('备忘录')" class="vir-withdraw-label">
            <AfunBaseInput v-model="memo" :placeholder="t('备忘录')" />
          </AfunBaseLabel>
          <AfunBaseLabel :label="t('提款金额')" required class="vir-withdraw-label">
            <AfunBaseInput
              ref="amountRef" v-model="amount" :msg="amountMsg" type="number" msg-after-touched
              input-mode="decimal" :placeholder="t('提款金额')"
              style="--afun-base-input-padding-right:0;--afun-base-input-padding-y:10px;"
              @blur="formatAmount"
            >
              <template #right>
                <div class="flex items-center h-full">
                  <AfunBaseCurrencyIcon :currency-type="activeVirCurrency.currency_name" style="--ph-app-currency-icon-size:18px;" />
                  <div class="ml-[8px] bg-[#2F4553] px-[10px]  h-full center whitespace-nowrap rounded-r-[2px]  font-[600]" @click.stop.prevent="maxNumber">
                    {{ t('最大值') }}
                  </div>
                </div>
              </template>
            </AfunBaseInput>
            <div
              v-show="showMaxAmount && Number(withdrawBalance?.remaining_balance) > 0"
              class="text-[#FF4D4F] flex flex-col  pt-[4px] text-[12px]"
            >
              <div>{{ $t('可提款金额') }} {{ getMaxAmount }}</div>
              <div>
                {{ $t('全部提款还需打码') }} {{ withdrawBalance?.remaining_balance }}
              </div>
            </div>
          </AfunBaseLabel>
          <!-- <AppPasswordInput ref="passwordRef" v-model="payPassword" /> -->
          <AfunBaseButton
            :loading="withdrawLoading" :disabled="withdrawLoading"
            @click="handleWithdraw"
          >
            {{ t('确认提交') }}
          </AfunBaseButton>
        </template>
        <!-- 没有绑定银行卡 -->
        <template v-else>
          <AfunBaseFinanceEmpty :description="$t('该币种您暂无收款信息 请先绑定收款信息')" />
          <AfunBaseButton @click="toAddVirAddress">
            {{ t('绑定') }}{{ t('收款地址') }}
          </AfunBaseButton>
        </template>
      </template>
    </template>
    <DeleteComfirm v-if="showDeleteDialog" v-model="showDeleteDialog" v-bind="{ ...deleteConfirmOptions }" />
    <DialogPassword v-if="showPswDialog" v-model="showPswDialog" v-bind="{ ...pswDialogOptions }" />
  </div>
</template>

<style lang="scss" scoped>
.vir-withdraw-label {
  --afun-base-label-color: #b1bad3;
}
</style>
