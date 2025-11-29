<script setup lang='ts'>
import { ref } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  maxlength?: string
  cols?: string
  rows?: string
}
defineOptions({
  name: 'BaseTextarea',
})
const props = withDefaults(defineProps<Props>(), {
  maxlength: '200',
  cols: '30',
  rows: '8',
})
const emit = defineEmits(['update:modelValue', 'input', 'focus', 'blur'])

const _placeholder = ref(props.placeholder)
const textareaRef = ref<HTMLElement | null>(null)

function handleInput(e: any) {
  const v = e.target.value
  emit('input', v)
  emit('update:modelValue', v)
}
function handleFocus() {
  _placeholder.value = ''
  emit('focus')
}
function handleBlur() {
  _placeholder.value = props.placeholder
  emit('blur')
}

function onFocusout() {
  _placeholder.value = props.placeholder
}

function setPlaceHolder(s: string) {
  _placeholder.value = s
}

defineExpose({ setPlaceHolder, textareaRef })
</script>

<template>
  <textarea
    ref="textareaRef"
    :value="modelValue" :maxlength="maxlength" :cols="cols" :rows="rows"
    :placeholder="_placeholder" @blur="handleBlur" @focus="handleFocus"
    @input="handleInput" @focusout="onFocusout"
  />
</template>

<style>
:root {
  --afun-base-textarea-placeholder-color: #b1bad3;
  --afun-base-textarea-background-color: #1a2c38;
  --afun-base-textarea-border-color: #2f4553;
  --afun-base-textarea-text-color: #fff;
}
</style>

<style lang='scss' scoped>
textarea {
  display: block;
  width: 100%;
  height: 140px;
  background: var(--afun-base-textarea-background-color);
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--afun-base-textarea-text-color);
  border: 2px solid var(--afun-base-textarea-border-color);
  outline: none;
}

textarea::placeholder {
  color: var(--afun-base-textarea-placeholder-color); /* 你想要的颜色 */
  opacity: 1; /* 有些浏览器默认透明度小 */
}
</style>
