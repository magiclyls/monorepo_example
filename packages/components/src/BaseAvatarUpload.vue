<script setup lang='ts'>
import { ApiMemberUpdate, ApiMemberUpload } from '@tg/apis'
import { avatarUpload } from '@tg/utils'
import { ref } from 'vue'
import { useRequest } from 'vue-request'

interface Props {
  loading: boolean
  uid: string
}

defineOptions({ name: 'BaseAvatarUpload' })
const props = defineProps<Props>()
const emit = defineEmits(['oversize', 'update:loading', 'success'])

const { runAsync: runMemberUpdate } = useRequest(ApiMemberUpdate, {
  onSuccess() {
    emit('success')
  },
})
const {
  runAsync: runFileUpload,
} = useRequest(ApiMemberUpload, {
  onSuccess(res) {
    runMemberUpdate({
      record: {
        avatar_url: res,
      },
      uid: props.uid,
    })
  },
  onAfter() {
    emit('update:loading', false)
  },
})

const albumInput = ref()
const cameraInput = ref()

function pickFromAlbum() {
  albumInput.value && albumInput.value.click()
}

function takePhoto() {
  cameraInput.value && cameraInput.value.click()
}

// 选择图片并上传
async function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files)
    return

  const newFiles: File[] = Array.from(files)

  for (const file of newFiles) {
    emit('update:loading', true)
    // 转换格式
    const normalizeFile = await avatarUpload.normalizeImageFile(file)

    // 压缩
    const compressedFile = await avatarUpload.compressFile(normalizeFile)

    if (compressedFile.size > avatarUpload.maxSizeMB) {
      emit('oversize')
      emit('update:loading', false)
      continue
    }

    runFileUpload({
      upload_type: 1,
      upload_file: compressedFile,
    })
  }

  // 清除 input 的值，保证同一张图可重复上传
  (e.target as HTMLInputElement).value = ''
}

defineExpose({
  /** 选择相册 */
  pickFromAlbum,
  /** 选择相机 */
  takePhoto,
})
</script>

<template>
  <div>
    <!-- 相册 -->
    <input ref="albumInput" type="file" accept="image/*" style="display: none" @change="onFileChange">

    <!-- 拍照 -->
    <input
      ref="cameraInput" type="file" accept="image/*" capture="environment" style="display: none"
      @change="onFileChange"
    >
  </div>
</template>

<style lang='scss' scoped>

</style>
