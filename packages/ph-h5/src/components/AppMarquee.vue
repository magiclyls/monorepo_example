<script setup lang='ts'>
import { ApiMemberNoticeAllList } from '@tg/apis'
import { PhBaseScrollNotice } from '@tg/bccomponents'
import { application } from '@tg/utils'
import { getLangForBackend } from '@tg/vue-i18n'
import { computed } from 'vue'
import { useRequest } from 'vue-request'

defineOptions({ name: 'AppMarquee' })

/** 跑马灯 */
const { data, runAsync: runNoticeAllList } = useRequest(ApiMemberNoticeAllList)

const marqueeData = computed(() => {
  if (data.value && data.value.marquee && data.value.marquee.length) {
    return data.value.marquee.map((item) => {
      return {
        ...item,
        content_lang: item.content[getLangForBackend() ?? 'default'],
        title_lang: item.title[getLangForBackend() ?? 'default'],
      }
    })
  }

  return []
})

await application.allSettled([runNoticeAllList()])
</script>

<template>
  <PhBaseScrollNotice v-if="marqueeData.length" :list="marqueeData" />
</template>

<style lang='scss' scoped>

</style>
