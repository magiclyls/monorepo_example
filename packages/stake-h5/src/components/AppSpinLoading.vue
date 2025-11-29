<script setup lang='ts'>
import { IconUniSpin } from '@tg/icons'

defineOptions({ name: 'AppSpinLoading' })
</script>

<template>
  <div class="h-[19px] w-[19px] flex origin-center animate-spin items-end justify-end text-[19px]">
    <IconUniSpin />
  </div>
</template>

<style lang='scss' scoped>
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
.animate-spin {
    animation: spin 4s linear infinite;
}
</style>
