<script setup lang='ts'>
import type { BankCard, VirtualCoin } from '@tg/types'
import { ApiMemberBankcardDelete, ApiMemberWalletDelete } from '@tg/apis'
import { AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseDialog, AfunBaseLabel } from '@tg/bccomponents'
import { IconUniDelete } from '@tg/icons'
import { getCurrencyConfig } from '@tg/utils'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppPasswordInput from '~/components/AppPasswordInput.vue'
import { Message } from '~/utils'
import CopyInputItem from './copy-input-item.vue'

interface Props {
  modelValue: boolean
  item: VirtualCoin | BankCard
  /** 刷新卡包列表 */
  updateWalletList: () => void
  /** 1CNY银行卡 2支付宝 3钱包支付 */
  withdrawType: number
}
defineOptions({
  name: 'AppDeleteConfirmDialog',
})
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()

const passwordRef = ref()
const password = ref('')
const bank_account = ref((props.item as BankCard).bank_account)
const address = ref(props.item.address)
const computedValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const isBankcard = computed(() => 'bank_name' in props.item)
const bankcardItem = computed(() => props.item as BankCard)
const virtualCoinItem = computed(() => props.item as VirtualCoin)
const currencyType = computed(() => getCurrencyConfig(virtualCoinItem.value.currency_id).name)
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
    return t('PIX类型')
  else if (isBankCardType.value)
    return t('银行卡')
  else if (isThreePartyWalletType.value)
    return t('提款钱包')

  return ''
})

function cancel() {
  emit('update:modelValue', false)
}

const { run: runDelete } = useRequest(api.value, {
  async onSuccess() {
    cancel()
    Message.success(t('删除成功'))
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
  <AfunBaseDialog v-model="computedValue" :icon="IconUniDelete" :title="$t('删除确认')">
    <div class="flex flex-col gap-[16px] p-[16px] pb-[28px]">
      <div class="text-center  font-[600] ">
        {{ t('请您确认删除以下提款方式吗？') }}
      </div>
      <template v-if="isBankcard">
        <AfunBaseLabel v-if="!isAlipayType" :label="BankTypeLabel">
          <CopyInputItem :label="bankcardItem.bank_name" />
        </AfunBaseLabel>
        <AfunBaseLabel :label="t('真实姓名')">
          <CopyInputItem :label="bankcardItem.open_name" />
        </AfunBaseLabel>
        <AfunBaseLabel :label="t('提款账号')">
          <CopyInputItem :label="bank_account" />
        </AfunBaseLabel>
      </template>
      <template v-else>
        <AfunBaseLabel :label="t('币种')">
          <CopyInputItem>
            <template #label>
              <AfunBaseCurrencyIcon
                icon-align="left"
                :show-name="true"
                style="--afun-app-currency-icon-size:18px;" :currency-type="currencyType"
              />
            </template>
          </CopyInputItem>
        </AfunBaseLabel>
        <AfunBaseLabel :label="t('协议')">
          <CopyInputItem :label="virtualCoinItem.contract_name" />
        </AfunBaseLabel>
        <AfunBaseLabel :label="t('地址')">
          <CopyInputItem :label="address" />
        </AfunBaseLabel>
      </template>
      <AppPasswordInput ref="passwordRef" v-model="password" />
      <div class="flex items-center justify-between gap-[30px]">
        <AfunBaseButton show-shadow class="btn1 flex-1" @click="cancel">
          {{ t('取消') }}
        </AfunBaseButton>
        <AfunBaseButton class="flex-1" @click="deleteConfirm">
          {{ t('确认删除') }}
        </AfunBaseButton>
      </div>
    </div>
  </AfunBaseDialog>
</template>

<style lang='scss' scoped>
.btn1 {
  --afun-base-button-primary-text-color: #f23038;
  --afun-base-button-border-color: #f23038;
  background: #557086;
}
</style>
