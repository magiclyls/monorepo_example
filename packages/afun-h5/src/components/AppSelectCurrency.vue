<script setup lang='ts'>
import { AfunBaseAmount, AfunBaseCurrencyIcon, AfunBaseDialog, AfunBaseInput, BaseSwitch } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniWalletSetting } from '@tg/icons'
import { useCurrency } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<Props>(), {
  showSetting: false,
  width: 190,
  mode: '1',
  placement: 'bottom',
  strategy: 'absolute',
})

const emit = defineEmits(['choose'])

interface Props {
  showSetting?: boolean
  width?: number
  mode?: '1' | '2' // 1 默认, 2 首页钱包 --特殊间距
  options?: any
  placement?: string
  height?: number
  strategy?: 'absolute' | 'fixed'
}

const currencyStore = useCurrency()
const { currencyList, isHideZeroBalance } = storeToRefs(currencyStore)
const { bool: isMenuShown } = useBoolean(false)
const { bool: showWalletSetting } = useBoolean(false)
const { t } = useI18n()

const searchRef = ref()
const searchValue = ref('')

const _allCurrency = computed(() => {
  const _list = isHideZeroBalance.value ? currencyList.value.filter(a => Number(a.balance) !== 0) : currencyList.value

  return _list
})
const list = computed(() => {
  const _data = props.options
    ? props.options.map((item: any) => {
        return item.type
          ? item
          : {
              ...item,
              type: item.currency_name || item.value,
            }
      })
    : _allCurrency.value
  return _data.filter((a: any) => a.type.toLocaleLowerCase().includes(searchValue.value.toLocaleLowerCase()))
})

function clearSearchValue() {
  searchValue.value = ''
}
function popperApplyShow() {
  clearSearchValue()
}
function handleHide() {
  searchRef.value?.manualBlur()
  clearSearchValue()
}

function openWalletSetting() {
  isMenuShown.value = false
  nextTick(() => {
    showWalletSetting.value = true
  })
}
</script>

<template>
  <div class="d">
    <VDropdown
      v-model:shown="isMenuShown"
      :distance="10"
      :placement="placement"
      :strategy="strategy"
      @apply-show="popperApplyShow"
      @hide="handleHide"
    >
      <slot :is-menu-shown="isMenuShown" />
      <template #popper="{ hide }">
        <div
          class="currency-list max-h-[81vh]" :style="{
            width: `${width}px`,
            height: `${height}px`,
          }"
          :class="[`mode${mode}`]"
        >
          <AfunBaseInput
            v-model="searchValue"
            class="mb-[16px] w-full search-ipt" :placeholder="t('搜索货币')" :name="`search-${+new Date()}`" search
          />
          <div
            v-for="item, i in list" :key="item.cur" class="currency-item"
            :class="i !== list.length - 1 ? 'mb-[10px]' : ''"
            @click="emit('choose', item);hide()"
          >
            <div class="min-w-[60px]">
              <AfunBaseCurrencyIcon :currency-type="item.type" show-name />
            </div>
            <AfunBaseAmount :amount="item.balance" :currency-type="item.type" :show-icon="false" />
          </div>
          <div v-if="showSetting" class="wallet-setting" @click="openWalletSetting">
            <IconUniWalletSetting class="mr-[8px]" :style="{ color: '#0D2245' }" />
            {{ t('钱包设置') }}
          </div>
          <div v-else class="h-[20px]" />
        </div>
      </template>
    </VDropdown>

    <AfunBaseDialog
      v-if="showWalletSetting" v-model="showWalletSetting" icon="uni-wallet-setting" :title="t('钱包设置')"
      style="--afun-base-dialog-icon-color:#0D2245;"
    >
      <div class="w-full px-[16px] pt-[12px] pb-[16px] flex items-center">
        <BaseSwitch v-model="isHideZeroBalance" />
        <div class="ml-[8px] flex flex-col text-[12px] leading-[17px]">
          <span class="font-[600] text-[#0D2245] mb-[4px]">{{ t('隐藏零数余额') }}</span>
          <span class="font-[600] text-[#6D7693]">{{ t('隐藏零数余额1') }}</span>
        </div>
      </div>
    </AfunBaseDialog>
  </div>
</template>

<style lang='scss' scoped>
.currency-list {
  border-radius: 0px 0px 4px 4px;
  background: #fff;
  padding: 8px 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #0d2245;
  font-size: 14px;
  font-weight: 500;
  --afun-base-input-search-icon-size: 16px;
  .search-ipt {
    --afun-base-input-padding-y: 7px;
    --afun-base-input-border-color: #b1bad3;
    --afun-base-input-padding-left: 16px;
    --afun-base-input-background-color: #fff;
    --afun-base-input-shadow: none;
    --afun-base-input-style-placeholder-color: #000;
  }
  &.mode2 {
    padding: 8px 12px 0;
    .search-ipt {
      --afun-base-input-padding-y: 8.5px;
      --afun-base-input-padding-left: 12px;
    }
  }
}
.currency-item {
  width: 100%;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.wallet-setting {
  padding: 8px 0;
  line-height: 20px;
  display: flex;
  align-items: center;
  margin-top: 3px;
  cursor: pointer;
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: #ebebeb;
    bottom: 36px;
    left: 0;
  }
}
</style>
