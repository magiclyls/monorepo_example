<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import AppHomeLayout from '../../components/AppHomeLayout.vue'

const AppWinGo = defineAsyncComponent(() => import('./main.vue'))
</script>

<template>
  <AppHomeLayout title="Win Go" :comp="AppWinGo" router="exit" />
</template>
