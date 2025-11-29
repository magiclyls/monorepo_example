<script lang="ts" setup>
import { ApiMemberAgencyMyPromotion } from '@tg/apis'
import { IconUniDoc } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { useBrowserLocation, useClipboard } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppApplicationSharing from './AppApplicationSharing.vue'
import AppLoading from './AppLoading.vue'
import AppTooltip from './AppTooltip.vue'

const { copy } = useClipboard()
const { t } = useI18n()
const location = useBrowserLocation()
const { isLogin } = storeToRefs(useAppStore())

const { data: proData, runAsync, loading } = useRequest(ApiMemberAgencyMyPromotion)

const qrUrl = computed(() => `${location.value.origin}${proData.value?.link_url ?? ''}`)

watch(isLogin, (newVal) => {
  if (newVal) {
    runAsync()
  }
}, { immediate: true })
</script>

<template>
  <AppLoading v-if="loading" :height="250" :full-screen="false" />
  <div v-else class="p-[16px]">
    <div class="mb-[4px] font-[600] text-[#B1BAD3]">
      {{ t('通过社交媒体分享') }}
    </div>
    <AppApplicationSharing show-name :share-text="qrUrl" width="40px" round />
    <div class="mb-[2px] font-[600] mt-[8px] text-[#B1BAD3]">
      {{ t('推广链接') }}
    </div>
    <AppTooltip
      :text="t('已成功复制')" icon-name="copy" :triggers="['click']"
      @click="copy(qrUrl)"
    >
      <template #content>
        <div class="bg-[#2f4553] text-[#B1BAD3] flex-1 flex items-center justify-between px-[10px] h-[38px] rounded-[4px]">
          <span>{{ qrUrl }} </span>
          <IconUniDoc class="share-text-col w-[14px] h-[14px]" />
        </div>
      </template>
    </AppTooltip>
  </div>
</template>

<style lang="scss" scoped>

</style>
