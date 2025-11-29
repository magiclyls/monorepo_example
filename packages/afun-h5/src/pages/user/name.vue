<script setup lang='ts'>
import { ApiMemberUpdate } from '@tg/apis'
import { AfunBaseButton, AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppSettingCardWrap from '~/components/AppSettingCardWrap.vue'
import { Message } from '~/utils'

defineOptions({ name: 'AppUserName' })

const { t } = useI18n()
const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)
const { updateUserInfo } = appStore

const {
  value: name,
  errorMessage: nameErrorMsg,
  validate: valiName,
} = useField<string>('password', (value) => {
  if (!value)
    return t('请输入姓名')
  return ''
})
watch(userInfo, (_info) => {
  if (_info) {
    name.value = _info.real_name
  }
}, { immediate: true })
const { runAsync: runMemberUpdate, loading: loadingUpdate } = useRequest(ApiMemberUpdate, {
  onSuccess() {
    Message.success(t('修改成功'))
    updateUserInfo()
  },
})

// 提交
async function updateInfo() {
  await valiName()
  if (!nameErrorMsg.value) {
    runMemberUpdate({
      record: {
        real_name: name.value,
      },
      uid: userInfo.value?.uid,
    })
  }
}
</script>

<template>
  <AppPageLayout :title="t('姓名')">
    <AppSettingCardWrap>
      <AfunBaseLabel :label="t('真实姓名')" required class="mb-[16px]">
        <AfunBaseInput
          v-model="name" :placeholder="t('真实姓名')" :msg="t('真实姓名1')"
          style="--afun-base-input-padding-y:10px;"
        />
      </AfunBaseLabel>
      <AfunBaseButton class="w-full" :loading="loadingUpdate" style="--afun-base-button-padding-y:10px;" show-shadow @click="updateInfo">
        {{ t('确认') }}
      </AfunBaseButton>
    </AppSettingCardWrap>
  </AppPageLayout>
</template>

<style lang='scss' scoped>

</style>
