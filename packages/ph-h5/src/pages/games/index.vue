<script setup lang='ts'>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'

const route = useRoute()

const name = computed(() => route.query.name?.toString() ?? '')

const AppCasinoGamePage = defineAsyncComponent(() => import('./_components/casino-game.vue'))
</script>

<template>
  <AppPageLayout :title="name" class="pb-[100rem]">
    <Suspense timeout="0">
      <AppCasinoGamePage />
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </AppPageLayout>
</template>

<style lang='scss' scoped>
</style>
