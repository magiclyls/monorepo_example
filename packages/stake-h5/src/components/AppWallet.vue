<script lang="ts" setup>
import { IconWalletSet, IconUniArrowDown } from '@tg/icons'

import type { EnumCurrencyKey } from '@tg/types'

interface Props {
  popperClazz?: string
}
defineOptions({
  name: 'AppWallet',
})
defineProps<Props>()
const { openNotify } = useNotify()
const appStore = useAppStore()
const { openWalletDialog } = useWalletDialog()
const { openWalletSetDialog } = useWalletSetDialog()
const { isMobile } = storeToRefs(useWindowStore())
const { userLanguage } = storeToRefs(useLanguageStore())
// 下拉搜索是否显示
const { bool: isMenuShown } = useBoolean(false)
const searchRef = ref()
const {
  currentGlobalCurrency,
  currentGlobalCurrencyBalance,
  theme,
  userInfo,
} = storeToRefs(appStore)
const {
  searchValue,
  renderBalanceList,
  setHideZeroBalance,
  clearSearchValue,
} = useCurrencyData()

// 选择币种
function selectCurrency(item: EnumCurrencyKey, hide: () => void) {
  appStore.changeGlobalCurrency(item)
  hide()
}

function popperApplyShow() {
  clearSearchValue()
  useFixedTop('.app-h-wallet')
}
function handleHide() {
  searchRef.value?.manualBlur()
}
</script>

<template>
  <div class="app-wallet flex-box">
    <VDropdown
      v-model:shown="isMenuShown"
      :distance="10"
      strategy="fixed"
      @apply-show="popperApplyShow"
      @hide="handleHide"
    >
      <div class="flex-box wallet-box">
        <BaseButton
          class="wallet" type="text"
          :custom-padding="isMobile" style="--tg-base-button-padding-x: var(--tg-spacing-button-padding-horizontal-s);"
        >
          <!-- <span v-if="isCasinoGame" class="in-play">
            ({{ $t('use_in_game') }})
            <AppCurrencyIcon :show-name="true" :currency-type="currentGlobalCurrency" />
          </span> -->
          <AppAmount
            class="theme-amount"
            :amount="currentGlobalCurrencyBalance || 0"
            :currency-type="currentGlobalCurrency"
          />
          <IconUniArrowDown
            class="arrow"
            :class="{ 'arrow-up': isMenuShown }"
          />
        </BaseButton>
        <BaseButton
          class="wallet-right-btn"
          :style="(isMobile && userLanguage !== 'zh-CN') ? '--tg-base-button-padding-x:3px;' : ''"
          bg-style="primary"
          custom-padding
          @click.stop="openWalletDialog"
        >
          <span class="whitespace-nowrap">{{ $t('deposit') }}</span>
        </BaseButton>
      </div>
      <template #popper="{ hide }">
        <div class="dropdown-popper" :class="[popperClazz]">
          <div class="popper-top">
            <BaseSearch
              ref="searchRef"
              v-model="searchValue"
              class="top-search"
              :clearable="searchValue?.length > 0"
              :place-holder="$t('top_bar_drop_down_search_currency')"
              shape="square"
              white-style
              style="--tg-base-input-white-style-bg:var(--tg-top-search-bg)"
            />
          </div>
          <div class="scroll-y popper-content">
            <div
              v-for="item of renderBalanceList"
              :key="item.type"
              class="content-row"
              :class="{ active: item.type === currentGlobalCurrency }"
              @click.stop="selectCurrency(item.type, hide)"
            >
              <AppAmount
                :amount="item.balanceWithSymbol"
                :currency-type="item.type"
                show-name
              />
            </div>
            <div v-show="!renderBalanceList.length" class="balance-not">
              {{ $t('currency_disable') }}
            </div>
          </div>
          <div class="popper-bottom">
            <BaseButton
              type="text"
              style="width: 100%;"
              custom-padding
              @click=" hide();openWalletSetDialog({ setHideZeroBalance })"
            >
              <IconWalletSet class="icon-wallet-set" />
              <span style="color: var(--tg-popper-color-default);">
                {{ $t('title_wallet_set') }}</span>
            </BaseButton>
          </div>
        </div>
      </template>
    </VDropdown>
  </div>
</template>

<style>
:root {
  --tg-app-select-currency-poptop-width: max-content;
  --tg-top-search-border-color: var(--tg-border-color-grey);
}

:root {
  --tg-top-search-bg: var(--tg-text-white);
  --tg-top-search-icon-color: var(--tg-text-lightgrey);
  --tg-top-button-bg: #1576E1;
  --tg-top-button-text-color: var(--tg-text-white);
  --tg-top-wallet-bg: var(--tg-secondary-dark);
}

[theme="greenblack"] {
  --tg-top-search-bg: var(--tg-secondary-dark);
  --tg-top-search-icon-color: var(--tg-text-placeholder);
  --tg-top-button-bg: #26FFBE;
  --tg-top-button-text-color: var(--tg-text-black);
}

[theme="white"] {
  --tg-top-search-bg: #f5f5f5;
  --tg-top-search-icon-color:var(--tg-text-placeholder);
  --tg-top-button-bg: #F2CA5C;
  --tg-top-button-text-color: var(--tg-text-black);
  --tg-top-wallet-bg: #ffffff;
  --tg-popper-bg:#f5f5f5;
}
[theme="green"] {
  --tg-top-search-bg: #fff;
  --tg-top-search-icon-color:#FFEFB0;
  --tg-top-button-bg: #FFEFB0;
  --tg-top-button-text-color: #055031;
  --tg-top-wallet-bg: #02432D;

  /* --tg-base-button-style-bg-hover:#bcbc80; */
}
</style>

<style lang="scss" scoped>
.wallet-box {
  transition: all ease 0.3s;
}
.flex-box{
  display: flex;
  justify-content: flex-end;
}
.app-wallet {
  .wallet {
    color: var(--tg-text-white);
    background-color: var(--tg-top-wallet-bg);
    border-radius: var(--tg-radius-default) 0px 0px var(--tg-radius-default);
    box-shadow: 0px 1px 2px 0px #{rgba($color: var(--tg-color-black-rgb), $alpha: 0.1)} inset, 0px -1px 2px 0px #{rgba($color: var(--tg-color-black-rgb), $alpha: 0.1)} inset;
    .in-play{
      color: var( --tg-text-white);
      display: inline-flex;
      gap: var(--tg-spacing-8);
      align-items: center;
    }
    .arrow {
      font-size: var(--tg-font-size-default);
      margin-left: 8px;
      transition: none;
      @include webTheme('green'){
        --tg-icon-color: #F6D14A;
      }
    }
    .arrow-up{
      transform: rotate(180deg);
    }
    @include webTheme('green') {
      border:  1px solid #197B59;
    }
    @include webTheme('greenblack') {
      border:  1px solid var(--tg-primary-active);
    }
    @include webTheme('white') {
      border:  1px solid #F2CA5C;
      color: #111111;
      --tg-icon-color:#111111;
    }
  }

  .wallet-right-btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    --tg-base-button-padding-y: var(--tg-spacing-button-padding-horizontal-sm);
    --tg-base-button-padding-x: var(--tg-spacing-button-padding-vertical-lg);
    @include webTheme('green'){
      --tg-base-button-default-fake-active-bg:#FFE789;
      --tg-base-button-style-bg: #F6D14A;
      --tg-base-button-color: #055434;
    }
    @include webTheme('white'){
      --tg-base-button-style-bg: #F2CA5C;
      --tg-base-button-color: #111111;
    }
  }
  .icon-size{
    --tg-icon-color: var(--tg-text-white);
    font-size: var(--tg-font-size-default);
  }

}
.dropdown-popper {
  max-height: inherit;
  max-width: inherit;
  display: flex;
  flex-direction: column;
  .popper-top {
    // padding: 8px 12px;
    margin: 0 auto;
    padding-top: 8px;
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
      --tg-icon-color: var(--tg-top-search-icon-color);
      height: 39px;

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
          color: var(--tg-text-placeholder) ;
          &::placeholder {
            color: var(--tg-text-placeholder) !important;
          }
        }
      }
    }
  }

  .popper-content {
    max-height: 20rem;
    overflow-y: auto;
    color: var(--tg-popper-color-default);
    font-size: var(--tg-font-size-default);
    font-weight: 500;
    flex: 1;
    border-bottom: 1px solid var(--tg-border-color-grey);
    &::-webkit-scrollbar-thumb {
      background: var(--tg-secondary-light);
    }
    @include webTheme('white'){
      --tg-popper-color-default:#111;
    }
    .content-row {
      display: flex;
      align-items: center;
      padding: var(--tg-spacing-6) var(--tg-spacing-button-padding-horizontal-xs);
      cursor: pointer;
      --tg-app-amount-width:16ch;
      --tg-app-amount-max-width: 16ch;
      line-height: 20px;
      transition: all .2s ease;
      font-weight: var(--tg-font-weight-semibold);
      --tg-app-currency-name-weight: 600;
      &:hover { // ,&.active
        background-color: var(--tg-popper-hover-bg);
        // color: var(--tg-text-black);
        // color: var(--tg-popper-hover-color-default);
      }
      &:active div{
        transform: scale(0.96);
        // color: var(--tg-text-blue);
      }
    }
    .balance-not{
      text-align: center;
      // padding: 3px 0 12px;
      line-height: 36px;
      font-weight: var(--tg-font-weight-semibold);
    }
  }

  .popper-bottom {
    // background: var(--tg-primary-main);
    --tg-base-button-padding-y: var(--tg-spacing-button-padding-vertical-s);
    --tg-base-button-padding-x: var(--tg-spacing-button-padding-vertical-none);
    --tg-base-button-font-weight: var(--tg-font-weight-semibold);
    --tg-base-button-text-default-color: var(--tg-popper-color-default);
    margin: var(--tg-spacing-4) 0;
    width: 231.5px;
    @include webTheme('white'){
      --tg-base-button-text-default-color:#111;
      --tg-popper-color-default:#111;
    }
    .icon-wallet-set {
      font-size: var(--tg-font-size-base);
      --tg-icon-color: var(--tg-popper-color-default);
      margin-right: var(--tg-spacing-8);
    }
    &:hover{
      background-color: var(--tg-popper-hover-bg);
    }
  }

}
</style>
