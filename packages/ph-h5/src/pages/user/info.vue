<script setup lang='ts'>
import { PhBaseImage } from '@tg/bccomponents'
import { IconUniArrowDown1, IconUniCopy, IconUniEdit } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppSettingCardWrap from '~/components/AppSettingCardWrap.vue'
import { copyTest } from '~/utils'
import Avatar from './avatar.vue'

defineOptions({ name: 'AppUserInfo' })
const defaultAvator = '/ph-h5/png/avatar.png'
const { t } = useI18n()
const { userInfo } = storeToRefs(useAppStore())
const { push } = useRouter()

const url = computed(() => userInfo.value?.avatar_url)

const showUpload = ref(false)
</script>

<template>
  <AppPageLayout :title="t('个人资料')">
    <AppSettingCardWrap class="mb-[16rem]">
      <div class="w-full  flex items-center relative justify-center">
        <span
          class="text-[#0D2245] text-[14rem] font-[500] absolute left-0 top-0 leading-[20rem] capitalize"
        >{{
          t('个人资料照片') }}</span>
        <div class="relative">
          <div class="w-[58rem] h-[58rem] rounded-full overflow-hidden" @click="showUpload = true">
            <PhBaseImage v-if="url" class="w-full h-full" :url="url" is-network :change-suffix="false" />
            <PhBaseImage v-else class="w-full h-full" :url="defaultAvator" />
          </div>
          <div
            class="w-[16rem] h-[16rem] bg-[#F23038] text-[7.58rem] rounded-full absolute right-[1.5rem] flex items-center justify-center bottom-[1rem]"
          >
            <IconUniEdit class="text-white" />
          </div>
        </div>
      </div>
    </AppSettingCardWrap>

    <AppSettingCardWrap style="--ph-setting-card-padding-y:0;">
      <div
        class="w-full h-[46rem] flex items-center text-[14rem] capitalize font-[500] text-[#0D2245] justify-between"
        style="border-bottom: 1px solid #ebebeb;"
      >
        <span>{{ t('账号') }}</span>
        <div class="flex items-center">
          <span class="mr-[10rem]">{{ userInfo?.username }}</span>
          <div class="flex items-center cursor-pointer" @click="copyTest(userInfo?.username ?? '')">
            <IconUniCopy class="text-[#9dabc9]" />
          </div>
        </div>
      </div>
      <div
        class="w-full h-[46rem] flex items-center text-[14rem] capitalize font-[500] text-[#0D2245] justify-between"
        style="border-bottom: 1px solid #ebebeb;"
      >
        <span>{{ t('kYC验证') }}</span>
        <div class="flex items-center">
          <span class="mr-[4rem] text-[#6D7693]">{{ t('未验证') }}</span>
          <IconUniArrowDown1 class="rotate-[-90deg] text-[16rem] text-[#9dabc9]" />
        </div>
      </div>
      <div
        class="w-full h-[46rem] flex items-center text-[14rem] capitalize font-[500] text-[#0D2245] justify-between"
        style="border-bottom: 1px solid #ebebeb;" @click="push('/user/name')"
      >
        <span>{{ t('姓名') }}</span>
        <div class="flex items-center">
          <span class="mr-[4rem]">{{ t('设置') }}</span>
          <IconUniArrowDown1 class="rotate-[-90deg] text-[16rem] text-[#9dabc9]" />
        </div>
      </div>
      <div
        class="w-full h-[46rem] flex items-center text-[14rem] capitalize font-[500] text-[#0D2245] justify-between"
        style="border-bottom: 1px solid #ebebeb;" @click="push('/user/gender')"
      >
        <span>{{ t('性别') }}</span>
        <div class="flex items-center">
          <span class="mr-[4rem]">{{ t('设置') }}</span>
          <IconUniArrowDown1 class="rotate-[-90deg] text-[16rem] text-[#9dabc9]" />
        </div>
      </div>
      <div
        class="w-full h-[46rem] text-[14rem] capitalize font-[500] text-[#0D2245] flex items-center justify-between"
        @click="push('/user/nationality')"
      >
        <span>{{ t('国籍') }}</span>
        <div class="flex items-center">
          <span class="mr-[4rem]">{{ t('设置') }}</span>
          <IconUniArrowDown1 class="rotate-[-90deg] text-[16rem] text-[#9dabc9]" />
        </div>
      </div>
      <Avatar v-model="showUpload" />
    </AppSettingCardWrap>
  </AppPageLayout>
</template>
