<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import AppHomeLayout from '../../../components/AppHomeLayout.vue'

const AppWinGoDetail = defineAsyncComponent(() => import('./main.vue'))
</script>

<template>
  <AppHomeLayout
    title="Win Go" :comp="AppWinGoDetail" type="bg"
  />
</template>
