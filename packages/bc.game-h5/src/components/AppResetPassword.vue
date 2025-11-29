<script lang="ts" setup>
import { BaseButton, BaseForm, BaseIcon, BaseImage, BaseInput } from '@tg/bccomponents'
import { useDialogStore } from '@tg/stores'
import * as Yup from 'yup'

defineOptions({
  name: 'AppResetPassword',
})
const dialogStore = useDialogStore()
const schema = Yup.object().shape({
  account: Yup.string().required('请输入电子邮件/电话号码'),
})
// function onSubmit(values) {
//   console.log('values', values)
// }
// function onInvalidSubmit(err) {
//   console.log(err, 'err')
// }
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
        <span class="text-lg">重置密码</span>
      </div>
      <div class="mb-3">
        <BaseForm :schema="schema">
          <BaseInput name="account" class="mb-3" placeholder="电子邮件/电话号码" />
          <BaseButton html-type="submit" type="primary" class="w-full text-xs">
            重置密码
          </BaseButton>
        </BaseForm>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
