<script setup lang="ts">
const { currentLangZone } = storeToRefs(useLanguageStore())

function renderCurrentAreaTime() {
  function getTimeDom() {
    return document.querySelector('.current_language_area_time')?.querySelector('.menu-title')
  }

  let timer: any = null

  return {
    start: () => {
      timer = setInterval(() => {
        const dom = getTimeDom()
        if (dom)
          dom.innerHTML = dayjs(dayjs().format('YYYY-MM-DD HH:mm').toString()).tz(currentLangZone.value).format('YYYY-MM-DD HH:mm')
      }, 1000)
    },
    clear: () => {
      clearInterval(timer)
      timer = null
    },
  }
}

const { start, clear } = renderCurrentAreaTime()

onMounted(() => {
  start()
})

onUnmounted(() => {
  clear()
})
</script>

<template>
  <div class="hidden" />
</template>

<style scoped lang="scss">

</style>
