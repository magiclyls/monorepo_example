<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import AppHomeLayout from '../../components/AppHomeLayout.vue'

const AppTrxWinGo = defineAsyncComponent(() => import('./main.vue'))
</script>

<template>
  <AppHomeLayout title="Trx Win Go" :comp="AppTrxWinGo" router="exit" />
</template>
