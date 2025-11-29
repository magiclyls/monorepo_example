<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppWithDrawBeBankFiat from './_components/bebank-fiat.vue'
import AppWithDrawBeBankPix from './_components/bebank-pix.vue'
import AppWithDrawBeBankVir from './_components/bebank-virtual.vue'

type TabValue = 'fiat' | 'virtual' | 'pix'

const router = useRouter()
const route = useRoute()
const activeSubTab = ref<TabValue>(route.params.type as TabValue)

const currentComponent = computed(() => {
  const components = {
    fiat: AppWithDrawBeBankFiat,
    virtual: AppWithDrawBeBankVir,
    pix: AppWithDrawBeBankPix,
  }
  const key = activeSubTab.value as TabValue
  return components[key]
})
</script>

<template>
  <div>
    <component :is="currentComponent" />
  </div>
</template>

<style lang='scss' scoped>

</style>
