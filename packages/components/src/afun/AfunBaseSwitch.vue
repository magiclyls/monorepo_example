<script lang="ts" setup>
interface Props {
  modelValue?: boolean
  disabled?: boolean
}

defineOptions({
  name: 'AfunBaseSwitch',
})
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

function switchClick() {
  if (props.disabled)
    return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div class="switch" :class="{ checked: modelValue }" @click="switchClick">
    <div class="dot" />
  </div>
</template>

<style lang="scss" scoped>
.switch {
  background: #2f4554;
  cursor: pointer;
  border-radius: 100px;
  padding: 4px 0;
  transition: all 0.25s;
  width: 40px;
  height: 20px;
  display: flex;
  align-items: center;

  .dot {
    flex: none;
    width: 14px;
    height: 14px;
    background: #b1bad3;
    border-radius: 50%;
    transition: all 0.25s;
    margin-left: 4px;
  }

  &.checked {
    background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);

    .dot {
      margin-left: 22px;
      background: #05080a;
    }
  }
}
</style>
