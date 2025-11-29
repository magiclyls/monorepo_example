<script setup lang="ts">
import { ApiMemberGameListHistory } from '@tg/apis'

usePageTitle({ prefix: 'h5_pop_up_menu_recent', isT: true })
const { appContentWidth, isMobile } = storeToRefs(useWindowStore())

const { data, runAsync } = useRequest(ApiMemberGameListHistory)
const list = computed(() => data.value ? data.value : [])

await application.allSettled([runAsync()])
</script>

<template>
  <section class="layout-spacing tg-favourites">
    <BaseTemplate template="">
      <div class="group-banner-wrap" :class="{ 'less-than-700': appContentWidth <= 700 }">
        <div class="group-banner-bg" />
        <div class="banner-wrap">
          <div class="banner">
            <div class="left">
              <h1>
                <span>{{ $t('recent_game_record') }}</span>
              </h1>
            </div>
            <div class="right">
              <BaseImage
                url="/png/casino/group-banner-default.png"
                style="height: 100%;width: auto;"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </BaseTemplate>

    <div v-if="!isMobile" class="tg-mt-24">
      <AppGameSearch game-type="1" is-lobby />
    </div>
    <div class="tg-mt-24">
      <AppCardList :list="list" />
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
