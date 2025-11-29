<script setup lang='ts'>
import { getUrlParam, Local, STORAGE_CCCCC, STORAGE_UUUUU } from '@tg/utils'
import { onMounted } from 'vue'

defineOptions({ name: 'AppGlobalOnMounted' })

function localSaveC_U() {
  const c = getUrlParam('c')
  const u = getUrlParam('u')

  if (c)
    Local.set(STORAGE_CCCCC, c.replace(/\//g, ''))

  if (u)
    Local.set(STORAGE_UUUUU, u.replace(/\//g, ''))
}

onMounted(() => {
  window.updateServerTime()
  localSaveC_U()
})
</script>

<template>
  <div />
</template>

<style lang='scss' scoped>

</style>
