<script lang="ts" setup>
interface Props {
  modelValue: string
}
defineOptions({
  name: 'BallRange',
})
defineProps<Props>()

const emit = defineEmits(['update:modelValue', 'input'])

function onInput(e: any) {
  const val = e.target.value
  emit('update:modelValue', val)
  emit('input', val)
}
</script>

<template>
  <div class="input-wrapper" :style="{ '--current': `${modelValue}%` }">
    <input :value="modelValue" type="range" min="0" max="100" step="5" @input="onInput">
  </div>
</template>

<style>
:root {
  --app-ball-range-track-color: #d5dceb;
  --app-ball-range-thumb-color: #f23038;
}
</style>

<style lang="scss" scoped>
.input-wrapper {
  position: relative;
  display: flex;
  min-height: 20rem;
  max-width: 70rem;
  align-items: center;

  input[type='range'] {
    appearance: none;
    width: 100%;
    background: 0 0;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  &::after {
    z-index: 1;
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: var(--current);
    height: 5rem;
    border-radius: 2.5rem;
    background: #f23038;
    pointer-events: none;
    max-width: 100%;
  }
}

.input-wrapper input[type='range']::-moz-range-thumb {
  transform: translateY(-4.5rem);
  position: relative;
  z-index: 3;
  appearance: none;
  height: 14rem;
  width: 14rem;
  border-radius: 50%;
  background-color: var(--app-ball-range-thumb-color);
  cursor: pointer;
}

.input-wrapper input[type='range']::-webkit-slider-thumb {
  transform: translateY(-4.5rem);
  position: relative;
  z-index: 3;
  -webkit-appearance: none;
  height: 14rem;
  width: 14rem;
  border-radius: 50%;
  background-color: var(--app-ball-range-thumb-color);
  cursor: pointer;
}

.input-wrapper input[type='range']::-moz-range-track {
  width: 100%;
  height: 5rem;
  cursor: pointer;
  background: var(--app-ball-range-track-color);
  border-radius: 5rem;
}

.input-wrapper input[type='range']::-moz-range-progress {
  width: 100%;
  height: 5rem;
  cursor: pointer;
  border-radius: 5rem;
  background-color: #1475e1;
}

.input-wrapper input[type='range']::-ms-fill-lower {
  width: 100%;
  height: 5px;
  cursor: pointer;
  border-radius: 5px;
  background-color: #1475e1;
}

.input-wrapper input[type='range']::-ms-fill-upper {
  width: 100%;
  height: 5px;
  cursor: pointer;
  background: var(--app-ball-range-track-color);
  border-radius: 5px;
}

.input-wrapper input[type='range']::-moz-focus-outer {
  border: 0;
}

.input-wrapper input[type='range']::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  background: var(--app-ball-range-track-color);
  border-radius: 5px;
}

.input-wrapper input[type='range']:focus::-webkit-slider-runnable-track {
  background: var(--app-ball-range-track-color);
}
</style>
