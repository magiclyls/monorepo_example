<script lang="ts" setup >
import type { EnumCurrencyKey } from '@tg/types'
import {IconToastInfo} from '@tg/icons';

defineOptions({name:'BaseToast'})

interface Props {
  message: string
  bottom?: string
  currencyIcon?: EnumCurrencyKey
  icon:Component
}
const props = withDefaults(defineProps<Props>(), {
  icon:IconToastInfo,
  bottom: '380px',
})
</script>

<template>
  <Transition>
    <section v-show="true" class="tg-base-toast" :style="{ bottom }">
      <div class="tg-base-toast-wrapper">
         <<component :is="icon"></component>>
        <span>{{ message }}</span>
        <AppCurrencyIcon v-if="currencyIcon" class="currency-icon" :currency-type="currencyIcon" />
      </div>
    </section>
  </Transition>
</template>

<style>
:root {
  --tg-dialog_style-bg: var(--tg-primary-main);
  --tg-z-index-toast: var(--tg-z-index-top);
  --tg-gap-toast :var(--tg-spacing-4)
}
</style>

<style lang="scss" scoped>
  .v-enter-active,
  .v-leave-active {
    transition: opacity .5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }

  .tg-base-toast {
    position: fixed;
    left: 50%;
    transform: translate3d(-50%,-50%,0);
    z-index: var(--tg-z-index-toast);
    padding: var(--tg-spacing-12);
    font-size: var(--tg-font-size-default);
    border-radius: var( --tg-radius-default);
    background: #151515;
    color: #B1BAD3;
    @include webTheme('green'){
      background: #02432D;
      color: #3CB389;
      --tg-icon-color:#5ECEA6;
    }
    @include webTheme('white'){
      background: #555555;
      color: #fff;
      --tg-icon-color:#fff;
    }
  }
  .tg-base-toast-wrapper {
    display: flex;
    .type-icon {
      margin-right: var(--tg-gap-toast);
    }
    .currency-icon {
      margin-left: var(--tg-gap-toast);
    }
  }
</style>
