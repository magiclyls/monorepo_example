<script lang="ts" setup>
import { IconUniMenu2 } from '@tg/icons'

defineOptions({
  name: 'AppLoginRegisterBtnsH5',
})
const { t } = useI18n()
const { openLoginDialog } = useLoginDialog()
const { openRegisterDialog } = useRegisterDialog()
const { leftIsExpand, closeLeftSidebar, triggerLeftSidebar } = useLeftSidebar()
const { isMobile } = storeToRefs(useWindowStore())

function handleLogin() {
  leftIsExpand.value && closeLeftSidebar()
  openLoginDialog()
}

function handleRegister() {
  leftIsExpand.value && closeLeftSidebar()
  openRegisterDialog()
}
</script>

<template>
  <div class="center btn-box">
    <BaseButton
      custom-padding
      type="text"
      style=""
      class="login-button"
      @click.stop="handleLogin"
    >
      {{ t('top_bar_login_button') }}
    </BaseButton>
    <BaseButton
      custom-padding
      style="--tg-base-button-padding-y:11px;"
      bg-style="primary"
      @click.stop="handleRegister"
    >
      {{ t('reg') }}
    </BaseButton>
    <div class="ml-[20px] flex items-center" @click="triggerLeftSidebar">
      <IconUniMenu2 class="theme-logo" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-logo{
    --tg-icon-color: var(--tg-text-white);
    font-size: 18px;
}
.login-button{
  @include webTheme('new-default'){
    --tg-base-button-text-default-color:#ffffff;
  }
  @include webTheme('white'){
    --tg-base-button-text-default-color:#111111;
  }
  @include webTheme('green'){
    --tg-base-button-text-default-color:#fff;
  }
}
</style>
