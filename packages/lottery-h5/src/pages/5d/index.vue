<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
import AppHomeLayout from '../../components/AppHomeLayout.vue'

defineOptions({ name: 'App5D' })

const mainCom = defineAsyncComponent(() => import('./main.vue'))
</script>

<template>
  <AppHomeLayout :comp="mainCom" title="5D" router="exit" />
</template>
