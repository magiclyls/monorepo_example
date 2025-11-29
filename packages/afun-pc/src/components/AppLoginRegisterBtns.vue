<script lang="ts" setup>
defineOptions({
  name: 'AppLoginRegisterBtns',
})
const { t } = useI18n()
const { openLoginDialog } = useLoginDialog()
const { openRegisterDialog } = useRegisterDialog()
const { leftIsExpand, closeLeftSidebar } = useLeftSidebar()
const { isMobile } = storeToRefs(useWindowStore())

function handleLogin() {
  isMobile.value && leftIsExpand.value && closeLeftSidebar()
  openLoginDialog()
}

function handleRegister() {
  isMobile.value && leftIsExpand.value && closeLeftSidebar()
  openRegisterDialog()
}
</script>

<template>
  <div class="center btn-box">
    <BaseButton
      type="text" custom-padding class="theme-color"
      style="--tg-base-button-padding-y: var(--tg-spacing-button-padding-vertical-md);
        "
      :style="{
        '--tg-base-button-padding-x': isMobile ? 'var(--tg-spacing-button-padding-horizontal-xs)'
          : 'var(--tg-spacing-button-padding-horizontal-md)',
      }"
      @click.stop="handleLogin"
    >
      {{ t('top_bar_login_button') }}
    </BaseButton>
    <BaseButton
      v-if="isMobile"
      type="text" custom-padding class="theme-color"
      style="--tg-base-button-padding-y: var(--tg-spacing-button-padding-vertical-md);
        --tg-base-button-padding-x: var(--tg-spacing-button-padding-horizontal-xs);"
      @click.stop="handleRegister"
    >
      {{ t('reg') }}
    </BaseButton>
    <BaseButton
      v-else
      custom-padding
      :bg-style="isStyle2() ? 'secondary' : 'primary'" class="theme-pc-reg"
      style="--tg-base-button-font-size: calc(var(--tg-font-size-default) + 1px);
      --tg-base-button-padding-y: calc(var(--tg-spacing-button-padding-vertical-md) - 0.5px);
      --tg-base-button-padding-x:
      calc(var(--tg-spacing-button-padding-horizontal-md) - 1px);"
      @click.stop="handleRegister"
    >
      {{ t('reg') }}
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.theme-color{
  --tg-base-button-text-default-color: var(--tg-text-white);
  @include webTheme('white'){
    --tg-base-button-text-default-color:#111111;
  }
}
.theme-pc-reg{
  @include webTheme('white'){
    --tg-base-button-style-bg: #F2CA5C;
    --tg-base-button-color: #111;
  }
}
</style>
