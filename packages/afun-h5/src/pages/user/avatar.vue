<script setup lang='ts'>
import { AfunBaseLoading, AfunBasePopup, BaseAvatarUpload } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotify } from '~/hooks'

interface Props {
  modelValue: boolean
}
defineOptions({ name: 'AppUserAvatar' })
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])
const { openNotify } = useNotify()

const { t } = useI18n()
const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)
const { updateUserInfo } = appStore
const { bool: imgLoading } = useBoolean(false)

const computedValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const baseAvatarUploadRef = ref()
const url = ref()

watch(userInfo, (_info) => {
  if (_info) {
    url.value = _info.avatar_url
  }
}, { immediate: true })

function pickFromAlbum() {
  baseAvatarUploadRef.value && baseAvatarUploadRef.value.pickFromAlbum()
}

function takePhoto() {
  baseAvatarUploadRef.value && baseAvatarUploadRef.value.takePhoto()
}

function onOversize() {
  openNotify({
    type: 'error',
    message: t('单张不能超过600KB'),
  })
}
function onSuccess() {
  openNotify({
    type: 'success',
    message: t('修改成功'),
  })
  computedValue.value = false
  updateUserInfo()
}
</script>

<template>
  <div class="app-avatar">
    <!-- 头像、预览 -->
    <BaseAvatarUpload
      ref="baseAvatarUploadRef" v-model:loading="imgLoading" :uid="userInfo?.uid ?? ''"
      @oversize="onOversize" @success="onSuccess"
    />
    <AfunBasePopup v-model="computedValue">
      <div class="w-full bg-[#1A2C38] text-[#fff] rounded-t-[8px] text-[14px] font-[600]">
        <div
          class="h-[46px] flex items-center justify-center border-b-[1px] border-solid border-[#2F4553]"
          @click="pickFromAlbum"
        >
          <span>{{ t('从相册中选择') }}</span>
        </div>
        <div class="h-[46px] flex items-center justify-center" @click="takePhoto">
          <span>{{ t('拍照') }}</span>
        </div>
        <div class="w-full h-[16px] bg-[#0F212E]" />
        <div class="h-[46px] flex items-center justify-center" @click="computedValue = false">
          <span>{{ t('取消') }}</span>
        </div>
      </div>

      <div v-if="imgLoading" class="fixed top-0 bg-[#0009] left-0 w-full h-full flex items-center justify-center">
        <AfunBaseLoading />
      </div>
    </AfunBasePopup>
  </div>
</template>

<style lang="scss" scoped>

</style>
