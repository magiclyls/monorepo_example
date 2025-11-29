<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'

defineOptions({
  name: 'AppHomeLayout',
})
const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  title: '',
})
interface Props {
  showBg?: boolean
  showHeader?: boolean
  title?: string
  showBack?: boolean
  showDownloadBar?: boolean
}
const appHeaderRef = ref()
const route = useRoute()
const title = useTitle(props.title)
watch(() => props.title, (a) => {
  title.value = a
})
</script>

<template>
  <div class="w-full h-full">
    <AppHeader v-if="showHeader" ref="appHeaderRef" :show-back="showBack" :show-download-bar="showDownloadBar" />
    <div
      class="relative"
      :class="[!route.path.includes('games') && 'global-padding-bottom']"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.body-bg-img {
  background-repeat: no-repeat;
  background-position: top left;
  background-size: 390px 172px;
}
</style>
