<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'

defineOptions({
  name: 'AppRebateDetail',
})

const { t } = useI18n()

const _component = defineAsyncComponent(() => import('~/components/AppRebateDetailContent.vue'))
</script>

<template>
  <AppPageLayout :title="t('返水比例')">
    <Suspense timeout="0">
      <component :is="_component" />
      <template #fallback>
        <AppLoading />
      </template>
    </Suspense>
  </AppPageLayout>
</template>
