<script setup lang="ts">
import { useDownloadStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, provide, ref } from 'vue'
import AppDownLoadBottomDialog from '~/components/AppDownLoadBottomDialog.vue'
import AppFixedContainer from '~/components/AppFixedContainer.vue'
import AppHomeLayout from '~/components/AppHomeLayout.vue'
import AppLoading from '~/components/AppLoading.vue'

defineOptions({ name: 'KeepAliveCasinoHome' })

const { isShowPwaHasC, isOpenDownLoadDialogBottom } = storeToRefs(useDownloadStore())

const isResolved = ref(false)

const CasinoHome = defineAsyncComponent(() => import('./_components/casino.vue'))

function onResolve() {
  isResolved.value = true
}

provide('isResolved', isResolved)
</script>

<template>
  <AppHomeLayout show-bg show-download-bar>
    <!-- 不放这里动画有bug -->
    <AppDownLoadBottomDialog v-if="isOpenDownLoadDialogBottom" />
    <AppFixedContainer />

    <Suspense timeout="0" @resolve="onResolve">
      <CasinoHome />
      <template #fallback>
        <AppLoading :height="300" />
      </template>
    </Suspense>
  </AppHomeLayout>
</template>

<style lang="scss">
</style>
