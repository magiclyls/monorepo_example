<script setup lang='ts'>
import { ApiMemberFeedbackInsert, ApiMemberUpload } from '@tg/apis'
import { PhBaseButton, PhBaseImage } from '@tg/bccomponents'
import { IconUniDelete } from '@tg/icons'
import { useField } from 'vee-validate'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import BaseTextarea from '~/components/BaseTextarea.vue'
import { Message } from '~/utils'

defineOptions({ name: 'CreateFeedback' })
const { t } = useI18n()
const maxCount = 5
const maxSize = 10 * 1024 * 1024 // 10MB
const previewList = ref<string[]>([])

const {
  value: feedbackText,
  errorMessage: feedbackTextError,
  validate: feedbackTextValidate,
  meta: feedbacTextMeta,
  handleBlur,
  resetField,
} = useField<string>('feedbackText', (value) => {
  if (!value)
    return t('请输入反馈内容')
  if (value?.length > 200)
    return t('反馈内容200字以内')
  return ''
})

const {
  value: images,
  errorMessage: imageError,
  validate: imageValidate,
  meta: imageMeta,
} = useField<string[]>('images', (value) => {
  return ''
}, { initialValue: [] })

const {
  runAsync: runFeedbackInsert,
  loading: feedbackInsertLoading,
} = useRequest(ApiMemberFeedbackInsert, {
  onSuccess(res) {
    resetField()
    Message.success(res)
  },
})

const {
  data: fileUrl,
  runAsync: runFileUpload,
  loading: fileUploadLoading,
} = useRequest(ApiMemberUpload, {
  onSuccess(res) {
    console.log(res)
    images.value.push(res ?? '')
  },
})

async function submitFeedback() {
  handleBlur()
  await feedbackTextValidate()
  if (!feedbackTextError.value)
    runFeedbackInsert({ images: images.value.length ? JSON.stringify(images.value) : '', description: feedbackText.value })
}

// function removeEmojis(s: string) {
//   const regex = /(?:[\u2700-\u27BF]|(?:\uD83C[\uDDE6-\uDDFF]){2}|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u0023-\u0039]\uFE0F?\u20E3|\u3299|\u3297|\u303D|\u3030|\u24C2|\uD83C[\uDD70-\uDD71]|\uD83C[\uDD7E-\uDD7F]|\uD83C\uDD8E|\uD83C[\uDD91-\uDD9A]|\uD83C[\uDDE6-\uDDFF]|\uD83C[\uDE01-\uDE02]|\uD83C\uDE1A|\uD83C\uDE2F|\uD83C[\uDE32-\uDE3A]|\uD83C[\uDE50-\uDE51]|\u203C|\u2049|[\u25AA-\u25AB]|\u25B6|\u25C0|[\u25FB-\u25FE]|\u00A9|\u00AE|\u2122|\u2139|\uD83C\uDC04|[\u2600-\u26FF]|\u2B05|\u2B06|\u2B07|\u2B1B|\u2B1C|\u2B50|\u2B55|\u231A|\u231B|\u2328|\u23CF|[\u23E9-\u23F3]|[\u23F8-\u23FA]|\uD83C\uDCCF|\u2934|\u2935|[\u2190-\u21FF])/g
//   return s.replace(regex, ' ')
// }

function deleteImage(index: number) {
  images.value.splice(index, 1)
}

async function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files)
    return

  const newFiles: File[] = Array.from(files)

  for (const file of newFiles) {
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      Message.error('仅支持 PNG / JPG 格式')
      continue
    }

    if (file.size > maxSize) {
      Message.error(`单张不能超过10M：${file.name}`)
      continue
    }

    if (previewList.value.length >= maxCount) {
      Message.error('最多只能上传5张')
      break
    }

    const url = URL.createObjectURL(file)
    previewList.value.push(url)
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
  <div class="text-[#0D2245]">
    <div class="text-[16rem] font-[500] text-[#0D2245] mb-[8rem]">
      {{ t('反馈内容') }}<span class="text-[#F23038] ml-[2rem]">*</span>
    </div>
    <BaseTextarea v-model="feedbackText" :placeholder="t('反馈内容提示')" style="--ph-base-textarea-placeholder-color: #6d7693" @blur="handleBlur" />
    <div class="text-[#F23038] mt-[2rem]">
      {{ feedbackTextError }}
    </div>
    <div class="mt-[8rem] text-[14rem] font-[500] text-right text-[#6D7693]">
      {{ feedbackText?.length || 0 }}/200
    </div>
    <div class="my-[16rem]">
      <div class="text-[16rem] font-[500] text-[#0D2245]">
        {{ t('图片') }}
      </div>
      <div class="flex gap-[11rem] flex-wrap">
        <div v-for="(image, index) in images" :key="image" class="my-[8rem] bg-[#fff] border-[1rem] border-[#EBEBEB] rounded-[4rem] size-[80rem] flex justify-center items-center relative overflow-hidden">
          <PhBaseImage
            class="w-full h-full"
            fit="fill"
            is-network
            :url="image"
          />
          <div class="size-[12rem] rounded-[3rem] text-[8rem] bg-[#FF4D4F] absolute right-[3rem] top-[3rem] flex justify-center items-center" @click="deleteImage(index)">
            <IconUniDelete class="text-white" />
          </div>
        </div>
        <div class="my-[8rem] bg-[#fff] border-[1rem] border-[#EBEBEB] rounded-[4rem] size-[80rem] flex justify-center items-center relative">
          <div class="w-[5rem] h-[28rem] bg-[#9DABC8] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div class="h-[5rem] w-[28rem] bg-[#9DABC8] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <input
            type="file"
            accept="image/png,image/jpeg"
            class="opacity-0 w-full h-full"
            @change="onFileChange"
          >
        </div>
      </div>
    </div>
    <div class="text-[12rem] text-[#6D7693] font-[500]">
      {{ t('反馈上传图片限制') }}
    </div>
    <div class="text-[16rem] font-[500] text-[#0D2245] mb-[8rem] mt-[16rem]">
      {{ t('奖励规则') }}
    </div>
    <div class="mb-[16rem] text-[#6D7693]">
      {{ t('反馈奖励') }}
    </div>
    <div class="flex gap-[35rem]">
      <PhBaseButton type="secondary" class="w-full shadow-[0_2px_0_0_rgba(5,145,255,0.10)]" style="--ph-base-button-border-color: #F23038; --ph-base-button-secondary-background-color: rgba(242, 48, 56, 0.08); --ph-base-button-secondary-text-color: #F23038">
        {{ $t('取消') }}
      </PhBaseButton>
      <PhBaseButton html-type="submit" class="w-full" :loading="feedbackInsertLoading" :disabled="!!feedbackTextError || images.length > 5" @click="submitFeedback">
        {{ $t('提交') }}
      </PhBaseButton>
    </div>
  </div>
</template>
