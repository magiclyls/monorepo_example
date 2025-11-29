<script lang="ts" setup>
import { BaseButton, BaseIcon } from '@tg/bccomponents'

defineOptions({
  name: 'AppThirdLogin',
})
</script>

<template>
  <div class="grid grid-cols-4 gap-4 mb-5">
    <BaseButton type="none" class="border-1 border-[#3A4142]">
      <BaseIcon name="facebook" />
    </BaseButton>
    <BaseButton type="none" class="border-1 border-[#3A4142]">
      <BaseIcon name="google" />
    </BaseButton>
    <BaseButton type="none" class="border-1 border-[#3A4142]">
      <BaseIcon name="line" />
    </BaseButton>
    <BaseButton type="none" class="border-1 border-[#3A4142]">
      <BaseIcon name="twitch" />
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>

</style>
