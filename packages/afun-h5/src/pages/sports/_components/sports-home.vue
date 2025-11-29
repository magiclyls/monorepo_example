<script setup lang='ts'>
import { SportsHome } from '@tg/sports-stake/core'
import AppBanner from '~/components/AppBanner.vue'

defineOptions({ name: 'AppSportsHome' })
</script>

<template>
  <div class="px-[10px] pt-[12px]">
    <SportsHome>
      <template #banner>
        <AppBanner type="sports" />
        <!-- <AppMarquee class="mt-[8px] mb-[12px]" /> -->
      </template>
    </SportsHome>
  </div>
</template>

<style lang='scss' scoped>

</style>
