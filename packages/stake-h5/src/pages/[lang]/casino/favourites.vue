<script setup lang="ts">
import { ApiMemberFavList } from '@tg/apis'
import { getEnv } from '@tg/utils';
import { IconChessStar } from '@tg/icons'

usePageTitle({ prefix: 'h5_sports_top_tab_list_favorites', isT: true })
const { appContentWidth, isMobile } = storeToRefs(useWindowStore())
const { VITE_CASINO_GAME_PAGE_SIZE } = getEnv()

const { list, page, runAsync, prev, next, hasMore } = useList(
  ApiMemberFavList,
  {},
  { page_size: +VITE_CASINO_GAME_PAGE_SIZE },
)

await application.allSettled([runAsync()])
</script>

<template>
  <section class="layout-spacing tg-favourites">
    <div class="group-banner-wrap" :class="{ 'less-than-700': appContentWidth <= 700 }">
      <BaseTemplate template="">
        <div class="group-banner-bg" />
        <div class="banner-wrap">
          <div class="banner">
            <div class="left">
              <h1>
                <span>{{ $t('sports_tab_favourites') }}</span>
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
      </BaseTemplate>
    </div>

    <AppGameSearch v-if="!isMobile" game-type="1" is-lobby />
    <template v-if="list.length > 0">
      <AppCardList :list="list" />
    </template>
    <div v-else class="no-data">
      {{ $t('label_no_collect') }}
      <div class="icon">
        <IconChessStar />
      </div>
      {{ $t('put_collect') }}
    </div>
    <div class="btns">
      <BaseButton type="text" :disabled="page === 1" @click="prev">
        {{ $t('page_prev') }}
      </BaseButton>
      <BaseButton type="text" :disabled="!hasMore" @click="next">
        {{ $t('page_next') }}
      </BaseButton>
    </div>
  </section>
  <div class="layout-spacing">
    <!-- <AppBetData mode="casino" /> -->
  </div>
</template>

<style lang="scss" scoped>
.tg-favourites {
  display: flex;
  flex-direction: column;
  // gap: var(--tg-spacing-24);
  > *:not(:last-child) {
    margin-bottom: var(--tg-spacing-24);
  }
}
.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tg-text-lightgrey);
  font-size: var(--tg-font-size-default);
  .icon {
    margin: 0 var(--tg-spacing-8);
  }
}
.btns {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
