<script lang="ts" setup>
import AppRealTimeRebateListDialog from './AppRealTimeRebateListDialog.vue'
import AppRealTimeRebateDetailDialog from './AppRealTimeRebateDetailDialog.vue'

defineOptions({
  name: 'AppRealTimeRebateDialog',
})
</script>

<template>
  <div class="app-realtime-rebate h-[458px]">
    <BaseRouter
      :routes="[
        {
          path: '/',
          component: AppRealTimeRebateListDialog,
        },
        {
          path: '/real-time-rebate-detail',
          component: AppRealTimeRebateDetailDialog,
        },
      ]"
    />
  </div>
</template>

<style lang="scss" scoped>
</style>
