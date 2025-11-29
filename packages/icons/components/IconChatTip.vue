<script lang="ts" setup>
defineOptions({
  name: 'IconChatTip',
})
</script>

<template>
  <i class="tg-icon-container">
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.9692 7.84L21.4203 2.93913C21.4203 2.93913 20.0247 0 14.0029 0C7.9812 0 6.58032 2.93475 6.58032 2.93475L11.0358 7.84H16.9692Z"
      />
      <path
        d="M9.23999 5.91412C9.23999 5.91412 11.0302 4.48 13.9974 4.48C16.9645 4.48 18.76 5.91412 18.76 5.91412L17.3119 7.959L10.6409 7.98087L9.24174 5.915H9.23999V5.91412Z"
      />
      <path
        d="M25.2 19.1196C25.2 24.8412 20.1854 28 14 28C7.81467 28 2.80005 24.8421 2.80005 19.1196C2.80005 13.398 7.81467 7.28 14 7.28C20.1854 7.28 25.2 13.398 25.2 19.1196Z"
      />
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
