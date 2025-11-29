<script lang="ts" setup>
import { ApiMemberPasswordUpdate } from '@tg/apis'
import { PhBaseButton, PhBaseInput, PhBaseLabel } from '@tg/bccomponents'
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
    <div class="bg-white rounded-[8rem] p-[12rem]">
      <PhBaseLabel :label="t('当前登入密码')" required class="mb-[16rem]">
        <PhBaseInput
          ref="pwdRef"
          v-model="password"
          name="password"
          type="password"
          msg-after-touched
          :msg="pwdErrorMsg"
          required
          inputmode="number"
          :placeholder="$t('旧密码')"
          style="--ph-base-input-padding-y: 9rem;"
        />
      </PhBaseLabel>
      <PhBaseLabel :label="t('新密码')" required class="mb-[16rem]">
        <PhBaseInput
          ref="newPwd"
          v-model="newPassword"
          name="password"
          type="password"
          msg-after-touched
          :msg="newPwdErrorMsg"
          required
          inputmode="number"
          :placeholder="$t('新密码')"
          style="--ph-base-input-padding-y: 9rem;"
        />
      </PhBaseLabel>
      <PhBaseLabel :label="t('确认新密码')" required class="mb-[16rem]">
        <PhBaseInput
          ref="repeatPwd"
          v-model="repeatPassword"
          name="password"
          type="password"
          msg-after-touched
          :msg="repeatPwdErrorMsg"
          required
          inputmode="number"
          :placeholder="$t('确认新密码')"
          style="--ph-base-input-padding-y: 9rem;"
        />
      </PhBaseLabel>
      <div class="text-right">
        <RouterLink class="text-[14rem] text-[#6D7693] font-[500] " to="/service">
          {{ t('忘记密码了') }}
        </RouterLink>
      </div>
      <PhBaseButton type="primary" html-type="submit" :loading="passwordUpdateLoading" class="h-[44rem] mt-[16rem] w-full" style="--ph-base-button-font-size: 14rem; --ph-base-button-font-weight: 500; --ph-base-button-border-color: #EBEBEB;--ph-base-button-secondary-background-color:#fff" @click="submitLoginPwd">
        {{ t('保存') }}
      </PhBaseButton>
    </div>
  </AppPageLayout>
</template>
