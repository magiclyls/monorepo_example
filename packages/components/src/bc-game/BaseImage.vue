<script lang="ts" setup>
import { useBoolean } from '@tg/hooks'
import { application, getEnv } from '@tg/utils'
import { getLangForBackend } from '@tg/vue-i18n'
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
}
defineOptions({
  name: 'BaseImage',
})
const props = withDefaults(defineProps<Props>(), {
  url: '',
  name: '',
  width: '100%',
  height: '100%',
  fit: 'contain',
  objectPosition: 'center center',
})

const emit = defineEmits(['clickImg', 'errorImg', 'loadImg'])

const { bool: hidden, setTrue } = useBoolean(false)
const { VITE_CASINO_IMG_CLOUD_URL } = getEnv()

const isAvif = document.documentElement.className.trim().split(' ').includes('avif')
const isWebp = document.documentElement.className.trim().split(' ').includes('webp')

const imgUrl = ref<string>('')
const imgRef = ref<HTMLImageElement | null>(null)

function loadImage() {
  if (imgRef.value) {
    imgRef.value.src = imgUrl.value
  }
}

function onErrorImg() {
  setTrue()
  emit('errorImg')
}
function changeEndName(url: string) {
  if (isAvif) {
    return url.replace(/png/g, 'avif')
  }
  if (isWebp) {
    return url.replace(/png/g, 'webp')
  }
  return url
}

onMounted(() => {
  loadImage()
})
watch(
  () => props.url,
  (newUrl) => {
    let baseUrl = newUrl

    if (props.isCloud) {
      baseUrl = `${VITE_CASINO_IMG_CLOUD_URL}${newUrl.replace('%lang%', getLangForBackend())}`
    }
    if (props.isNetwork) {
      baseUrl = `${application.getImgUrl(newUrl)}`
    }

    if (!props.isCloud && !props.isNetwork)
      imgUrl.value = changeEndName(baseUrl)
    else
      imgUrl.value = baseUrl.replace(/png/g, 'webp')

    loadImage()
  },
  { immediate: true },
)
</script>

<template>
  <div class="base-image" :class="[hidden ? 'invisible' : '']">
    <img
      ref="imgRef" :style="`width: ${width}; height: ${height};
      object-fit: ${fit};object-position:${objectPosition};`" @load="emit('loadImg')"
      @click="emit('clickImg')" @error="onErrorImg"
    >
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
  }
}
</style>
