<script setup lang='ts'>
defineOptions({ name: 'AppSettingCardWrap' })
</script>

<template>
  <div class="setting-card">
    <slot />
  </div>
</template>

<style>
:root {
  --ph-setting-card-padding-x: 12rem;
  --ph-setting-card-padding-y: 12rem;
}
</style>

<style lang='scss' scoped>
.setting-card {
  padding: var(--ph-setting-card-padding-y) var(--ph-setting-card-padding-x);
  width: 100%;
  background-color: #fff;
  border-radius: 8rem;
}
</style>
