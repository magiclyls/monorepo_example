<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { ref } from 'vue'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'

defineOptions({
  name: 'AppHomeLayout',
})
const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  showFooter: true,
})
interface Props {
  showBg?: boolean
  showHeader?: boolean
  showFooter?: boolean
}
const appHeaderRef = ref()
const appFooterRef = ref()
const { height: footerHeight } = useElementSize(appFooterRef)
</script>

<template>
  <div v-bg-image="showBg ? '/casino-head-bg' : ''" :class="{ 'body-bg-img': showBg }" class="w-full h-full">
    <AppHeader v-if="showHeader" ref="appHeaderRef" show-bg />
    <div
      :style="{
        paddingBottom: `${footerHeight}px`,
      }"
    >
      <slot />
    </div>
    <AppFooter v-if="showFooter" ref="appFooterRef" />
  </div>
</template>

<style lang="scss" scoped>
.body-bg-img {
  background-repeat: no-repeat;
  background-position: top left;
  background-size: 390px 172px;
}
</style>
