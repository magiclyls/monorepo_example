<script setup lang='ts'>
import { ApiMemberUpdate } from '@tg/apis'
import { AfunBaseButton, AfunBaseCell } from '@tg/bccomponents'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppPageLayout from '~/components/AppPageLayout.vue'
import { Message } from '~/utils'

defineOptions({ name: 'AppUserGender' })

const { t } = useI18n()
const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)
const { updateUserInfo } = appStore
const gender = ref('1')
watch(userInfo, (_info) => {
  if (_info) {
    gender.value = _info.gender
  }
}, { immediate: true })
const list = [
  { label: t('男性'), value: '1' },
  { label: t('女性'), value: '2' },
  { label: t('其他'), value: '3' },
]

function onClick(v: string) {
  console.log('🚸🚸🚸 ~ onClick ~ v:', v)
  gender.value = v
}

const { runAsync: runMemberUpdate, loading: loadingUpdate } = useRequest(ApiMemberUpdate, {
  onSuccess() {
    Message.success(t('修改成功'))
    updateUserInfo()
  },
})

// 提交
async function updateInfo() {
  runMemberUpdate({
    record: {
      gender: gender.value,
    },
    uid: userInfo.value?.uid,
  })
}
</script>

<template>
  <AppPageLayout :title="t('性别')">
    <AfunBaseCell v-for="item in list" :key="item.value" class="mb-[8px]" @click="onClick(item.value)">
      <template #title>
        <span class="font-[500]">{{ item.label }}</span>
      </template>
      <template #right>
        <div v-if="item.value === gender" class="shadow-[0_1px_3px_0_rgba(0,0,0,0.20),0_1px_2px_0_rgba(0,0,0,0.12)] bg-[#fff] h-[20px] shrink-0 border-[4px] border-[#2F4553] rounded-full w-[20px]" />
        <div v-else class="shadow-[0_1px_3px_0_rgba(0,0,0,0.20),0_1px_2px_0_rgba(0,0,0,0.12)] h-[20px] shrink-0 border-[2px] border-[#2F4553] rounded-full w-[20px]" />
      </template>
    </AfunBaseCell>
    <AfunBaseButton class="w-full mt-[16px]" :loading="loadingUpdate" style="--afun-base-button-padding-y:10px;" show-shadow @click="updateInfo">
      {{ t('确认') }}
    </AfunBaseButton>
  </AppPageLayout>
</template>

<style lang='scss' scoped>
.radio-group {
  --tg-radio-group-style-gap-vertical: 0;
  --tg-base-radio-style-flex-direction: row-reverse;
  --tg-base-radio-style-just-content: space-between;
}
.have-border {
  border-bottom: 1px solid #2f4553;
}
.dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #557086;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  .active {
    width: 10px;
    height: 10px;
    background-color: #ffff;
    border-radius: 50%;
  }
}
</style>
