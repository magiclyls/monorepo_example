<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import AppHomeLayout from '../../../components/AppHomeLayout.vue'

const AppRacingDetail = defineAsyncComponent(() => import('./main.vue'))
</script>

<template>
  <AppHomeLayout
    title="Racing" :comp="AppRacingDetail" type="bg"
  />
</template>
