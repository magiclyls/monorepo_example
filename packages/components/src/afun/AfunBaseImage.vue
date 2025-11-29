<script setup lang='ts'>
import BaseImage from '../BaseImage.vue'

interface Props {
  imageDirectory?: string
  sportDirectory?: string
  url: string | undefined
}

defineOptions({ name: 'AfunBaseImage' })

const props = withDefaults(defineProps<Props>(), {
  imageDirectory: 'images-af',
  sportDirectory: 'sports-ph',
})
</script>

<template>
  <BaseImage :url="url" v-bind="$attrs" :image-directory="imageDirectory" :sport-directory="sportDirectory" />
</template>

<style lang='scss' scoped>

</style>
