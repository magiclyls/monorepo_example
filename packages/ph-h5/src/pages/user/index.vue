<script setup lang='ts'>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppHomeLayout from '~/components/AppHomeLayout.vue'

defineOptions({ name: 'AppUser' })

const route = useRoute()

const isUserCenter = computed(() => route.name === 'UserCenter')
</script>

<template>
  <AppHomeLayout :show-header="false" :show-footer="isUserCenter">
    <router-view />
  </AppHomeLayout>
</template>

<style lang='scss' scoped></style>
