<script setup>
import { RouterView } from 'vue-router'
import { getconfig, useLineData } from './hooks'

const { siteName } = useLineData()
document.title = siteName.value
getconfig()
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
