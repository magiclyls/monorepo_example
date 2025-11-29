<script setup lang='ts'>
import { ApiMemberUpdate, ApiMemberUpload } from '@tg/apis'
import { PhBasePopup } from '@tg/bccomponents'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { Message } from '~/utils'

interface Props {
  modelValue: boolean
}
defineOptions({ name: 'AppUserAvatar' })
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)
const { updateUserInfo } = appStore
const maxSize = 10 * 1024 * 1024 // 10MB

const computedValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const albumInput = ref()
const cameraInput = ref()

function pickFromAlbum() {
  albumInput.value && albumInput.value.click()
}

function takePhoto() {
  cameraInput.value && cameraInput.value.click()
}
const url = ref()
watch(userInfo, (_info) => {
  if (_info) {
    url.value = _info.avatar_url
  }
}, { immediate: true })
const { runAsync: runMemberUpdate, loading: loadingUpdate } = useRequest(ApiMemberUpdate, {
  onSuccess() {
    Message.success(t('修改成功'))
    computedValue.value = false
    updateUserInfo()
  },
})
const {
  data: fileUrl,
  runAsync: runFileUpload,
  loading: fileUploadLoading,
} = useRequest(ApiMemberUpload, {
  onSuccess(res) {
    runMemberUpdate({
      record: {
        avatar_url: res,
      },
      uid: userInfo.value?.uid,
    })
  },
})
async function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files)
    return

  const newFiles: File[] = Array.from(files)

  for (const file of newFiles) {
    if (!['image/png', 'image/jpg'].includes(file.type)) {
      Message.error(t('仅支持 PNG / JPG 格式'))
      continue
    }

    if (file.size > maxSize) {
      Message.error(`${t('单张不能超过10M')}${file.name}`)
      continue
    }

    const url = URL.createObjectURL(file)
    runFileUpload({
      upload_type: 1,
      upload_file: file,
    })
  }

  // 清除 input 的值，保证同一张图可重复上传
  (e.target as HTMLInputElement).value = ''
}
</script>

<template>
  <div class="app-avatar">
    <!-- 头像、预览 -->
    <div>
      <!-- 相册 -->
      <input ref="albumInput" type="file" accept="image/*" style="display: none" @change="onFileChange">

      <!-- 拍照 -->
      <input
        ref="cameraInput" type="file" accept="image/*" capture="environment" style="display: none"
        @change="onFileChange"
      >
    </div>
    <PhBasePopup v-model="computedValue">
      <div class="w-full bg-[#fff] text-[#0D2245] rounded-t-[8rem] text-[14rem] font-[500]">
        <div
          class="h-[46rem] flex items-center justify-center border-b-[1px] border-solid border-[#EBEBEB]"
          @click="pickFromAlbum"
        >
          <span>{{ t('从相册中选择') }}</span>
        </div>
        <div class="h-[46rem] flex items-center justify-center" @click="takePhoto">
          <span>{{ t('拍照') }}</span>
        </div>
        <div class="w-full h-[16rem] bg-[#F6F7F8]" />
        <div class="h-[46rem] flex items-center justify-center" @click="computedValue = false">
          <span>{{ t('取消') }}</span>
        </div>
      </div>
    </PhBasePopup>
  </div>
</template>

<style lang="scss" scoped>

</style>
