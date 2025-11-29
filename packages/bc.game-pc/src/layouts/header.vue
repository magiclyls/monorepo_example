<script setup lang="ts">
import { BaseIcon } from '@tg/bccomponents'

import AppRecharge from '~/components/AppRecharge.vue'

defineOptions({
  name: 'LayoutHeader',
})

function changeFold() {
  document.body.classList.toggle('side-fold')
}
</script>

<template>
  <div class="header select-none">
    <div class="relative flex h-full flex-1 items-center">
      <div class="relative z-10 flex h-full w-60 flex-none items-center px-4 w-[72px]">
        <span @click="changeFold">
          <BaseIcon name="hamberger" class="text-[1.5rem]" />
          <img
            alt="logo" src="https://bcgame.sk/assets/logo/logo.png"
            class="h-8 cursor-pointer w-auto absolute left-[76px] top-3.5 !ml-0 max-w-100"
          >
        </span>
      </div>
      <div class="relative h-full w-full px-4 mx-auto max-w-[1248px]">
        <div class="absolute left-0 top-0 flex size-full items-center overflow-hidden px-3 justify-end">
          <AppRecharge>
            <span>recharge</span>
          </AppRecharge>
          <span class="ml-3">search</span>
          <span class="ml-3">login</span>
          <span class="ml-3">register</span>
          <span class="ml-3">chat</span>
          <span class="ml-3">changelang</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.header {
  background-color: #2a2d2e;
  position: fixed;
  height: 3.75rem;
  left: 0px;
  right: 0px;
  top: 0px;
  z-index: 101;
  display: flex;
  align-items: center;
}
</style>
