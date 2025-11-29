<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'

defineOptions({
  name: 'AppGlobeDialog',
})

const queryModalName = ref(getParamsQuery('modal'))
const curComponent = getReloadDialog()

function getParamsQuery(key: string): string | null {
  return new URLSearchParams(window.location.search).get(key)
}
function getReloadDialog() {
  if (queryModalName.value === 'login' || queryModalName.value === 'register')
    return defineAsyncComponent(() => import('./AppLoginOrRegister.vue'))

  return null
}
</script>

<template>
  <Teleport v-if="curComponent" to="body">
    <div class="fixed bottom-0 left-0 right-0 top-0 z-[1001] flex items-center justify-center">
      <component :is="curComponent" />
    </div>
  </Teleport>
</template>
