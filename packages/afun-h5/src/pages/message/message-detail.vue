<script setup lang='ts'>
import { AfunBaseImage } from '@tg/bccomponents'
import { timeToFromNow } from '@tg/vue-i18n'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppPageLayout from '~/components/AppPageLayout.vue'

defineOptions({ name: 'MessageDetail' })

const { t } = useI18n()
const route = useRoute()

const created_at: number = Number(route.query.created_at)
const content = route.query.content as string
const image_url = route.query.image_url as string
</script>

<template>
  <AppPageLayout :title="t('消息中心')">
    <div>
      <div class="flex items-center justify-center text-[12px] font-[500] text-[#B1BAD3] mb-[8px]">
        {{ timeToFromNow(created_at) }}
      </div>
      <div class="w-full border border-[#2F4553] rounded-[4px] p-[12px]">
        <div ref="contentRef" v-html="content" />
        <AfunBaseImage
          v-if="image_url"
          class="w-full object-cover rounded-[8px] overflow-hidden"
          :url="image_url"
          is-network
        />
      </div>
    </div>
  </AppPageLayout>
</template>

<style lang='scss' scoped></style>
