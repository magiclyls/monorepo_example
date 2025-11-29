<script setup lang='ts'>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'AppUser' })

const route = useRoute()

const isUserCenter = computed(() => route.name === 'UserCenter')
</script>

<template>
  <router-view />
</template>

<style lang='scss' scoped></style>
