<script lang="ts" setup>
import { BaseAspectRatio } from '@tg/bccomponents'
import { useWindowStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import BaseSkeleton from './BaseSkeleton.vue'

defineOptions({
  name: 'AppCardListSkeleton',
})
const props = defineProps<{ list?: any[], isProvider?: boolean }>()

const { isMobile } = storeToRefs(useWindowStore())

const sliderOuter = ref()
const galleryClass = ref('')

const style = computed(() => {
  const obj: any = {}
  if (props.isProvider)
    obj.gap = '32rem 16rem'
  return obj
})

watchEffect(() => {
  if (isMobile.value)
    galleryClass.value = 'card-list-1150'
  else
    galleryClass.value = 'card-list-500'
})
</script>

<template>
  <div
    ref="sliderOuter"
    class="card-list"
    :class="[galleryClass, isProvider ? 'card-list-provider' : '']"
    :style="style"
  >
    <BaseAspectRatio v-for="i in 5" :key="i" ratio="334/447">
      <BaseSkeleton animated="ani-opacity" width="100%" height="100%" />
    </BaseAspectRatio>
  </div>
</template>

<style lang="scss" scoped>
.card-list {
  display: grid;
  grid-gap: 2rem 1rem;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  &-1150 {
    grid-template-columns: repeat(8, 1fr);
    gap: 20px 10px;
  }
  &-1150-1000 {
    grid-template-columns: repeat(7, 1fr);
    gap: 30px 15px;
  }
  &-1000-850 {
    grid-template-columns: repeat(6, 1fr);
    gap: 30px 15px;
  }
  &-850-700 {
    grid-template-columns: repeat(5, 1fr);
    gap: 30px 15px;
  }
  &-700-500 {
    grid-template-columns: repeat(4, 1fr);
    gap: 10px 5px;
  }
  &-500 {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px 5px;
  }
  &.card-list-provider {
    &.card-list-1150 {
      grid-template-columns: repeat(7, 1fr);
    }
    &.card-list-1150-1000 {
      grid-template-columns: repeat(7, 1fr);
    }
    &.card-list-1000-850 {
      grid-template-columns: repeat(7, 1fr);
    }
    &.card-list-850-700 {
      grid-template-columns: repeat(5, 1fr);
    }
    &.card-list-700-500 {
      grid-template-columns: repeat(4, 1fr);
    }
    &.card-list-500 {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
