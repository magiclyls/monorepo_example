<script setup lang="ts">
interface Props {
  type?: 'primary' | 'secondary'
  text?: string
}
defineOptions({
  name: 'ChatBaseButton',
})
const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
})
</script>

<template>
  <div :class="`rounded-[4px] flex items-center justify-center cursor-pointer ${props.type === 'primary' ? 'primary' : 'secondary'}`">
    <div v-if="props.text" class="text">
      {{ props.text }}
    </div>
    <slot name="icon" />
  </div>
</template>

<style lang="scss" scoped>
.primary {
  background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  height: 40px;
}
.secondary {
  background: #2f4553;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  width: 46px;
  height: 40px;
}
.text {
  font-weight: 600;
  font-size: 14px;
  padding: 12px 19px;
  color: #000;
}
</style>
