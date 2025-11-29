<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import AppHomeLayout from '../../../components/AppHomeLayout.vue'

defineOptions({ name: 'App5DDetail' })

const comp = defineAsyncComponent(() => import('./main.vue'))
</script>

<template>
  <AppHomeLayout
    title="5D" :comp="comp" type="bg"
  />
</template>
