<script lang="ts" setup>
import { getEnv } from '@tg/utils';

interface Props {
  url: string // 图像地址
  name?: string // 图像名称
  width?: string // 图像宽度px
  height?: string // 图像高度px
  fit?: 'contain' | 'fill' | 'cover' // 图像如何适应容器高度和宽度
  isCloud?: boolean
  isNetwork?: boolean
  objectPosition?: string
  loading?: 'eager' | 'lazy' // 保留 loading 属性
  shrink0?: boolean
  withTheme?: boolean
  active?: boolean
  imageDirectory?: string
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
  loading: 'lazy',
  withTheme: false,
  active: false,
  imageDirectory: 'images',
})

const emit = defineEmits(['clickImg', 'errorImg', 'loadImg'])

const { bool: hidden } = useBoolean(false)
const { VITE_CASINO_IMG_CLOUD_URL } = getEnv()
const appStore = useAppStore()
const suffix = document.documentElement.className.trim().split(' ').includes('webp')

const imgUrl = ref<string>('')
const changingTheme = ref(false)

const imgRef = ref<HTMLImageElement | null>(null)
let observer: IntersectionObserver | null = null

function loadImage() {
  if (props.loading === 'lazy') {
    if (imgRef.value)
      observer?.observe(imgRef.value)
  }
  else {
    if (imgRef.value)
      imgRef.value.src = imgUrl.value
  }
}

function onErrorImg() {
  if (changingTheme.value)
    return
  hidden.value = true
  emit('errorImg')
}

// 初始化 IntersectionObserver
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (imgRef.value)
            imgRef.value.src = imgUrl.value

          observer?.unobserve(entry.target) // 加载后停止观察
        }
      })
    },
    {
      rootMargin: '0px',
      threshold: 0.1, // 10% 可见时加载图片
    },
  )

  // 初始加载图片
  loadImage()
})

// 监听 url 的变化
watch(() => props.url, () => {
  hidden.value = false
  loadImage()
})

// 监听 theme 的变化
watch([() => appStore.theme, () => props.active], () => {
  if (imgRef.value && props.withTheme) {
    changingTheme.value = true
    hidden.value = true
    nextTick(() => {
      imgRef.value!.src = ''
      imgRef.value!.src = imgUrl.value
      hidden.value = false
      changingTheme.value = false
    })
  }
})

watch(
  [() => props.url, () => appStore.theme, () => props.active],
  ([newUrl, newTheme]) => {
    let imgTemURL = newUrl.replace('images', props.imageDirectory)
    if (props.withTheme) {
      const temArr = imgTemURL.split('.')
      if (['green', 'white'].includes(newTheme)) {
        if (props.active)
          temArr[temArr.length - 2] = `${temArr[temArr.length - 2]}_active_${newTheme}theme`
        else
          temArr[temArr.length - 2] = `${temArr[temArr.length - 2]}_${newTheme}theme`
      }
      // 后面传了黑绿后删除这里
      else if (newTheme === 'greenblack' && props.active) {
        temArr[temArr.length - 2] = `${temArr[temArr.length - 2]}_${newTheme}theme`
      }
      else {
        temArr[temArr.length - 2] = `${temArr[temArr.length - 2]}`
      }
      imgTemURL = temArr.join('.')
    }
    if (props.isCloud) {
      imgUrl.value = `${VITE_CASINO_IMG_CLOUD_URL}${imgTemURL.replace('%lang%', getCurrentLanguageForBackend())}`
    }
    else if (props.isNetwork) {
      imgUrl.value = `${application.getImgUrl(imgTemURL)}`
    }
    else {
      imgTemURL = suffix ? imgTemURL.replace(/png/g, 'webp') : imgTemURL
      imgUrl.value = `/stake/${imgTemURL}`
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (observer && imgRef.value)
    observer.unobserve(imgRef.value)
})
</script>

<template>
  <div class="base-image" :class="[hidden ? 'invisible' : '', shrink0 ? 'shrink0' : '']">
    <img
      ref="imgRef"
      :style="`width: ${width}; height: ${height};
      object-fit: ${fit};object-position:${objectPosition};`"
      :loading="loading"
      @load="emit('loadImg')"
      @click="emit('clickImg')"
      @error="onErrorImg"
    >
  </div>
</template>

<style>
:root {
  --tg-base-img-style-radius: var(--tg-radius-none);
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
