<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import AppHomeLayout from '../../../components/AppHomeLayout.vue'

const AppK3Detail = defineAsyncComponent(() => import('./main.vue'))
</script>

<template>
  <AppHomeLayout
    title="K3" :comp="AppK3Detail" type="bg"
  />
</template>
