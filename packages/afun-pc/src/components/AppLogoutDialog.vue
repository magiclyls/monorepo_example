<script lang="ts" setup>
defineOptions({
  name: 'AppLogoutDialog',
})
const props = defineProps<{callBack?:()=>void}>()

const { t } = useI18n()

const closeDialog = inject('closeDialog', () => {})

const { runMemberLogout, logoutLoading } = useLogout(() => {
  closeDialog()
  props.callBack && props.callBack()
})
</script>

<template>
  <div class="dialog">
    <div class="dialog-text">
      {{ t('logout_dont_foget') }}
    </div>
    <BaseButton
      size="lg"
      class="dialog-btn"
      type="text"
      :loading="logoutLoading"
      @click.stop="runMemberLogout"
    >
      {{ t('logout') }}
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.dialog {
  display: flex;
  flex-direction: column;
  padding: var(--tg-spacing-16) var(--tg-spacing-16);
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-16);
  }

  &-text {
    font-size: var(--tg-font-size-default);
    line-height: 1.5;
    color: var(--tg-text-lightgrey);
  }

  &-btn {
    color: var(--tg-text-white);
    font-size: var(--tg-font-size-base);
    background: var(--tg-button-secondary-main);
    @include webTheme('green'){
      background: var(--tg-dot-state-bg);
    }
    @include webTheme('white'){
      color: #ffffff;
      &:hover {
        color: #ffffff;
      }
    }
  }
}
</style>
