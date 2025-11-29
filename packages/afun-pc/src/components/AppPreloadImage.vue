<script setup lang='ts'>
/** 预加载图片 */
defineOptions({ name: 'AppPreloadImage' })
</script>

<template>
  <div class="app-preload-image">
    <AppFullScreenLoginAndRegisterBanner />

    <div class="h-[0px] w-[0px] overflow-hidden opacity-0">
      <BaseImage url="/png/home/login_pwa_banner.png" loading="eager" />
      <!-- 绿色 -->
      <BaseTemplate template="green">
        <BaseImage url="/png/home/login_pwa_bg_green.png" loading="eager" />
      </BaseTemplate>
      <!-- 白色 -->
      <BaseTemplate template="white">
        <BaseImage url="/png/home/login_pwa_bg_white.png" loading="eager" />
      </BaseTemplate>
      <!-- 默认、新黑色 -->
      <BaseTemplate :template="['new-default', '']">
        <BaseImage url="/png/home/login_pwa_bg_default.png" loading="eager" />
      </BaseTemplate>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.app-preload-image{
  position: absolute;
  width: 0;
  height: 0;
  z-index: -1;
  opacity: 0;
  padding: 0;
  overflow: hidden;
  left: -100px;
  bottom: -100px;
}
</style>
