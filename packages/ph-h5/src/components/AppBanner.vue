<script setup lang='ts'>
import { PhBaseBanner } from '@tg/bccomponents'
import { useBanner } from '@tg/hooks'
import { application } from '@tg/utils'
import { inject, ref } from 'vue'

interface Props {
  type?: 'casino' | 'sports'
}

defineOptions({ name: 'AppBanner' })
const props = withDefaults(defineProps<Props>(), {
  type: 'casino',
})
const isResolved = inject('isResolved', ref(false))

const { bannerList, fetchDataOrLoadImage } = useBanner()

await application.allSettled([fetchDataOrLoadImage(props.type)])
</script>

<template>
  <div>
    <PhBaseBanner v-if="bannerList?.length && isResolved " :items="bannerList" />
  </div>
</template>

<style lang='scss' scoped>

</style>
