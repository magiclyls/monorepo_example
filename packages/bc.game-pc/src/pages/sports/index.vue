<script setup lang="ts">
import { useLocalRouter } from '@tg/shared-router'

const router = useLocalRouter()
</script>

<template>
  <div>
    <div @click="router.push('/casino')">
      去娱乐城
    </div>
  </div>
</template>
