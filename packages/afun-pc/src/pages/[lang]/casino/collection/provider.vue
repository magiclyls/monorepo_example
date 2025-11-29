<script setup lang="ts">
import { IconUniClose } from '@tg/icons'

const router = useLocalRouter()
const casinoStore = useCasinoStore()
const { cateProviderData } = storeToRefs(casinoStore)
const { appContentWidth } = storeToRefs(useWindowStore())
const { isMobile } = storeToRefs(useWindowStore())
const { back } = useLocalRouter()

const bannerSrc = computed(() => {
  return casinoStore.getBg('5')
})

/** 平铺 */
const providerList = computed(() => {
  if (cateProviderData.value && cateProviderData.value.venue && !!cateProviderData.value.venue.pc)
    return cateProviderData.value.venue.pc[0]

  return []
})

function handleItemClick(item: any) {
  if (item.maintained === '2')
    return
  router.push(`/casino/group/provider?vid=${item.venue_id ?? item.id}`)
}

const prefixTitle = computed(() => cateProviderData.value?.name ?? '')

usePageTitle({ prefix: prefixTitle })
</script>

<template>
  <section class="layout-spacing tg-collection-provider">
    <BaseTemplate template="">
      <div class="group-banner-wrap" :class="{ 'less-than-700': appContentWidth <= 700 }">
        <div class="group-banner-bg" />
        <div class="banner-wrap">
          <!-- <div v-if="isMobile" class="pt- absolute right-[-3vw] top-0 z-10 flex items-center p-[10px] text-[14px]" @click="back">
          <IconUniClose  />
        </div> -->
          <div class="banner">
            <div class="left">
              <h1>
                <span>{{ cateProviderData?.name }}</span>
              </h1>
            </div>
            <div class="right">
              <BaseImage
                style="height: 100%;width: auto;"
                :url="bannerSrc ? bannerSrc : '/png/casino/group-banner-default.png'"
                loading="eager"
                :is-cloud="!!bannerSrc"
              />
            </div>
          </div>
        </div>
      </div>
    </BaseTemplate>

    <div class="mt-[24px]">
      <template v-if="globalInitMap.currentTemplate == 6">
        <AppCardListNewDefault :list="providerList" is-provider>
          <template #default="{ item }">
            <BaseProviderItem
              :url="item.img || item.logo || item.icon"
              :maintained="item.maintained || (item.icon && item.icon.length ? undefined : '2')"
              @click="handleItemClick(item)"
            />
          </template>
        </AppCardListNewDefault>
      </template>
      <template v-else>
        <AppCardList :list="providerList" is-provider>
          <template #default="{ item }">
            <BaseProviderItem
              :url="item.img || item.logo || item.icon"
              :maintained="item.maintained || (item.icon && item.icon.length ? undefined : '2')"
              @click="handleItemClick(item)"
            />
          </template>
        </AppCardList>
      </template>
    </div>
  </section>
  <div class="layout-spacing">
    <!-- <AppBetData mode="casino" /> -->
  </div>
</template>

<style lang="scss" scoped>
</style>

<route lang="yaml">
meta:
  layout: home
</route>
