<script setup lang="ts">

</script>

<template>
  <div class="current-level-label">
    <div class="current">
      {{ t('当前') }}
    </div>
    <span />
  </div>
</template>

<style scoped lang="scss">
.current-level-label {
  min-width: 36px;
  height: 19px;
  background: #ff0000;
  color: #fff;
  position: relative;
  font-size: 10px;
  border-radius: 10px;

  span {
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 10px solid #ff0000;
  }
}
</style>
