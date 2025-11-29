<script lang="ts" setup>
import { computed } from 'vue'
import BaseImage from './BaseImage.vue'

interface Props {
  description?: string
  icon?: string
}
defineOptions({
  name: 'BaseEmpty',
})
const props = withDefaults(defineProps<Props>(), {
  showDescription: true,
  icon: '/empty.png',
})

const emptyDescription = computed(
  () => props.description || '哎呀還沒有資料！',
)
</script>

<template>
  <div class="base-empty py-10">
    <div class="flex">
      <slot v-if="$slots.icon" name="icon" />
      <BaseImage class="w-48 h-48" :url="icon" />
    </div>
    <div class="mt-4">
      <slot v-if="$slots.description" name="description" />
      <p v-else>
        {{ emptyDescription }}
      </p>
    </div>
    <div v-if="$slots.default" class="base-empty-extra">
      <slot />
    </div>
  </div>
</template>

<style>
</style>

<style lang="scss" scoped>
.base-empty {
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
