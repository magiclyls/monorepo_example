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

defineExpose({ setPlaceHolder })
</script>

<template>
  <textarea
    :value="modelValue" :maxlength="maxlength" :cols="cols" :rows="rows"
    :placeholder="_placeholder" @blur="handleBlur" @focus="handleFocus"
    @input="handleInput" @focusout="onFocusout"
  />
</template>

<style lang='scss' scoped>
:root {
  --ph-base-textarea-placeholder-color: #6d7693;
}
textarea {
  display: block;
  width: 100%;
  height: 140px;
  background: #fff;
  padding: 12rem;
  border-radius: 4rem;
  font-size: 12rem;
  color: #6d7693;
  border: 1rem solid #ebebeb;
  outline: none;
}

textarea::placeholder {
  color: var(--ph-base-textarea-placeholder-color); /* 你想要的颜色 */
  opacity: 1; /* 有些浏览器默认透明度小 */
}
</style>
