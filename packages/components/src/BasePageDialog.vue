<script setup lang="ts">
interface Props {
  modelValue: boolean
  backgroundColor: string
}

defineOptions({ name: 'BasePageDialog' })
const props = withDefaults(defineProps<Props>(), {

})
const emit = defineEmits(['update:modelValue', 'close'])

function close() {
  emit('update:modelValue', !props.modelValue)
  emit('close', !props.modelValue)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="right">
      <div v-if="modelValue" class="page-dialog-overlay" :style="{ backgroundColor }" @click.self="close">
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.page-dialog-overlay {
  position: fixed;
  inset: 0;
  max-width: var(--pc-max-width);
  width: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 999;
  overflow: hidden;
}
.right-enter-active,
.right-leave-active {
  transition:
    transform 0.3s ease-out,
    opacity 0.3s linear;
}

.right-enter-from,
.right-leave-to {
  transform: translate3d(100%, 0, 0);
  opacity: 0;
}
</style>
