<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppGlobalDialog from '~/components/AppGlobalDialog.vue'
import Home from '~/layouts/home.vue'
import WithMenu from '~/layouts/withMenu.vue'
import Other from './layouts/other.vue'

const route = useRoute()
</script>

<template>
  <WithMenu v-if="route.meta.layout === 'withMenu'" />
  <Other v-else-if="route.meta.layout === 'other'" />
  <Home v-else />
  <AppGlobalDialog />
</template>

<style lang="scss">
</style>
