<script setup lang='ts'>
import { application, delay } from '@tg/utils'

await application.allSettled([delay(500)])
</script>

<template>
  <slot />
</template>
