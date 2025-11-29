<script setup lang='ts'>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseImage from '../BaseImage.vue'

interface Props {
  description?: string
  img?: string
}

defineOptions({ name: 'PhBaseEmpty' })
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
  <div class="w-fll flex flex-col items-center">
    <slot name="icon">
      <BaseImage :url="_img" :style="props.img ? '--tg-base-img-max-width: 100%' : '--tg-base-img-max-width: 260rem'" />
    </slot>

    <div class="mt-[16rem] text-[#6D7693] text-[14rem] font-[500] leading-[20rem]">
      <slot name="description">
        <span> {{ _description }}</span>
      </slot>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
