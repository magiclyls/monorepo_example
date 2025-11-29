<script setup lang='ts'>
import { IconUniDoc } from '@tg/icons'

interface Props {
  username: string
  level?: string
}
defineOptions({
  name: 'AppReportUserName',
})
defineProps<Props>()

// const { copy } = useClipboard()
// const { openNotify } = useNotify()
const { t } = useI18n()

// function copyClick(username: string) {
//   copy(username)
//   openNotify({
//     title: t('copied'),
//     type: 'success',
//     message: t('copy_success') + username,
//   })
// }
</script>

<template>
  <div
    class="center app-report-user-name cursor-pointer"
  >
    <!-- @click="copyClick(username)" -->
    <AppVipIcon v-if="level" :level="level" />
    <div class="center ml-[4px]">
      <span class="mr-[4px]">{{ username }}</span>
      <AppTooltip popper-clazz="deep-tooltip" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']">
        <template #content>
          <div class="flex items-center" @click="application.copy(username)">
            <IconUniDoc />
          </div>
        </template>
      </AppTooltip>
    </div>
  </div>
</template>

<style>
</style>

<style lang='scss' scoped>
.app-report-user-name {
  // gap: var(--tg-spacing-4);
}
</style>
