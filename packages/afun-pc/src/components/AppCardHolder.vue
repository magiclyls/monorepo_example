<script setup lang="ts">
import type { BankCard, EnumCurrencyKey, VirtualCoin } from '@tg/types'
import type { CurrencyCode } from '~/composables/useCurrencyData'
import { IconUniBankDelete, IconUniWarningColor } from '@tg/icons'
import { ApiFinanceWithdrawCurrency, ApiWalletBankcardList } from '@tg/apis'

defineOptions({
  name: 'AppCardHolder',
})
const props = defineProps<{ modelValue: EnumCurrencyKey }>()

const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()
const closeDialog = inject('closeDialog', () => { })
const { openDeleteConfirm } = useDeleteConfirmDialog()
const { currentGlobalCurrency } = storeToRefs(useAppStore())
// const { renderCurrencyList } = useCurrencyData()
const languageStore = useLanguageStore()
const { userLanguage } = storeToRefs(languageStore)
const curType = ref(props.modelValue || currentGlobalCurrency.value)
const {
  data: withdrawCurrency,
  runAsync: runAsyncWithdrawCurrency,
} = useRequest(ApiFinanceWithdrawCurrency, {
  onSuccess(data) {
    const bool = data?.find(a => a.currency_name === curType.value)
    if (!bool)
      curType.value = data[0].currency_name
  },
})

const curCode = computed(() => {
  return withdrawCurrency.value?.find(a => a.currency_name === curType.value)?.currency_id ?? '701'
})
const currencyOptions = computed(() => {
  return withdrawCurrency.value?.map((a) => {
    return {
      label: a.currency_name,
      value: a.currency_name,
      currencyType: a.currency_name,
    }
  }) ?? []
})
const isVirtualCurrency = computed(() => application.isVirtualCurrency(curType.value))

// 会员卡包
const { data: bankcardData, runAsync: runAsyncWalletBankcardList } = useRequest(ApiWalletBankcardList)
const bankcardList = computed(() => {
  if (bankcardData.value) {
    const list = isVirtualCurrency.value
      ? (bankcardData.value.coin ? bankcardData.value.coin[curCode.value] : null)
      : (bankcardData.value.bankcard ? bankcardData.value.bankcard[curCode.value] : null)
    return list ?? []
  }

  return []
})

function toAddBankcards() {
  let isFirst = true
  let openName = ''
  if (bankcardList.value.length > 0) {
    isFirst = false
    openName = bankcardList.value[0].open_name
  }
  const { openBindBankDialog } = useDialogBindBank({
    isFirst,
    openName,
    currencyId: curCode.value,
  })
  closeDialog()
  nextTick(() => openBindBankDialog())
}
function toAddPix() {
  let isFirst = true
  let openName = ''
  if (bankcardList.value.length > 0) {
    isFirst = false
    openName = bankcardList.value[0].open_name
  }
  const {
    openAddPixDialog,
  } = useDialogAddPix({
    title: t('bind_pix_account'),
    icon: 'fiat-pix-title',
    openName,
    isFirst,
    currencyId: curCode.value,
  })
  closeDialog()
  nextTick(() => openAddPixDialog())
}

function toAddVirAddress() {
  const {
    openVirAddressDialog,
  } = useVirAddressDialog({
    icon: curType.value,
  })
  const { openWalletDialog } = useWalletDialog({ activeTab: 'cardHolder', initCurrency: curType.value })

  closeDialog()
  nextTick(() => openVirAddressDialog({
    currencyId: curCode.value,
    currencyName: curType.value,
    title: `${t('label_bind')} ${curType.value}`,
    callback: openWalletDialog,
  }))
}
function toDeleteVirAddress(item: VirtualCoin, vCurrencyTitle: string) {
  openDeleteConfirm({
    item,
    updateWalletList: runAsyncWalletBankcardList,
    vCurrencyTitle,
  })
}
function toDeleteBankcard(item: BankCard) {
  openDeleteConfirm({
    item,
    updateWalletList: runAsyncWalletBankcardList,
  })
}
function bind() {
  if (isVirtualCurrency.value)
    toAddVirAddress()

  else if (curCode.value === '702')
    toAddPix()

  else
    toAddBankcards()
}
function deleteCard(item: any) {
  if (isVirtualCurrency.value)
    toDeleteVirAddress(item, curType.value)
  else
    toDeleteBankcard(item)
}
function getCurrencyIdToIconName(currencyId: CurrencyCode) {
  console.error(currencyId)
  const isVirtualCurrency = application.isVirtualCurrency(getCurrencyConfigByCode(currencyId).name)
  if (isVirtualCurrency)
    return `coin-${getCurrencyConfigByCode(currencyId).name.toLocaleLowerCase()}`

  if (currencyId === '702')
    return 'fiat-pix'

  return 'uni-unionpay'
}
function handleSelect(t: EnumCurrencyKey) {
  emit('update:modelValue', t)
}
function get_vietnamese_and_delete() {

}

onMounted(() => {
  nextTick(() => {
    get_vietnamese_and_delete()
  })
})

await application.allSettled([runAsyncWithdrawCurrency(), runAsyncWalletBankcardList()])
</script>

<template>
  <div>
    <div class="flex flex-col items-center">
      <BaseSelect
        v-model="curType" :options="currencyOptions" popper popper-search
        :popper-search-placeholder="t('search')" popper-max-height="22em"
        @select="handleSelect"
      >
        <template #label="{ data }">
          <AppCurrencyIcon show-name :currency-type="data?.value" />
        </template>
        <template #option="{ data: { item } }">
          <AppCurrencyIcon show-name :currency-type="item.value" />
        </template>
      </BaseSelect>
    </div>
    <!-- 当前币种绑定为0 -->
    <div
      v-show="bankcardList.length === 0"
      class="bg-tg-secondary-dark border-tg-text-white mb-[14px] mt-[17px] flex border-collapse items-center justify-center border-[2px] rounded-[4px] border-dashed py-[25px]"
    >
      <ul class="flex gap-[6px] px-[12px] font-medium leading-[1.5]">
        <div class="mt-[2px]">
          <IconUniWarningColor />
        </div>
        <div>
          <li>{{ t('add_withdraw_info') }}</li>
          <li>1.&nbsp;{{ t('three_withdraw_info_only') }}</li>
          <li>2.&nbsp;{{ t('want_more_del_first') }}</li>
        </div>
      </ul>
    </div>

    <!-- 列表 -->
    <div class="mb-[14px] mt-[17px] flex flex-col gap-[14px]">
      <!-- item -->
      <div
        v-for="item in bankcardList" :key="item.id" class="shadow-text-shadow relative flex overflow-hidden rounded-[4px]"
      >
        <div
          class="bg-tg-secondary-grey max-w-[60px] flex items-center justify-center p-[23px]"
          :class="item.state === 2 ? 'opacity-[0.5]' : ''"
        >
          <component :is="getCurrencyIdToIconName(item.currency_id as CurrencyCode)"
            class="text-[20px]"
          />
        </div>
        <div
          class="bg-tg-secondary flex grow items-center px-[14px]"
        >
          <div class="text-tg-text-white flex flex-col gap-[6px]" :class="item.state === 2 ? 'opacity-[0.5]' : ''">
            <span class="font-semibold">{{ (item.bank_name) || (item.contract_name) }}</span>
            <span class="font-bold">{{ item.bank_account || item.address }}</span>
          </div>
        </div>
        <div
          class="absolute right-[14px] top-[50%] translate-y-[-50%]"
          @click="deleteCard(item)"
        >
          <BaseButton size="none" type="text">
            <IconUniBankDelete class="text-[18px]" />

          </BaseButton>
        </div>
      </div>
    </div>
    <div v-show="bankcardList.length < 3" class="flex flex-col">
      <BaseButton v-if="userLanguage === 'vi-VN' || userLanguage === 'hi-IN'" size="lg" bg-style="primary" @click="bind">
        {{ `${t('pop_up_card_wallet_currency_withdraw_label_bind')}` }}
      </BaseButton>
      <BaseButton v-else size="lg" bg-style="primary" @click="bind">
        {{ `${t('pop_up_card_wallet_currency_withdraw_label_bind')}${isVirtualCurrency ? t('pop_up_card_wallet_currency_withdraw_address') : t('pop_up_card_wallet_currency_withdraw_account')}` }}
      </BaseButton>
    </div>

    <!-- 当千币种绑定>0 -->
    <div v-show="bankcardList.length > 0" class="mt-[14px] font-medium leading-[1.5]">
      {{ t('bind_more_bank_tip') }}
    </div>
  </div>
</template>

<style scoped lang="scss">
  .bg-tg-secondary-dark {
  padding-left: 25px;
  padding-right: 25px;
}
</style>
