<script setup lang='ts'>
import { ApiMemberUpdate } from '@tg/apis'
import { PhBaseButton } from '@tg/bccomponents'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppSettingCardWrap from '~/components/AppSettingCardWrap.vue'
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
    <AppSettingCardWrap>
      <div
        v-for="item, i in list" :key="item.value"
        class="flex items-center justify-between  h-[46rem] text-[14rem] font-[500] text-[#0D2245]"
        :class="{ 'have-border': i !== list.length - 1 }"
        @click="onClick(item.value)"
      >
        <span>{{ item.label }}</span>
        <div class="dot">
          <div :class="{ active: item.value === gender }" />
        </div>
      </div>
      <PhBaseButton class="w-full mt-[16rem]" :loading="loadingUpdate" style="--ph-base-button-padding-y:10rem;" show-shadow @click="updateInfo">
        {{ t('确认') }}
      </PhBaseButton>
    </AppSettingCardWrap>
  </AppPageLayout>
</template>

<style lang='scss' scoped>
.have-border {
  border-bottom: 1px solid #ebebeb;
}
.dot {
  width: 20rem;
  height: 20rem;
  border-radius: 50%;
  border: 2rem solid #ebebeb;
  display: flex;
  justify-content: center;
  align-items: center;
  .active {
    width: 10rem;
    height: 10rem;
    background-color: #f23038;
    border-radius: 50%;
  }
}
</style>
