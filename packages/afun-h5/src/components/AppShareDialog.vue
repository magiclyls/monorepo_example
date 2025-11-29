<script lang="ts" setup>
import { useAffiliate } from '@tg/stores'
import { useBrowserLocation } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import AppApplicationSharing from './AppApplicationSharing.vue'
import AppCopyLine from './AppCopyLine.vue'

const location = useBrowserLocation()
const { link_url } = storeToRefs(useAffiliate())

const qrUrl = computed(() => `${location.value.origin}${link_url.value ?? ''}`)
</script>

<template>
  <div class="p-[16px]">
    <AppApplicationSharing width="40px" round :share-text="qrUrl" class="pb-[16px]" />
    <AppCopyLine class="theme-copy mt-[12px]" :msg="qrUrl" />
  </div>
</template>
