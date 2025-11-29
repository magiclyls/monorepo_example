<script setup lang="ts">
import { useBoolean } from '@tg/hooks'
import { IconEyeOff, IconEyeOn, IconInfo, IconSearch } from '@tg/icons'
import { onClickOutside } from '@vueuse/core'
import { computed, ref } from 'vue'

type InputMode = 'decimal' | 'email' | 'none' | 'numeric' | 'search' | 'tel' | 'text' | 'url'
interface Props {
  name?: string
  type?: HTMLInputElement['type']
  inputMode?: InputMode
  modelValue?: string | number
  placeholder?: string
  required?: boolean
  search?: boolean
  msg?: string
  max?: number
  msgAfterTouched?: boolean
  disabled?: boolean
  /** 搜索图标 */
  searchIcon?: string
  readonly?: boolean
}

defineOptions({
  name: 'PhBaseInput',
})

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  inputMode: 'text',
  name: '',
  searchIcon: 'uni-search1',
})

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'keyEnter'])

const {
  bool: isTouched,
  setTrue: setTouchTrue,
  setFalse: setTouchFalse,
} = useBoolean(false)

const _type = ref(props.type)
const inputRef = ref<HTMLInputElement | null>(null)
const baseInputRef = ref()
const isFocus = ref(false)

const inputMode = computed<InputMode>(() => {
  if (props.type === 'number') {
    return 'numeric'
  }

  return props.inputMode
})
const isPassword = computed(() => props.type === 'password')
const error = computed(() => {
  if (props.msgAfterTouched)
    return isTouched.value && !!props.msg
  return !!props.msg
})

function passwordToggle() {
  _type.value = _type.value === 'password' ? 'text' : 'password'
}

function onInput(e: any) {
  emit('update:modelValue', e.target?.value)
  emit('change', e)
}
function onBlur() {
  !!props.modelValue && setTouchTrue()
  emit('blur')
}
function clickHandler() {
  inputRef.value?.focus()
  isFocus.value = true
}
function onClickOutsideHandler() {
  isFocus.value = false
}
function clear() {
  emit('update:modelValue', '')
}
function onEnter() {
  emit('keyEnter')
}

onClickOutside(baseInputRef, onClickOutsideHandler)

defineExpose({ setTouchTrue, setTouchFalse, isTouched })
</script>

<template>
  <div class="w-full">
    <div ref="baseInputRef" class="base-input" :class="{ isFocus }" @click="clickHandler">
      <div v-if="$slots.left" class="left">
        <slot name="left" />
      </div>
      <div v-if="search" class="search">
        <slot name="search-icon">
          <IconSearch />
        </slot>
      </div>
      <div class="input-wrap">
        <input
          ref="inputRef"
          :maxlength="max"
          :name="name"
          :inputmode="inputMode"
          :type="_type"
          :readonly="readonly"
          :placeholder="props.placeholder"
          :value="modelValue"
          :disabled="props.disabled"
          :required="props.required"
          :autocomplete="`new-${_type}`"
          @input="onInput"
          @blur="onBlur"
          @keyup.enter="onEnter"
        >
      </div>
      <div
        v-if="isPassword"
        class="eye"
        @click="passwordToggle"
      >
        <IconEyeOff v-if="_type === 'password'" class="text-[#9DABC9]" />
        <IconEyeOn v-else class="text-[#9DABC9]" />
      </div>

      <div v-if="$slots.right" class="ml-[8rem] flex items-center flex-none" @click.stop>
        <slot name="right" />
      </div>
    </div>
    <div v-if="error" class="mt-[5rem] flex  leading-[17rem] text-[12rem] font-[500]">
      <div class="h-[17rem] mr-[4rem] flex items-center">
        <IconInfo class="text-[14rem]  text-[#FF4D4F]" />
      </div>

      <span class="text-[#FF4D4F]">{{ msg }}</span>
    </div>
  </div>
</template>

<style>
:root {
  --ph-base-input-border-radius: 6rem;
  --ph-base-input-border-color: #ebebeb;
  --ph-base-input-border-color-focus: #f23038;
  --ph-base-input-padding-left: 12rem;
  --ph-base-input-padding-right: 12rem;
  --ph-base-input-padding-y: 11rem;
  --ph-base-input-background-color: #fff;
  --ph-base-input-font-size: 14rem;
  --ph-base-input-font-weight: 400;
  --ph-base-input-color: #0d2245;
  --ph-base-input-style-placeholder-color: #9dabc9;
  --ph-base-input-icon-size: 20rem;
  --ph-base-input-icon-color: #9dabc8;
  --ph-base-input-line-height: 20rem;
  --ph-base-input-search-icon-size: 16rem;
}
</style>

<style scoped lang="scss">
.base-input {
  width: 100%;
  display: flex;
  overflow: hidden;
  border-radius: var(--ph-base-input-border-radius);
  border: 1px solid var(--ph-base-input-border-color);
  padding-left: var(--ph-base-input-padding-left);
  padding-right: var(--ph-base-input-padding-right);
  background-color: var(--ph-base-input-background-color);

  .left {
    border-right: 1px solid var(--ph-base-input-border-color);
    padding-right: 8rem;
    margin-right: 8rem;
    flex-shrink: 0;
  }

  .search {
    font-size: var(--ph-base-input-search-icon-size);
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--ph-base-input-icon-color);
    margin-right: 8rem;
    flex-shrink: 0;
  }

  &.isFocus {
    border-color: var(--ph-base-input-border-color-focus);
  }

  .input-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    padding: var(--ph-base-input-padding-y) 0;
    input {
      width: 100%;
      caret-color: red;
      line-height: var(--ph-base-input-line-height);
      color: var(--ph-base-input-color);
      font-size: var(--ph-base-input-font-size);
      font-weight: var(--ph-base-input-font-weight);
      &::placeholder {
        color: var(--ph-base-input-style-placeholder-color);
      }
    }
  }

  .clear {
    font-size: var(--ph-base-input-icon-size);
    display: flex;
    justify-content: center;
    align-items: center;
    --tg-base-icon-color: var(--ph-base-input-icon-color);
    margin-left: 8rem;
  }
  .eye {
    flex-shrink: 0;
    font-size: var(--ph-base-input-icon-size);
    display: flex;
    justify-content: center;
    align-items: center;
    --tg-base-icon-color: var(--ph-base-input-icon-color);
    margin-left: 8rem;
  }
}
</style>
