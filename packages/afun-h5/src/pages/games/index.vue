<script setup lang='ts'>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import AppHomeLayout from '~/components/AppHomeLayout.vue'
import AppLoading from '~/components/AppLoading.vue'

defineOptions({ name: 'KeepAliveCasinoGame' })
const route = useRoute()
const name = computed(() => route.query.name?.toString() ?? '')

const AppCasinoGamePage = defineAsyncComponent(() => import('./_components/casino-game.vue'))
</script>

<template>
  <!-- <AppPageLayout :title="name" style="--afun-page-layout-padding-x:0;--afun-page-layout-padding-top:0"> -->
  <AppHomeLayout :title="name" show-back>
    <Suspense timeout="0">
      <AppCasinoGamePage />
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </AppHomeLayout>
</template>

<style lang='scss' scoped></style>
