<script lang="ts" setup name="base-loading">
interface Props {
  mode?: string // green,white,black
}
defineOptions({
  name: 'BaseLoading',
})
withDefaults(defineProps<Props>(), {
  mode: 'green',
})
</script>

<template>
  <div class="loader" :class="[`${mode}-loading`]" />
</template>

<style lang="scss" scoped>
.loader {
  border-radius: 50%;
  width: 1.25rem;
  height: 1.25rem;
  display: inline-block;
  animation: spin 1.2s linear infinite;
}
.green-loading {
  border: 3px solid var(--color-brand);
  border-top: 3px solid var(--color-brand-600);
}
.white-loading {
  border: 3px solid var(--color-white-100);
  border-top: 3px solid var(--color-white-900);
}
.black-loading {
  border: 3px solid var(--color-black);
  border-top: 3px solid var(--color-text-white-1);
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
