<script setup lang="ts">
import type { InputMode } from '@tg/types'
import { useField } from 'vee-validate'
import { computed, ref } from 'vue'
import BaseIcon from './BaseIcon.vue'

interface Props {
  name: string
  type?: HTMLInputElement['type']
  inputmode?: InputMode
  modelValue?: string | number
  placeholder?: string
  required?: boolean
  search?: boolean
}

defineOptions({
  name: 'BaseInput',
})

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  inputmode: 'text',
})

const emits = defineEmits(['update:modelValue', 'change'])

const {
  value: inputValue,
  handleBlur,
  handleChange,
} = useField(props.name, undefined, {
  initialValue: props.modelValue,
})

const type = ref(props.type)
const inputRef = ref<HTMLInputElement | null>(null)

const inputMode = computed<InputMode>(() => {
  if (props.type === 'number') {
    return 'numeric'
  }

  return props.inputmode
})

function passwordToggle() {
  type.value = type.value === 'password' ? 'text' : 'password'
}

function onInput(e: Event) {
  handleChange(e)
  emits('update:modelValue', e.target?.value)
  emits('change', e)
}
</script>

<template>
  <div class="base-input bg-bg-black-1 pr-2" @click="$refs.inputRef.focus()">
    <slot name="left-icon" />
    <BaseIcon v-if="search" name="search-input" />
    <input
      ref="inputRef"
      :name="name"
      :inputmode="inputMode"
      :type="type"
      :placeholder="props.placeholder"
      :value="inputValue"
      :required="props.required"
      @input="onInput"
      @blur="handleBlur"
    >
    <slot name="right-icon" />
    <div v-if="props.type === 'password'" class="password text-[1.5rem] center" @click="passwordToggle">
      <BaseIcon :name="type === 'password' ? 'eye-on' : 'eye-off'" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-input {
  height: 3rem;
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
  border: 1px solid var(--color-bg-black-5);
  padding-left: 0.75rem;
  padding-right: 0.5rem;
  gap: 0.5rem;
  transition: all 0.35s cubic-bezier(0.36, 0.66, 0.04, 1);
  color: var(--color-text-white-1);

  &:focus-within {
    border-color: var(--color-brand);
  }

  > input {
    flex: 1;
  }
}
</style>
