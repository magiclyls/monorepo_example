<script setup lang="ts">
import { AfunBaseImage, BaseAspectRatio } from '@tg/bccomponents'
import { useCasinoStore } from '@tg/stores'
import { getBrandInfo } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'

defineOptions({ name: 'GroupAllProvider' })
const casinoStore = useCasinoStore()
const { cateProviderData, gameLobbyDateLoading } = storeToRefs(casinoStore)
const router = useRouter()
const { t } = useI18n()
const BLogoImg = getBrandInfo('pc.pc_logo_white')

const title = ref(t('游戏提供商'))

function toProvider(item: any) {
  if (item.maintained === '2')
    return
  router.push(`/group/provider/${item.platform_id}?vid=${item.platform_id}`)
}
</script>

<template>
  <AppPageLayout :title="title" style="--ph-page-layout-padding-y:12px;">
    <AppLoading v-if="gameLobbyDateLoading" />
    <div v-else>
      <div class="h-[80px] mt-[-15px] mx-[-12px] px-[12px] mb-[var(--ph-game-gap-y)] bg-[#213743] flex justify-between items-center">
        <AfunBaseImage is-network :url="BLogoImg" class="h-[29px] w-auto opacity-60" width="auto" @click="router.push('/')" />
        <AfunBaseImage class="h-full" width="auto" is-network url="/images/CATE/plat_background.png" />
      </div>
      <div class="grid gap-x-[var(--ph-game-gap-x)] gap-y-[var(--ph-game-gap-y)] grid-cols-3 ">
        <div v-for="item in cateProviderData.PCList" :key="item.name" class="overflow-hidden rounded-[6px] cursor-pointer">
          <BaseAspectRatio ratio="312/124">
            <AfunBaseImage class="h-full w-full" is-network :url="item.icon" @click="toProvider(item)" />
          </BaseAspectRatio>
        </div>
      </div>
    </div>
  </AppPageLayout>
</template>
