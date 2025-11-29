<script lang="ts" setup>
import type { CurrencyData } from '~/composables/useCurrencyData'

defineOptions({
  name: 'AppSelectCurrencyV2',
})
const props = defineProps<Props>()
const emit = defineEmits(['changeCurrency', 'changeNetwork'])
interface Props {
  initVirCurrency: CurrencyData
  initCurrentNetwork?: string
  virCurrencyList: CurrencyData[]
}
const { t } = useI18n()
const { bool: isDataLoading } = useBoolean(false)
const closeCurDialog = inject('closeDialog', () => { })
/** 货币网络类型 */
const { getVirtualCurrencyContractType } = useCurrencyData()
/** 货币搜索值 */
const virSearchValue = ref('')
/** 当前货币 */
const activeVirCurrency = ref(props.initVirCurrency)
/** 虚拟货币列表 */
const _virCurrencyList = computed(() => props.virCurrencyList.filter(a => a.type.includes(virSearchValue.value.toUpperCase())))
/** 清除搜索值 */
function onVirPopperHide() {
  setTimeout(() => {
    virSearchValue.value = ''
  }, 200)
}
// 获取协议类型列表
const contractList = computed(() => {
  if (!activeVirCurrency.value)
    return []
  return getVirtualCurrencyContractType(activeVirCurrency.value.type)
})
/** 当前的加密货币网络 */
// const currentNetwork = ref(contractList.value[0]?.value)
const currentNetwork = ref(props.initCurrentNetwork)
/** 切换货币类型事件 */
function onVirCurrencyChange(item: CurrencyData) {
  activeVirCurrency.value = item
  currentNetwork.value = contractList.value[0].value
  emit('changeCurrency', item, currentNetwork.value)
}
/** 选择网络 */
const showNetwork = computed(() => {
  return contractList.value?.length > 1
})
/** 选择协议 */
function selectNetwork(activeValue: any) {
  currentNetwork.value = activeValue
  emit('changeNetwork', activeValue)
}
</script>

<template>
  <div>
    <!-- 存款货币标签 -->
    <div class="flex items-center justify-between">
      <label class="text-[14px] font-semibold leading-[19.6px]">{{ t('deposit_currency') }} <span class="text-tg-text-error text-[12px]">*</span></label>
      <BaseSelect
        v-if="activeVirCurrency" v-model="activeVirCurrency.type" popper :border="false"
        :options="_virCurrencyList" popper-strategy="fixed" @popper-hide="onVirPopperHide"
      >
        <template #label>
          <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;" :currency-type="activeVirCurrency.type" show-name />
        </template>
        <template #popper="{ hide }">
          <div class="scroll-y max-w-[135px] flex flex-col px-[10px] py-[12px]">
            <BaseSearch
              v-model="virSearchValue" style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:12px;"
              class="mb-[16px] h-[36px]" :place-holder="t('search')" white-style shape="square"
            />
            <a
              v-for="virtual, in _virCurrencyList" :key="virtual.cur"
              class="text-tg-secondary-deepdark block h-[14px] cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-semibold"
              @click="hide();onVirCurrencyChange(virtual)"
            >
              <div class="flex items-center justify-between">
                <AppCurrencyIcon :currency-type="virtual.type" show-name />
                <span>{{ application.formatNumDecimal(virtual.balance ? virtual.balance : 0, currencyConfig[virtual.type].decimal) }}</span>
              </div>
            </a>
          </div>
        </template>
      </BaseSelect>
    </div>
    <!-- 选择网络标签 -->
    <div v-if="showNetwork" class="mt-[16px] flex items-center justify-between">
      <label class="text-[14px] font-semibold leading-[19.6px]">{{ t('select_network') }} <span class="text-tg-text-error text-[12px]">*</span></label>
      <BaseSelect
        v-model="currentNetwork"
        :options="contractList"
        popper
        @select="selectNetwork"
      />
    </div>
    <AppLoading v-if="isDataLoading" />
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
    }
    .wallet {
        background-color: var(--tg-app-select-currency-bg);
        border-radius: var(--tg-radius-sm) 0px 0px var(--tg-radius-sm);
        // box-shadow:
        // 0px 1px 2px 0px
        // #{rgba($color: var(--tg-color-black-rgb), $alpha: 0.1)} inset,
        // 0px -1px 2px 0px
        // #{rgba($color: var(--tg-color-black-rgb), $alpha: 0.1)} inset;

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
            margin: auto;
            padding: 0 var(--tg-spacing-10);
            --tg-icon-color: var(--tg-text-lightgrey);
            height: 39px;
            .search-icon {
              color: var(--tg-text-lightgrey);
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
                opacity: 0.82;
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
