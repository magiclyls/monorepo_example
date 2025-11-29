<script lang="ts" setup>
defineOptions({
  name: 'IconIn',
})
</script>

<template>
  <i class="tg-icon-container">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
    >
      <path d="M0 0h512v170.7H0z" />
      <path d="M0 170.7h512v170.6H0z" />
      <path d="M0 341.3h512V512H0z" />
      <g transform="translate(256 256) scale(3.41333)">
        <circle r="20" />
        <circle r="17.5" />
        <circle r="3.5" />
        <g>
          <g>
            <g>
              <g>
                <circle r=".9" transform="rotate(7.5 -8.8 133.5)" />
                <path d="M0 17.5.6 7 0 2l-.6 5L0 17.5z" />
              </g>
              <use
                xlink:href="#in-a"
                width="100%"
                height="100%"
                transform="rotate(15)"
              />
            </g>
            <use
              xlink:href="#in-b"
              width="100%"
              height="100%"
              transform="rotate(30)"
            />
          </g>
          <use
            xlink:href="#in-c"
            width="100%"
            height="100%"
            transform="rotate(60)"
          />
        </g>
        <use
          xlink:href="#in-d"
          width="100%"
          height="100%"
          transform="rotate(120)"
        />
        <use
          xlink:href="#in-d"
          width="100%"
          height="100%"
          transform="rotate(-120)"
        />
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
