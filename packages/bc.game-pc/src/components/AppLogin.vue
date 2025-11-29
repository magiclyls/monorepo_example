<script lang="ts" setup>
import { BaseButton, BaseForm, BaseIcon, BaseInput } from '@tg/bccomponents'
import * as Yup from 'yup'
import AppThirdLogin from './AppThirdLogin.vue'

defineOptions({
  name: 'AppLogin',
})

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
</script>

<template>
  <div class="flex size-full bg-[#232626]">
    <div class="w-1/2 relative">
      <img class="h-full" src="/img/affiliate-exhibition/login-pc-img.png" alt="">
      <img src="/img/affiliate-exhibition/bc-logo.png" class="w-36 h-8 absolute left-6 top-4">
      <div class="absolute bottom-26 w-full ">
        <div class="text-4xl mb-2 text-center">
          保持桀驁不馴
        </div>
        <div class="text-sm text-center">
          註冊並獲得迎新獎金
        </div>
      </div>
    </div>
    <div class="py-5 px-6 w-1/2 relative">
      <div class="flex justify-between w-full mb-3">
        <span class="text-lg">登入</span>
        <BaseButton class="w-8 !h-8 bg-[#292D2E] rounded" type="none">
          <BaseIcon name="x" class="text-xl scale-50" />
        </BaseButton>
      </div>
      <div class="mb-3">
        <BaseForm :schema="schema">
          <BaseInput name="username" class="mb-3" placeholder="電子郵件 / 電話號碼" />
          <BaseInput name="password" type="password" placeholder="密碼" class="mb-3" />
          <div class="w-full flex justify-end mb-3">
            <BaseButton type="none" class="h-auto text-sm">
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
      <div class="absolute w-full px-6 bottom-0 left-0">
        <div class="flex items-center justify-center w-full mb-3">
          <div class="flex-1 h-px bg-gray-500" />
          <span class="text-gray-400 mx-4 text-sm">直接登入</span>
          <div class="flex-1 h-px bg-gray-500" />
        </div>
        <BaseButton type="none" class="w-full  border-1 border-[#3A4142] text-[#FFFFFF] text-sm mb-3">
          <BaseIcon name="key-login" class="text-xl" /><span class="ml-1">使用密鑰登入</span>
        </BaseButton>
        <AppThirdLogin />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
