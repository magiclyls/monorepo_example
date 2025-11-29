<script lang="ts" setup>
defineOptions({
  name: 'IconKr',
})
</script>

<template>
  <i class="tg-icon-container">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
    >
      <path fill-rule="evenodd" d="M0 0h512v512H0Z" />
      <g
        fill-rule="evenodd"
        transform="rotate(-56.3 367.2 -111.2) scale(9.375)"
      >
        <g>
          <path d="M-6-26H6v2H-6Zm0 3H6v2H-6Zm0 3H6v2H-6Z" />
          <use xlink:href="#kr-a" width="100%" height="100%" y="44" />
        </g>
        <path stroke="#fff" d="M0 17v10" />
        <path d="M0-12a12 12 0 0 1 0 24Z" />
        <path d="M0-12a12 12 0 0 0 0 24A6 6 0 0 0 0 0Z" />
        <circle cy="-6" r="6" />
      </g>
      <g fill-rule="evenodd" transform="rotate(-123.7 196.5 59.5) scale(9.375)">
        <use xlink:href="#kr-b" width="100%" height="100%" />
        <path stroke="#fff" d="M0-23.5v3M0 17v3.5m0 3v3" />
      </g>
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
