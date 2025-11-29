<script setup lang='ts'>
import { BaseAspectRatio, PhBaseLoading } from '@tg/bccomponents'
import { useWindowHeightRem } from '~/hooks'

defineOptions({ name: 'AppLoading' })

const props = withDefaults(defineProps<Props>(), {
  fullScreen: true,
})
const { heightRem } = useWindowHeightRem()
interface Props {
  height?: number
  fullScreen?: boolean
}
</script>

<template>
  <div class="w-full" :style="fullScreen ? { height: `${heightRem - 50}rem` } : {}">
    <div v-if="height && height > 0" class="content" :style="{ height: height && height > 0 ? `${height}rem` : '100%' }">
      <PhBaseLoading />
    </div>
    <BaseAspectRatio v-else ratio="2/1">
      <div class="content">
        <PhBaseLoading />
      </div>
    </BaseAspectRatio>
  </div>
</template>

<style lang='scss' scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
