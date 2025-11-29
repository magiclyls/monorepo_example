<script lang="ts" setup>
import { ApiMemberPasswordUpdate } from '@tg/apis'
import { AfunBaseButton, AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
import { useLogout } from '@tg/hooks'
import { lastOneNumberReg, upperLowerReg } from '@tg/utils'
import { useField } from 'vee-validate'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { RouterLink } from 'vue-router'
import AppPageLayout from '~/components/AppPageLayout.vue'
import { Message } from '~/utils'

defineOptions({ name: 'LoginPasswordSetting' })
const { t } = useI18n()
const { runMemberLogout, logoutLoading } = useLogout()
const pwdRef = ref()
const newPwd = ref()
const repeatPwd = ref()

const {
  value: password,
  errorMessage: pwdErrorMsg,
  validate: valiPassword,
} = useField<string>('password', (value) => {
  if (!value)
    return t('请输入旧密码')
  else if (value.length < 8)
    return t('八个字符')
  return ''
})

const {
  value: newPassword,
  errorMessage: newPwdErrorMsg,
  validate: valiNewPassword,
  meta: newPwdMeta,
} = useField<string>('newPassword', fieldVerifyLoginPwd)

const {
  value: repeatPassword,
  errorMessage: repeatPwdErrorMsg,
  validate: valiRepeatPassword,
} = useField<string>('repeatPassword', (value) => {
  if (!value)
    return t('请再次确认您的密码')
  else if (value.length < 8)
    return t('八位密码')
  else if (!upperLowerReg.test(value))
    return t('包含大小写')
  else if (!lastOneNumberReg.test(value))
    return t('至少一个数字')
  else if (value !== newPassword.value)
    return t('密码不一致')
  return ''
})

function fieldVerifyLoginPwd(value: string) {
  if (!value)
    return t('请输入新密码')
  else if (value.length < 8)
    return t('八位密码')
  else if (!upperLowerReg.test(value))
    return t('包含大小写')
  else if (!lastOneNumberReg.test(value))
    return t('至少一个数字')
  else if (repeatPassword.value)
    valiRepeatPassword()
  return ''
}

const {
  run: runMemberPasswordUpdate,
  loading: passwordUpdateLoading,
} = useRequest(ApiMemberPasswordUpdate, {
  onSuccess() {
    Message.success('更新密码成功')
    // 修改密码成功之后退出登陆
    runMemberLogout()
  },
})

// 提交登陆密码
async function submitLoginPwd() {
  pwdRef.value.setTouchTrue()
  newPwd.value.setTouchTrue()
  repeatPwd.value.setTouchTrue()
  await valiPassword()
  await valiNewPassword()
  await valiRepeatPassword()
  if (!(pwdErrorMsg.value || newPwdErrorMsg.value || repeatPwdErrorMsg.value)) {
    runMemberPasswordUpdate({
      password: password.value,
      new_password: newPassword.value,
    })
  }
}
</script>

<template>
  <AppPageLayout :title="t('登录密码')">
    <div class="bg-transparent rounded-[8px] p-[12px]">
      <AfunBaseLabel :label="t('当前登入密码')" required class="mb-[16px]">
        <AfunBaseInput
          ref="pwdRef"
          v-model="password"
          name="password"
          type="password"
          msg-after-touched
          :msg="pwdErrorMsg"
          required
          inputmode="number"
          :placeholder="$t('旧密码')"
        />
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('新密码')" required class="mb-[16px]">
        <AfunBaseInput
          ref="newPwd"
          v-model="newPassword"
          name="password"
          type="password"
          msg-after-touched
          :msg="newPwdErrorMsg"
          required
          inputmode="number"
          :placeholder="$t('新密码')"
        />
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('确认新密码')" required class="mb-[16px]">
        <AfunBaseInput
          ref="repeatPwd"
          v-model="repeatPassword"
          name="password"
          type="password"
          msg-after-touched
          :msg="repeatPwdErrorMsg"
          required
          inputmode="number"
          :placeholder="$t('确认新密码')"
        />
      </AfunBaseLabel>
      <div class="text-right">
        <RouterLink class="text-[14px] text-[#6D7693] font-[600] " to="/service">
          {{ t('忘记密码了') }}
        </RouterLink>
      </div>
      <AfunBaseButton type="primary" html-type="submit" :loading="passwordUpdateLoading" class="h-[42px] mt-[16px] w-full" style="--afun-base-button-font-size: 14px; --afun-base-button-font-weight: 500;" @click="submitLoginPwd">
        {{ t('确认') }}
      </AfunBaseButton>
    </div>
  </AppPageLayout>
</template>
