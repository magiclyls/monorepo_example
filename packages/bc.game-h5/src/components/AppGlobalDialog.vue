<script setup lang="ts">
import { useDialogStore } from '@tg/stores'

import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import AppLogin from './AppLogin.vue'
import AppResetPassword from './AppResetPassword.vue'

const dialogStore = useDialogStore()
const { isOpenLogin, isOpenResetPassword, isCloseAllDialog, isAnimating } = storeToRefs(dialogStore)
/**
 * 使用规则，先去dialog.ts中加变量->解构出对应变量->dialogs增加对应key等->dialogsFun增加对应函数->isNone增加新增开关弹窗变量
 */
const dialogs = computed(() => [
  { key: 'isOpenLogin', visible: isOpenLogin.value, component: AppLogin },
  { key: 'isOpenResetPassword', visible: isOpenResetPassword.value, component: AppResetPassword },
])
const dialogsFun: Record<string, (value: boolean) => void> = {
  isOpenLogin: dialogStore.setIsOpenLogin,
  isOpenResetPassword: dialogStore.setIsOpenResetPassword,
}
const isNone = computed(() => {
  return !isOpenLogin.value && !isOpenResetPassword.value
})

const transitionName = computed(() => {
  return !isCloseAllDialog.value ? '' : 'dialog-list'
})

function animationEnd() {
  if (!isCloseAllDialog.value) {
    requestAnimationFrame(() => {
      dialogs.value.forEach((item) => {
        if (item.visible && dialogsFun[item.key]) {
          dialogsFun[item.key](false)
        }
      })
      setTimeout(() => {
        dialogStore.setIsCloseAllDialog(true)
        if (isAnimating.value) {
          dialogStore.setIsAnimating(false)
        }
      }, 200)
    })
  }
}
function animationStart() {
  if (!isAnimating.value) {
    dialogStore.setIsAnimating(true)
  }
}
</script>

<template>
  <div
    class="app-global-dialog"
    :class="[{ 'close': !isCloseAllDialog, 'pointer-events-none': isNone }]"
    @animationend="animationEnd"
    @animationstart="animationStart"
  >
    <TransitionGroup :name="transitionName" tag="ul">
      <div
        v-for="{ key, visible, component: Comp } in dialogs"
        v-show="visible"
        :key="key"
        class="absolute"
      >
        <component :is="Comp" />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="scss">
.app-global-dialog {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 102;
  width: 100%;
  height: 100vh;
  will-change: transform;
}

.close {
  animation: fade-out 200ms forwards;
}

@keyframes fade-out {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(100%);
    display: none;
  }
}
.dialog-list-enter-active,
.dialog-list-leave-active {
  transition: all 0.2s ease;
}
.dialog-list-enter-from {
  transform: translateX(100%);
}
.dialog-list-leave-to {
  transform: translateX(-100%);
}
</style>
