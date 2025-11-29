<script setup>
import { isMobile } from '../../hooks'
import H5 from './h5.vue'
import Pc from './pc.vue'

const isH5 = isMobile()
</script>

<template>
  <H5 v-if="isH5" />
  <Pc v-else />
</template>
