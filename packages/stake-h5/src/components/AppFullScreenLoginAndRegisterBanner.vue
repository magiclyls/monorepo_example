<script setup lang='ts'>
import { getEnv } from '@tg/utils';

defineOptions({ name: 'AppFullScreenLoginAndRegisterBanner' })

const { VITE_SITE_NAME } = getEnv()
</script>

<template>
  <div class="relative w-full pb-[53.6%]">
    <div class="absolute left-0 top-0 h-full w-full">
      <BaseTemplate template="green">
        <BaseImage url="/png/home/login_green_bg.png" loading="eager" />
      </BaseTemplate>
      <BaseTemplate template="white">
        <BaseImage url="/png/home/login_white_bg.png" loading="eager" />
      </BaseTemplate>
      <BaseTemplate :template="['new-default', '']">
        <!-- 只针对BETFF的 -->
        <BaseImage v-if="VITE_SITE_NAME === 'btf'" url="/png/home/login_betff_bg.png" loading="eager" />
        <BaseImage v-else url="/png/home/login_green_bg2.png" loading="eager" />
      </BaseTemplate>
    </div>
  </div>
</template>
