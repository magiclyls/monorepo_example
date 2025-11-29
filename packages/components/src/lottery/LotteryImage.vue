<script lang="ts" setup>
import { useBoolean } from '@tg/hooks'
import { IconError } from '@tg/icons'
import { application, getEnv, getImageUrl } from '@tg/utils'
import { getLangForBackend } from '@tg/vue-i18n'
import { useElementSize } from '@vueuse/core'
import { onMounted, ref, watch } from 'vue'

interface Props {
  url: string | undefined // 图像地址
  name?: string // 图像名称
  width?: string // 图像宽度px
  height?: string // 图像高度px
  fit?: 'contain' | 'fill' | 'cover' // 图像如何适应容器高度和宽度
  isCloud?: boolean
  isNetwork?: boolean
  objectPosition?: string
  // 是否修改图片路径 请勿乱使用
  changeSuffix?: boolean
  makeImageWhite?: boolean
}
defineOptions({
  name: 'LotteryImage',
})
const props = withDefaults(defineProps<Props>(), {
  url: '',
  name: '',
  width: '100%',
  height: '100%',
  fit: 'contain',
  objectPosition: 'center center',
  changeSuffix: true,
})
const emit = defineEmits(['clickImg', 'errorImg', 'loadImg'])
const { bool: hidden, setTrue, setFalse } = useBoolean(false)
const { VITE_CASINO_IMG_CLOUD_URL } = getEnv()

const imgUrl = ref<string>('')
const imgRef = ref<HTMLImageElement | null>(null)
const { width: imgWidth } = useElementSize(imgRef)

function loadImage() {
  if (hidden)
    setFalse()
  if (imgRef.value) {
    imgRef.value.src = imgUrl.value
  }
}

function onErrorImg() {
  setTrue()
  emit('errorImg')
}

onMounted(() => {
  loadImage()
})
watch(
  () => props.url,
  (newUrl) => {
    let baseUrl = `/lottery${newUrl}`

    if (props.isCloud) {
      baseUrl = `${VITE_CASINO_IMG_CLOUD_URL}${newUrl.replace('%lang%', getLangForBackend() || 'en_US')}`
    }
    if (props.isNetwork) {
      baseUrl = `${application.getImgUrl(newUrl)}`
    }
    if (!props.changeSuffix) {
      imgUrl.value = baseUrl
    }
    else if (!props.isCloud && !props.isNetwork) {
      imgUrl.value = getImageUrl(baseUrl)
    }
    else {
      imgUrl.value = baseUrl
    }

    loadImage()
  },
  { immediate: true },
)
</script>

<template>
  <div class="base-image">
    <img
      ref="imgRef"
      :class="[hidden ? 'invisible' : '', makeImageWhite && 'white']" :style="`width: ${width}; height: ${height};
      object-fit: ${fit};object-position:${objectPosition};`"
      @load="emit('loadImg')"
      @click="emit('clickImg')"
      @error="onErrorImg"
    >

    <div v-if="hidden" class="absolute top-0 left-0 w-full h-full center">
      <IconError :style="{ fontSize: `${imgWidth}rem` }" class="text-[#9dabc9]" />
    </div>
  </div>
</template>

<style>
:root {
  --tg-base-img-style-radius: 0;
  --tg-img-object-position: center;
  --tg-base-img-max-width: 100%;
  --tg-base-img-max-height: 100%;
}
</style>

<style lang="scss" scoped>
.shrink0 {
  flex-shrink: 0;
}

.base-image {
  position: relative;
  // width: 100%;
  // height: 100%;

  img {
    border-radius: var(--tg-base-img-style-radius);
    object-position: var(--tg-img-object-position);
    user-select: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
    max-width: var(--tg-base-img-max-width);
    max-height: var(--tg-base-img-max-height);
    &.white {
      filter: brightness(300%);
    }
  }
}
</style>
