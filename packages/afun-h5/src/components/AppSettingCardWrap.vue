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
  --ph-setting-card-padding-x: 12px;
  --ph-setting-card-padding-y: 12px;
}
</style>

<style lang='scss' scoped>
.setting-card {
  padding: var(--ph-setting-card-padding-y) var(--ph-setting-card-padding-x);
  width: 100%;
  background-color: #233846;
  border-radius: 4px;
}
</style>
