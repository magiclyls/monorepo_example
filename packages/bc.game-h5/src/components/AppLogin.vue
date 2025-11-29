<script lang="ts" setup>
import { BaseButton, BaseForm, BaseIcon, BaseImage, BaseInput } from '@tg/bccomponents'
import { useDialogStore } from '@tg/stores'
import * as Yup from 'yup'

defineOptions({
  name: 'AppLogin',
})
const dialogStore = useDialogStore()
const schema = Yup.object().shape({
  username: Yup.string().required('用户名必须填写'),
  password: Yup.string().required('密码必须填写').min(6, '最小六位'),
})
// function onSubmit(values) {
//   console.log('values', values)
// }
// function onInvalidSubmit(err) {
//   console.log(err, 'err')
// }
function goReset() {
  dialogStore.setIsOpenLogin(false)
  dialogStore.setIsOpenResetPassword(true)
}
</script>

<template>
  <div class="size-full  bg-[#232626]">
    <div class="relative w-full">
      <BaseImage url="/img/h5/affiliate-program/h5-header.png" alt="" class="w-full" />
      <div class="absolute top-0 w-full flex justify-between items-center px-6 py-3">
        <div>logo</div>
        <BaseButton class="w-8 !h-8 bg-[rgba(255,255,255,.05)] rounded" type="none" @click="dialogStore.setIsCloseAllDialog(false)">
          <BaseIcon name="x" class="text-xl scale-50" />
        </BaseButton>
      </div>
    </div>

    <div class="py-5 px-6 relative w-full">
      <div class="flex justify-between w-full mb-3">
        <span class="text-lg">登入</span>
      </div>
      <div class="mb-3">
        <BaseForm :schema="schema">
          <BaseInput name="username" class="mb-3" placeholder="電子郵件 / 電話號碼" />
          <BaseInput name="password" type="password" placeholder="密碼" class="mb-3" />
          <div class="w-full flex justify-end mb-3">
            <BaseButton type="none" class="h-auto text-sm" @click="goReset">
              忘记密码?
            </BaseButton>
          </div>
          <BaseButton html-type="submit" type="primary" class="w-full">
            登入
          </BaseButton>
        </BaseForm>
      </div>
      <div class="flex">
        <span>您是 BC.GAME的新手嗎？</span>
        <BaseButton type="none" html-type="submit" class="h-auto text-sm text-[#24EE89]">
          建立帳號
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
