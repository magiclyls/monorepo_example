<script setup lang='ts'>
import { AfunBaseCell, AfunBaseImage } from '@tg/bccomponents'
import { IconUniCopy, IconUniEdit } from '@tg/icons'
import { useAppStore, useBrandStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppSettingCardWrap from '~/components/AppSettingCardWrap.vue'
import { copyTest } from '~/utils'
import Avatar from './avatar.vue'

defineOptions({ name: 'AppUserInfo' })
const defaultAvator = '/m/afun-h5/png/avatar.png'
const { t } = useI18n()
const { userInfo, isCompleteKYC } = storeToRefs(useAppStore())
const { isKYCVerifyOpen } = storeToRefs(useBrandStore())
const { push } = useRouter()

const url = computed(() => userInfo.value?.avatar_url)

const showUpload = ref(false)

const settings = computed(() => {
  return [
    isKYCVerifyOpen.value
      ? {
          title: t('kYC验证'),
          status: isCompleteKYC.value ? t('已验证') : t('未验证'),
          path: '/user/kyc',
        }
      : undefined,
    { title: t('姓名'), path: '/user/name' },
    { title: t('性别'), path: '/user/gender' },
    { title: t('国籍'), path: '/user/nationality' },
  ].filter(a => a !== void 0)
})
</script>

<template>
  <AppPageLayout :title="t('个人资料')">
    <AppSettingCardWrap class="mb-[16px] shadow-[0_1px_3px_0_rgba(0,0,0,0.20),0_1px_2px_0_rgba(0,0,0,0.12)]">
      <div class="w-full  flex items-center relative justify-center">
        <span
          class="text-[#fff] text-[14px] font-[600] absolute left-0 top-0 leading-[20px] capitalize"
        >{{
          t('个人资料照片') }}</span>
        <div class="relative">
          <div class="w-[58px] h-[58px] rounded-full overflow-hidden" @click="showUpload = true">
            <AfunBaseImage v-if="url" class="w-full h-full" :url="url" is-network :change-suffix="false" />
            <AfunBaseImage v-else class="w-full h-full" :url="defaultAvator" />
          </div>
          <div
            class="w-[16px] h-[16px] bg-[#F23038] text-[7.58px] rounded-full absolute right-[1.5px] flex items-center justify-center bottom-[1px]"
          >
            <IconUniEdit class="text-white" />
          </div>
        </div>
      </div>
    </AppSettingCardWrap>
    <AfunBaseCell class="mb-[8px]">
      <template #title>
        <span class="text-[14px] font-[500]">{{ t('账号') }}</span>
      </template>
      <template #right>
        <div class="flex items-center">
          <span class="mr-[10px] font-[500] text-[14px]">{{ userInfo?.username }}</span>
          <IconUniCopy class="text-[#B1BAD3] text-[16px]" @click="copyTest(userInfo?.username ?? '')" />
        </div>
      </template>
    </AfunBaseCell>
    <AfunBaseCell v-for="value in settings" :key="value.title" class="mb-[8px]" arrow @click="push(value.path)">
      <template #title>
        <span class="text-[14px] font-[500]">{{ value.title }}</span>
      </template>
      <template v-if="value.status" #right>
        <span class="font-[500] text-[14px] text-[#B1BAD3]">{{ value.status }}</span>
      </template>
    </AfunBaseCell>
    <Avatar v-model="showUpload" />
  </AppPageLayout>
</template>
