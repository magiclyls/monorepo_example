<script setup lang='ts'>
import { SportsHome } from '@tg/sports-stake/core'
import AppBanner from '~/components/AppBanner.vue'
import AppMarquee from '~/components/AppMarquee.vue'

defineOptions({ name: 'AppSportsHome' })
</script>

<template>
  <div class="px-[10rem]">
    <SportsHome>
      <template #banner>
        <AppBanner type="sports" />
        <AppMarquee class="mt-[8rem] mb-[12rem]" />
      </template>
    </SportsHome>
  </div>
</template>

<style lang='scss' scoped>

</style>
