<script setup lang='ts'>
import { provide, ref } from 'vue'
import AppPageLayout from '~/components/AppPageLayout.vue'

defineOptions({ name: 'AppPolicies' })

const title = ref('Policies')

function setTitle(v: string) {
  title.value = v
}

provide('setTitle', setTitle)
</script>

<template>
  <AppPageLayout :title="title" style="--ph-page-layout-padding-x:0;--ph-page-layout-padding-y:8px;">
    <router-view />
  </AppPageLayout>
</template>

<style lang='scss' scoped></style>
