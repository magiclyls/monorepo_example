<script lang="ts" setup>
defineOptions({
  name: 'IconUniSelectCircle',
})
</script>

<template>
  <i class="tg-icon-container">
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r="7.5" stroke="white" />
      <circle cx="8" cy="8" r="3" />
    </svg>
  </i>
</template>

<style scoped>
.tg-icon-container {
  height: 1em;
  width: 1em;
  line-height: 1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

.tg-icon-container svg {
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
