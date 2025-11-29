<script setup lang='ts'>
import type { BankCard, VirtualCoin } from '@tg/types'

import { ApiMemberBankcardDelete, ApiMemberWalletDelete } from '@tg/apis'

interface Props {
  item: VirtualCoin | BankCard
  /** 刷新卡包列表 */
  updateWalletList: () => void
  /** 虚拟币标题  */
  vCurrencyTitle?: string
  /** 1CNY银行卡 2支付宝 3钱包支付 */
  withdrawType: number
}
defineOptions({
  name: 'AppDeleteConfirmDialog',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { openNotify } = useNotify()

const passwordRef = ref()
const password = ref('')
const bank_account = ref(props.item.bank_account)
const address = ref(props.item.address)

const isBankcard = computed(() => 'bank_name' in props.item)
const bankcardItem = computed(() => props.item as BankCard)
const virtualCoinItem = computed(() => props.item as VirtualCoin)
const currencyType = computed(() => getCurrencyConfigByCode(virtualCoinItem.value.currency_id).name)
// 巴西货币使用pix
const isPix = computed(() => bankcardItem.value.currency_id === '702')
const api = computed(() =>
  isBankcard.value ? ApiMemberBankcardDelete : ApiMemberWalletDelete,
)
/** 当前是银行卡 */
const isBankCardType = computed(() => props.withdrawType === 1)
/** 当前是支付宝 */
const isAlipayType = computed(() => props.withdrawType === 2)
/** 当前是钱包支付 */
const isThreePartyWalletType = computed(() => props.withdrawType === 3)
const BankTypeLabel = computed(() => {
  if (isPix.value)
    return t('pix_account_type')
  else if (isBankCardType.value)
    return t('bank_card')
  else if (isThreePartyWalletType.value)
    return t('withdraw_wallet')

  return ''
})

function cancel() {
  closeDialog()
}

const { run: runDelete } = useRequest(api.value, {
  async onSuccess() {
    closeDialog()
    openNotify({
      type: 'success',
      message: t('success_delete'),
    })
    await props.updateWalletList()
  },
})
async function deleteConfirm() {
  passwordRef.value.setTouchTrue()
  await passwordRef.value.validatePassword()
  if (!passwordRef.value.errPassword) {
    runDelete({
      id: props.item.id,
      pay_password: password.value,
      auth_type: Number(passwordRef.value.authType),
    })
  }
}
</script>

<template>
  <div class="flex flex-col gap-[16px] px-[16px] pb-[28px]">
    <div class="text-tg-text-white text-center text-[14px] font-semibold leading-[20px]">
      {{ t('user_confirm_delete_draw_way') }}
    </div>
    <template v-if="isBankcard">
      <BaseLabel v-if="!isAlipayType" :label="BankTypeLabel">
        <BaseInput v-model="bankcardItem.bank_name" readonly />
      </BaseLabel>
      <BaseLabel :label="t('real_name')">
        <BaseInput v-model="bankcardItem.open_name" readonly />
      </BaseLabel>
      <BaseLabel :label="t('withdraw_account1')">
        <BaseInput v-model="bank_account" readonly />
      </BaseLabel>
    </template>
    <template v-else>
      <BaseLabel :label="t('currency_type')">
        <BaseInput v-model="currencyType" readonly />
      </BaseLabel>
      <BaseLabel :label="t('choose_proto_pls')">
        <BaseInput v-model="virtualCoinItem.contract_name" readonly />
      </BaseLabel>
      <BaseLabel :label="t('address')">
        <BaseInput v-model="address" readonly />
      </BaseLabel>
    </template>

    <AppPasswordInput ref="passwordRef" v-model="password" />
    <div class="flex items-center justify-between gap-[30px]">
      <BaseButton class="grow" style="--tg-base-button-font-size:16px;" size="md" @click="cancel">
        {{ t('cancel') }}
      </BaseButton>
      <BaseButton class="grow" style="--tg-base-button-font-size:16px;" size="md" bg-style="primary" @click="deleteConfirm">
        {{ t('confirm_delete') }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
