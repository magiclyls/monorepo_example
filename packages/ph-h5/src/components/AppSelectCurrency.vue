<script setup lang='ts'>
import { BaseSwitch, PhBaseAmount, PhBaseCurrencyIcon, PhBaseDialog, PhBaseInput } from '@tg/bccomponents'
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
            width: `${width}rem`,
            height: `${height}rem`,
          }"
          :class="[`mode${mode}`]"
        >
          <PhBaseInput
            v-model="searchValue"
            class="mb-[16rem] w-full search-ipt" :placeholder="t('搜索货币')" :name="`search-${+new Date()}`" search
          />
          <div
            v-for="item, i in list" :key="item.cur" class="currency-item"
            :class="i !== list.length - 1 ? 'mb-[10rem]' : ''"
            @click="emit('choose', item);hide()"
          >
            <div class="min-w-[60rem]">
              <PhBaseCurrencyIcon :currency-type="item.type" show-name />
            </div>
            <PhBaseAmount :amount="item.balance" :currency-type="item.type" :show-icon="false" />
          </div>
          <div v-if="showSetting" class="wallet-setting" @click="openWalletSetting">
            <IconUniWalletSetting class="mr-[8rem]" :style="{ color: '#0D2245' }" />
            {{ t('钱包设置') }}
          </div>
          <div v-else class="h-[20rem]" />
        </div>
      </template>
    </VDropdown>

    <PhBaseDialog
      v-if="showWalletSetting" v-model="showWalletSetting" icon="uni-wallet-setting" :title="t('钱包设置')"
      style="--ph-base-dialog-icon-color:#0D2245;"
    >
      <div class="w-full px-[16rem] pt-[12rem] pb-[16rem] flex items-center">
        <BaseSwitch v-model="isHideZeroBalance" />
        <div class="ml-[8rem] flex flex-col text-[12rem] leading-[17rem]">
          <span class="font-[600] text-[#0D2245] mb-[4rem]">{{ t('隐藏零数余额') }}</span>
          <span class="font-[500] text-[#6D7693]">{{ t('隐藏零数余额1') }}</span>
        </div>
      </div>
    </PhBaseDialog>
  </div>
</template>

<style lang='scss' scoped>
.currency-list {
  border-radius: 0px 0px 4rem 4rem;
  background: #fff;
  padding: 8rem 10rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #0d2245;
  font-size: 14rem;
  font-weight: 500;
  --ph-base-input-search-icon-size: 16rem;
  .search-ipt {
    --ph-base-input-padding-y: 7rem;
    --ph-base-input-style-placeholder-color: #0d2245;
    --ph-base-input-padding-left: 16rem;
  }
  &.mode2 {
    padding: 8rem 12rem 0;
    .search-ipt {
      --ph-base-input-padding-y: 8.5rem;
      --ph-base-input-padding-left: 12rem;
    }
  }
}
.currency-item {
  width: 100%;
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.wallet-setting {
  padding: 8rem 0;
  line-height: 20rem;
  display: flex;
  align-items: center;
  margin-top: 3rem;
  cursor: pointer;
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: #ebebeb;
    bottom: 36rem;
    left: 0;
  }
}
</style>
