<script setup lang="ts">
import { ApiMemberUpload } from '@tg/apis'
import { IconUploadDelete, IconUniClose, IconChessFrame2 } from '@tg/icons';

interface Props {
  /** 上传图片用途 */
  imgType?: 'common'
  /** 禁用 */
  disabled?: boolean
  /** 可选文件类型 */
  accept?: string[]
  /** 可上传文件数量 */
  much?: number
  /** 上传文件大小，单位MB */
  size?: number
  /** 是否压缩转换成webp */
  isWebp?: boolean
}
defineOptions({
  name: 'BaseUpload',
})
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  imgType: 'common',
  disabled: false,
  accept: () => ['image/png', 'image/jpg'],
  much: 1,
  size: 10,
  isWebp: false,
})

const modelValue = defineModel('modelValue', { type: Array<string>, default: [] })

const { openNotify } = useNotify()
const { t } = useI18n()

const {
  data: fileUrl,
  run: runFileUpload,
  loading: fileUploadLoading,
} = useRequest(ApiMemberUpload, {
  onSuccess() {
    modelValue.value.push(fileUrl.value ?? '')
  },
})

function changFile(event: any) {
  const file = event.target.files[0]
  console.log(file, 'file')
  if (file) {
    if (props.accept.join(',').search(file.name.split('.').pop()) === -1) {
      // if (!props.accept.includes(file.type)) {
      const str = []
      for (const type of props.accept)
        str.push(type.split('/')[1])
      openNotify({
        type: 'error',
        title: t('notify_title_error'),
        message: t('image_upload_only', { ty: str.join('/') }),
      })
      event.target.value = ''
    }
    else if (file.size / 1024 / 1024 > props.size) {
      openNotify({
        type: 'error',
        title: t('notify_title_error'),
        message: t('image_upload_size', { size: `${props.size}MB` }),
      })
      event.target.value = ''
    }
    else {
      if (props.isWebp) {
        processFile(file).then((blob) => {
          runFileUpload({
            upload_type: 1,
            upload_file: new File([blob as Blob], `${new Date().getTime()}.webp`),
          })
        }).catch((err) => {
          openNotify({
            type: 'error',
            title: t('notify_title_error'),
            message: err.message,
          })
          event.target.value = ''
        })
      }
      else {
        runFileUpload({
          upload_type: 1,
          upload_file: file,
        })
      }
    }
    event.target.value = ''
  }
}
function deleteImg(index: number) {
  modelValue.value.splice(index, 1)
}
function processFile(file: File) {
  return new Promise((resolve, reject) => {
    const rawImage = new Image()
    rawImage.addEventListener('load', () => {
      resolve(rawImage)
    })
    rawImage.src = URL.createObjectURL(file)
  }).then((rawImage: any) => {
    // Convert image to webp ObjectURL via a canvas blob
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      let width, height
      if (rawImage.width > rawImage.height) {
        const rate = rawImage.width / 720
        width = 720
        height = rawImage.height / rate
      }
      else {
        const rate = rawImage.height / 720
        width = rawImage.width / rate
        height = 720
      }
      canvas.width = width
      canvas.height = height
      if (ctx) {
        ctx.drawImage(rawImage, 0, 0, width, height)
        canvas.toBlob((blob) => {
          resolve(blob)
        }, 'image/webp', 0.9)
      }
      else { reject(new Error(t('image_upload_failed'))) }
    })
  })
}
</script>

<template>
  <div class="base-upload">
    <div v-for="item, index of modelValue" :key="index" class="center upload-box upload-border">
      <BaseImage is-network :url="item" />
      <div class="icon-upload-delete">
        <BaseButton v-if="!disabled" type="text" size="none" @click.stop="deleteImg(index)">
          <IconUploadDelete name="upload-delete" class="text-[#fd3c13]"  />
        </BaseButton>
      </div>
    </div>
    <div v-if="modelValue.length < much" class="upload-border upload-box">
      <div v-show="!fileUploadLoading" class="center width-100">
        <slot name="icon">
          <IconUniClose name="uni-close" font-size="30px" style="transform: rotate(45deg)" />
        </slot>
      </div>
      <input class="width-100 input-file position-abs" type="file" :accept="accept.join(',')" :disabled="disabled"
        title="" @change="changFile">
      <div v-show="fileUploadLoading" class="width-100 position-abs center">
        <IconChessFrame2 name="chess-frame2" class="ani-roll" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --tg-base-upload-with: 80px;
  --tg-base-upload-height: 80px;
}
</style>

<style lang="scss" scoped>
.base-upload {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--tg-base-upload-with), var(--tg-base-upload-with)));
  gap: var(--tg-spacing-12);

  .upload-border {
    border: var(--tg-border-width-sm) solid var(--tg-border-color-main);
    border-radius: var(--tg-radius-default);
  }

  .position-abs {
    position: absolute;
    left: 0;
    top: 0;
  }
}

.upload-box {
  position: relative;
  width: var(--tg-base-upload-with);
  height: var(--tg-base-upload-height);
  overflow: hidden;
  background-color: var(--tg-primary-main);
  transition: var(--tg-transition);

  @include webTheme('green') {
    background: #055434;
    border-color: #197b59;
  }

  .icon-upload-delete {
    position: absolute;
    top: 0;
    right: 0;
  }

  &:hover {
    border-color: var(--tg-border-color-deep-grey);

    @include webTheme('green') {
      border-color: #3cb389;
    }
  }

  .width-100 {
    width: 100%;
    height: 100%;
  }

  .input-file {
    opacity: 0;
    cursor: pointer;
  }
}
</style>
