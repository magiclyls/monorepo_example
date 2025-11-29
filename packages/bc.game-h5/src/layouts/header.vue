<script setup lang="ts">
import { ApiMemberLogin } from '@tg/apis'
import { BaseImage } from '@tg/bccomponents'

import { useAppStore, useDialogStore } from '@tg/stores'
import { socketClient } from '@tg/utils'

defineOptions({
  name: 'LayoutHeader',
})
const app = useAppStore()
// const { userInfo } = storeToRefs(app)
const dialogStore = useDialogStore()

function changeFold() {
  document.body.classList.toggle('side-fold')
  socketClient.connect({
    msg: '测试',
  })
  ApiMemberLogin({
    username: 'akun666',
    password: 'Aa123123',
    device_number: 'test1',
  }).then((res) => {
    if (res) {
      app.login(res)
    }
  })
}
</script>

<template>
  <div class="header">
    <div class="relative flex h-full flex-1 items-center">
      <div class="relative z-10 flex h-full w-60 flex-none items-center px-4 w-[72px]">
        <!-- <span @click="changeFold">切换 {{ userInfo }}</span> -->
        <span @click="changeFold">切换</span>
        <BaseImage is-network url="/banner/zh-CN/1727942622339.webp" />
        <img alt="logo" src="https://bcgame.sk/assets/logo/logo.png" class="ml-5 h-8 cursor-pointer w-auto absolute left-[76px] top-3.5 !ml-0 max-w-100">
      </div>
      <div class="relative h-full w-full px-4 mx-auto max-w-[1248px]">
        <div class="absolute left-0 top-0 flex size-full items-center overflow-hidden px-3 justify-end">
          <span>search</span>
          <span class="ml-3" @click="dialogStore.openDialog('isOpenLogin')">login</span>
          <span class="ml-3" @click="dialogStore.openDialog('isOpenLogin')">register</span>
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
  left: 0;
  right: 0;
  top: 0;
  z-index: 101;
  display: flex;
  align-items: center;
}
</style>
