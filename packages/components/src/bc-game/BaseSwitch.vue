<script lang="ts" setup>
interface Props {
  modelValue?: boolean
  disabled?: boolean
}

defineOptions({
  name: 'BaseSwitch',
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
  background: #ebebeb;
  cursor: pointer;
  border-radius: 100px;
  padding: 4rem 0;
  transition: all 0.25s;
  width: 40rem;
  height: 20rem;
  display: flex;
  align-items: center;

  .dot {
    flex: none;
    width: 14rem;
    height: 14rem;
    background: #fff;
    border-radius: 50%;
    transition: all 0.25s;
    margin-left: 4rem;
  }

  &.checked {
    background: #f23038;

    .dot {
      margin-left: 22rem;
    }
  }
}
</style>
