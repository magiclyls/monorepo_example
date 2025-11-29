<script lang="ts" setup>
import { getImgUrl } from '@tg/utils'
import { computed } from 'vue'

interface Props {
  url: string // 图像地址
  fit?: 'contain' | 'fill' | 'cover' // 图像如何适应容器高度和宽度
  isNetwork?: boolean
  objectPosition?: string
  loading?: 'eager' | 'lazy' // 保留 loading 属性
}
defineOptions({
  name: 'BaseImage',
})
const props = withDefaults(defineProps<Props>(), {
  url: '',
  fit: 'contain',
  objectPosition: 'center center',
  loading: 'eager',
})

document.documentElement.className.trim().split(' ').includes('webp')

const imgUrl = computed(() => {
  if (props.isNetwork)
    return `${getImgUrl(props.url)}`

  // return suffix ? props.url.replace(/png/g, 'webp') : props.url
  return props.url
})
</script>

<template>
  <img class="base-image" :src="imgUrl">
</template>

<style>

</style>

<style lang="scss" scoped>
.base-image {
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
}
</style>
