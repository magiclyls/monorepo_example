<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import AppHomeLayout from '../../components/AppHomeLayout.vue'

const AppRacing = defineAsyncComponent(() => import('./main.vue'))
</script>

<template>
  <AppHomeLayout title="Racing" :comp="AppRacing" router="exit" />
</template>
