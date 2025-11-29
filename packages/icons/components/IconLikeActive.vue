<script lang="ts" setup>
defineOptions({
  name: 'IconLikeActive',
})
</script>

<template>
  <i class="tg-icon-container">
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.0063 19C9.68105 19 9.38086 18.9035 9.1182 18.6984C8.90557 18.5295 3.71482 14.6568 1.63852 11.508C0.950594 10.4705 0 9.05898 0 7.0563C0 3.71448 2.58912 1 5.7536 1C7.3671 1 8.90557 1.7118 10.0063 2.95442C11.0944 1.69973 12.6204 1 14.2464 1C17.4234 1 20 3.71448 20 7.0563C20 9.02279 19.1119 10.374 18.3865 11.4718L18.3615 11.508C16.2852 14.6568 11.0944 18.5416 10.8818 18.6984C10.6316 18.8914 10.3315 19 10.0063 19Z"
      />
      <defs>
        <linearGradient
          x1="10"
          y1="1"
          x2="10"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FEAF9F" />
          <stop offset="1" stop-color="#F52D2D" />
        </linearGradient>
      </defs>
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
