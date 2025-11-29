<script setup lang='ts'>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseImage from '../BaseImage.vue'

interface Props {
  description?: string
  img?: string
}

defineOptions({ name: 'AfunBaseEmpty' })
const props = defineProps<Props>()

const { t } = useI18n()

const _description = computed(() => {
  return props.description ?? t('暂无内容')
})
const _img = computed(() => {
  return props.img ?? '/ph-h5/png/message-empty.png'
})
</script>

<template>
  <div class="w-full flex flex-col items-center gap-[8px]">
    <slot name="icon">
      <BaseImage class="w-[80px]" :url="_img" :style="props.img ? '--tg-base-img-max-width: 100%' : '--tg-base-img-max-width: 260px'" />
    </slot>
    <div class="text-[#B1BAD3] text-[14px] font-[600] leading-[20px]">
      <slot name="description">
        <span> {{ _description }}</span>
      </slot>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
