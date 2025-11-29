<script lang="ts" setup>
import type { CurrencyData } from '~/composables/useCurrencyData'
import type { IAvailableCurrency } from '@tg/types'
import { IconUniArrowDown } from '@tg/icons'

interface Props {
  modelValue?: string
  showBalance?: boolean // 是否展示货币余额
  network?: boolean // 是否显示协议类型
  type?: number
  placeholder?: string
  distance?: number
  activeType?: string
  activeCurrencyList?: IAvailableCurrency[]
  interestDeposit?: boolean // 利息宝存款
  setFunc?: (p?: any) => void
}
defineOptions({
  name: 'AppSelectCurrency',
})
const props = withDefaults(defineProps<Props>(), {
  showBalance: true,
  network: false,
  type: 3,
  placeholder: 'search_currency',
  distance: 6,
  interestDeposit: false,
})

const emit = defineEmits(['change', 'update:modelValue'])
const appStore = useAppStore()
const { userInfo, balanceData, lockerData, isLogin } = storeToRefs(appStore)

const { t } = useI18n()

/** 下拉搜索是否显示 */
const { bool: isMenuShown } = useBoolean(false)
const {
  clearSearchValue,
  searchValue,
  renderBalanceList,
  renderBalanceLockerList,
  renderCurrencyList,
  renderFinanceCurrencyList,
  getVirtualCurrencyContractType,
} = useCurrencyData()
const { currentGlobalCurrency } = storeToRefs(useAppStore())

/** 虚拟货币协议类型 */
const currentNetwork = ref()

/** 当前货币 */
const activeCurrency = ref<CurrencyData>()

const getCurrencyList = computed(() => {
  console.log('props. type ===', props.type, renderBalanceList.value, renderBalanceLockerList.value)
  switch (props.type) {
    case 1: return renderBalanceList.value
    case 2: return renderBalanceLockerList.value
    case 3: return renderCurrencyList.value
    case 4: return renderFinanceCurrencyList(props.activeCurrencyList ?? [])
    default: return []
  }
})

function getGetCurrencyList() {
  switch (props.type) {
    case 1: return renderBalanceList.value
    case 2: return renderBalanceLockerList.value
    case 3: return renderCurrencyList.value
    case 4: return renderFinanceCurrencyList(props.activeCurrencyList ?? [])
    default: return []
  }
}
// 获取协议类型
const curContractList = computed(() => {
  if (!activeCurrency.value)
    return []
  return getVirtualCurrencyContractType(activeCurrency.value.type)
})

const showNetwork = computed(() => {
  return props.network && curContractList.value?.length > 1
})

// 设置协议默认值
function getTypeVal() {
  currentNetwork.value = curContractList.value ? curContractList.value[0]?.value : ''
  emit('change', activeCurrency.value, currentNetwork.value)
}

// 选择当前币种
function selectCurrency(item: CurrencyData, hide: () => void) {
  hide()
  activeCurrency.value = item
  getTypeVal()
  emit('change', item, currentNetwork.value, true)
}
function getActiveValue() {
  console.log('getActiveValue ====== ', getCurrencyList.value, props.activeType, activeCurrency.value?.type, currentGlobalCurrency.value)
  console.log('---- --- -- - --props. type ===', props.type, renderBalanceList.value, renderBalanceLockerList.value)
  const temp = getCurrencyList.value && getCurrencyList.value.length ? getCurrencyList.value : getGetCurrencyList()
  console.log('temp ===== ', temp)
  activeCurrency.value = temp.find(item => item.type === (props.activeType ?? activeCurrency.value?.type ?? currentGlobalCurrency.value)) ?? temp[0]
  console.log('fgghgdsfdjdfsk ======== ', activeCurrency.value)
  emit('change', activeCurrency.value, currentNetwork.value)
  props.setFunc && props.setFunc(activeCurrency.value)
}
// 选择协议
function selectNetwork() {
  emit('change', activeCurrency.value, currentNetwork.value)
}

// 修改activeCurrency
function changeActiveCurrency(value: CurrencyData) {
  activeCurrency.value = value
}

watch(() => props.type, () => {
  getActiveValue()
})
watch(() => props.activeCurrencyList, () => {
  nextTick(() => {
    getActiveValue()
  })
})

watch(() => [balanceData.value, lockerData.value], ([newBan, newLoc], [oldBan, oldLoc]) => {
  if (!activeCurrency.value)
    return
  const activeCurrencyType = activeCurrency.value?.type
  if (newBan && newLoc && oldBan && oldLoc) {
    if (
      newBan[currentGlobalCurrency.value] !== oldBan[currentGlobalCurrency.value]
    || newLoc[currentGlobalCurrency.value] !== oldLoc[currentGlobalCurrency.value]
    || newBan[activeCurrencyType] !== oldBan[activeCurrencyType]
    || newLoc[activeCurrencyType] !== oldLoc[activeCurrencyType]
    )
      getActiveValue()
  }
})

watch(isLogin, (val) => {
  console.log('aldfjaslfjls )0000999')
  if (val) {
    appStore.getBalanceData().then(() => {
      appStore.getLockerData().then(() => {
        setTimeout(() => {
          console.log('kkkkkkkkkkkk')
          getActiveValue()
        }, 0)
      })
    })
  }
})

// watch([], () => {

// })

onMounted(() => {
  getActiveValue()
  getTypeVal()
})

defineExpose({ changeActiveCurrency })
</script>

<template>
  <div class="app-wallet" :class="{ 'app-currency': showNetwork }">
    <VDropdown
      v-model:shown="isMenuShown"
      :distance="distance"
      handle-resize
      style="width: var(--tg-app-dropdown-width)"
      @apply-show="clearSearchValue"
    >
      <div class="wallet-box" :class="{ interest: interestDeposit }">
        <span v-if="showNetwork">{{ t('currency') }}</span>
        <BaseButton class="wallet wallet-only" custom-padding type="text" size="md">
          <AppAmount
            v-if="showBalance && !interestDeposit"
            style="color:var(--tg-text-white);"
            :amount="activeCurrency?.balanceWithSymbol || ''"
            :currency-type="activeCurrency?.type || currentGlobalCurrency"
          />
          <AppCurrencyIcon
            v-else
            class="wallet-text"
            :show-name="!showBalance || interestDeposit"
            :currency-type="activeCurrency?.type || currentGlobalCurrency"
          />
          <IconUniArrowDown
            class="arrow"
            :class="{ 'arrow-up': isMenuShown }"
          />
        </BaseButton>
      </div>
      <template #popper="{ hide }">
        <div class="dropdown-popper need-pad-y">
          <div class="popper-top" :style="{ '--tg-app-select-currency-poptop-width': showBalance ? '218px' : '136px' }">
            <BaseSearch
              v-model="searchValue"
              class="top-search"
              :clearable="searchValue?.length > 0"
              :place-holder="$t(placeholder)"
              shape="square"
              white-style
            />
          </div>
          <div
            class="scroll-y popper-content"
            :class="{ 'justify-content': !showBalance }"
          >
            <div
              v-for="item of getCurrencyList"
              :key="item?.type"
              class="content-row"
              :class="{ active: item?.type === activeCurrency?.type }"
              @click.stop="selectCurrency(item, hide)"
            >
              <AppAmount
                v-if="showBalance"
                :amount="item?.balanceWithSymbol ?? 0"
                :currency-type="item?.type"
                show-name
              />
              <AppCurrencyIcon v-else show-name :currency-type="item?.type ?? 'USDT'" />
            </div>
            <div v-show="!getCurrencyList.length" class="balance-not">
              {{ $t('currency_disable') }}
            </div>
          </div>
        </div>
      </template>
    </VDropdown>
    <div v-if="showNetwork" class="wallet-box">
      <span>{{ t('network') }}</span>
      <BaseSelect
        v-model="currentNetwork"
        :options="curContractList"
        popper
        @select="selectNetwork"
      />
    </div>
  </div>
</template>

<style>
:root {
  --tg-app-select-currency-poptop-width: max-content;
  --tg-app-select-currency-padding-x: 20px;
  --tg-app-select-currency-padding-y: 15px;
  --tg-app-dropdown-width: auto;
  --tg-app-select-currency-bg: var(--tg-secondary-dark);
}
</style>

<style lang="scss" scoped>
.app-wallet {
    display: grid;
    gap: var(--tg-spacing-12);
    align-items: center;
    justify-content: center;
    .wallet-box {
        display: grid;
        gap: var(--tg-spacing-4);
        justify-content: center;
        flex-direction: column;
        --tg-base-button-padding-x: var(--tg-app-select-currency-padding-x);
        --tg-base-button-padding-y: var(--tg-app-select-currency-padding-y);
        border-radius: 4px;
        &.interest {
          --tg-base-button-padding-x: 16px;
          --tg-base-button-padding-y: 13px;
          border-radius: 0;
          .wallet {
            background-color: transparent;
          }
        }
    }
    .wallet {
        background-color: var(--tg-app-select-currency-bg);
        border-radius: var(--tg-radius-sm) 0px 0px var(--tg-radius-sm);
        @include webTheme('white') {
          background-color: #fff;
          color: var(--tg-secondary-light);
          .icon{
            --tg-icon-color: #484848;
          }
        }
        @include webTheme('green') {
          background-color: #02432D;
        }

        .arrow {
            font-size: var(--tg-font-size-default);
            margin-left: var(--tg-spacing-9);
            transition: none;
        }

        .arrow-up {
            transform: rotate(180deg);
        }
    }

    .wallet-only {
        border-radius: var(--tg-radius-sm);
    }

    .wallet-text {
        line-height: 1;
        color: var(--tg-text-white);
        font-size: var(--tg-font-size-default);
        font-style: normal;
        font-weight: 500;
    }
}

.app-currency {
    grid-template-columns: auto auto;
}

.dropdown-popper {
    max-height: inherit;
    max-width: inherit;
    display: flex;
    flex-direction: column;

    .popper-top {
        padding: 4px 12px;
        padding-bottom: 8px;
        width: var(--tg-app-select-currency-poptop-width);

        :deep(.base-search.top-search) {
      --tg-base-search-icon-size: var(--tg-font-size-base);
      width: 100%;
      max-width: 100%;
      margin: auto;
      background-color: var(--tg-top-search-bg);
      border-color: var(--tg-top-search-border-color);
      padding: 0 var(--tg-spacing-10);
      --tg-icon-color: var(--tg-text-lightgrey);
      height: 39px;
      .search-icon {
        color: var(--tg-text-lightgrey);
        @include webTheme('greenblack') {
            color: var(--tg-text-placeholder);
        }
        @include webTheme('green') {
          color: var(--tg-text-grey-light);
        }
      }
      .clear-icon {
        right: 7px;
        top: 11px;
      }
      input {
        color: var(--tg-secondary-main);
        padding-left: var(--tg-spacing-8);
        font-weight: var(--tg-font-weight-semibold);
        &::placeholder {
          color: var(--tg-secondary-main) !important;
          font-weight: var(--tg-font-weight-semibold);
          opacity: 0.8;
        }
        @include webTheme('green') {
          color:#3CB389;
          &::placeholder {
            color:#3CB389 !important;
          }
        }
        @include webTheme('greenblack') {
          color: var(--tg-text-placeholder) ;
          &::placeholder {
            color: var(--tg-text-placeholder) !important;
          }
        }
        @include webTheme('white') {
          &::placeholder {
            color: #555555 !important;
          }
        }
      }
    }
    }

    .popper-content {
        max-height: 300px;
        overflow-y: auto;
        color: var(--tg-popper-color-default);
        font-size: var(--tg-font-size-default);
        font-weight: 500;
        flex: 1;
        &::-webkit-scrollbar-thumb {
            background: var(--tg-secondary-light);
        }
        .content-row {
            display: flex;
            align-items: center;
            padding:
            var(--tg-spacing-button-padding-vertical-s)
            var(--tg-spacing-button-padding-horizontal-xs);
            cursor: pointer;
            --tg-app-amount-width: 12ch;
            transition: color 0.2s ease;
            font-weight: var(--tg-font-weight-semibold);

            &:hover {
              background-color: var(--tg-popper-hover-bg);
            }
            &:active div{
              transform: scale(0.96);
            }

        }

        .balance-not {
            text-align: center;
            padding: 3px 0 12px;
        }
    }

    .justify-content {
        .content-row {
          display: flex;
          align-items: center;
          text-align: center;
          justify-content: center;
        }
    }

}
</style>
