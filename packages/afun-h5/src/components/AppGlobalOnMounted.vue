<script setup lang='ts'>
import { init as useVersionPolling } from '@tg/hooks'
import { getEnv, getUrlParam, Local, STORAGE_CCCCC, STORAGE_UUUUU } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { onMounted } from 'vue'

defineOptions({ name: 'AppGlobalOnMounted' })

const { MODE } = getEnv()

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
  MODE !== 'development' && useVersionPolling(getLang())

  localSaveC_U()
})
</script>

<template>
  <div />
</template>

<style lang='scss' scoped>

</style>
