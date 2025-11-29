<script setup lang="ts">
import { useBoolean } from '@tg/hooks'
import { IconEyeOff, IconEyeOn, IconInfo, IconUniSearch } from '@tg/icons'
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
  openBorderPlaceholder?: boolean
  floatLabel?: string
  dealInputVal?: (val: string) => string
}

defineOptions({
  name: 'AfunBaseInput',
})

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  inputMode: 'text',
  name: '',
  searchIcon: 'uni-search1',
  openBorderPlaceholder: false,
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
const _placeholder = ref(props.placeholder)

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
  if (props.dealInputVal)
    e.target.value = props.dealInputVal(e.target.value)
  emit('update:modelValue', e.target?.value)
  emit('change', e)
}
function onBlur() {
  !!props.modelValue && setTouchTrue()
  isFocus.value = false
  dealPlaceholder()
  emit('blur')
}
function clickHandler() {
  inputRef.value?.focus()
}
function onClickOutsideHandler() {
  dealPlaceholder()
}
function onFocus() {
  isFocus.value = true
  dealPlaceholder()
}
function dealPlaceholder() {
  if (!props.openBorderPlaceholder)
    return
  if (isFocus.value) {
    _placeholder.value = ''
  }
  else {
    _placeholder.value = props.placeholder
  }
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
  <div class="size-full relative">
    <div v-if="openBorderPlaceholder" class="border-placeholder font-[500]  absolute transition-[opacity,transform]  px-[4px] duration-200 pointer-events-none top-[0px] left-[16px] z-10 leading-[20px]" :class="[{ 'border-placeholder-move': isFocus || modelValue }, modelValue && !isFocus ? 'text-[#B1BAD3]' : 'text-[var(--afun-base-input-border-color-focus)]']">
      {{ props.floatLabel ? props.floatLabel : props.placeholder }}
    </div>
    <div ref="baseInputRef" class="base-input" :class="{ isFocus, disabled }" @click="clickHandler">
      <div v-if="$slots.left" class="left">
        <slot name="left" />
      </div>
      <div v-if="search" class="search">
        <slot name="search-icon">
          <IconUniSearch />
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
          :placeholder="_placeholder"
          :value="modelValue"
          :disabled="props.disabled"
          :required="props.required"
          :autocomplete="`new-${_type}`"
          @input="onInput"
          @blur="onBlur"
          @focus="onFocus"
          @keyup.enter="onEnter"
        >
      </div>
      <div
        v-if="isPassword"
        class="eye"
        @click="passwordToggle"
      >
        <IconEyeOff v-if="_type === 'password'" class="text-[#B1BAD3]" />
        <IconEyeOn v-else class="text-[#B1BAD3]" />
      </div>

      <div v-if="$slots.right" class="ml-[8px] flex items-center flex-none" @click.stop>
        <slot name="right" />
      </div>
    </div>
    <div v-if="error" class="mt-[5px] flex  leading-[17px] text-[12px] font-[600]">
      <div class="h-[17px] mr-[4px] flex items-center">
        <IconInfo class="text-[14px]  text-[var(--afun-base-input-error-icon-color)]" />
      </div>

      <span class="text-[var(--afun-base-input-error-text-color)]">{{ msg }}</span>
    </div>
  </div>
</template>

<style>
:root {
  --afun-base-input-border-radius: 4px;
  --afun-base-input-border-color: #2f4553;
  --afun-base-input-border-color-focus: #24ee89;
  --afun-base-input-padding-left: 12px;
  --afun-base-input-padding-right: 12px;
  --afun-base-input-padding-y: 9px;
  --afun-base-input-background-color: #0f212e;
  --afun-base-input-disabled-background-color: #1a2c38;
  --afun-base-input-font-size: 14px;
  --afun-base-input-font-weight: 600;
  --afun-base-input-color: #fff;
  --afun-base-input-style-placeholder-color: #566771;
  --afun-base-input-style-placeholder-font-size: 14px;
  --afun-base-input-icon-size: 20px;
  --afun-base-input-icon-color: #9dabc8;
  --afun-base-input-line-height: 20px;
  --afun-base-input-search-icon-size: 14px;
  /* --afun-base-input-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.12); */
  --afun-base-input-shadow: none;
  --afun-base-input-error-text-color: #ed4163;
  --afun-base-input-error-icon-color: #ed4163;
  --afun-base-input-height: 43px;
}
</style>

<style scoped lang="scss">
.base-input {
  position: relative;
  width: 100%;
  height: var(--afun-base-input-height);
  display: flex;
  overflow: hidden;
  border-radius: var(--afun-base-input-border-radius);
  border: 1px solid var(--afun-base-input-border-color);
  padding-left: var(--afun-base-input-padding-left);
  padding-right: var(--afun-base-input-padding-right);
  background-color: var(--afun-base-input-background-color);
  box-shadow: var(--afun-base-input-shadow);
  .left {
    border-right: 1px solid var(--afun-base-input-border-color);
    padding-right: 8px;
    margin-right: 8px;
    flex-shrink: 0;
  }

  .search {
    font-size: var(--afun-base-input-search-icon-size);
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--afun-base-input-icon-color);
    margin-right: 8px;
    flex-shrink: 0;
  }

  &.isFocus {
    border-color: var(--afun-base-input-border-color-focus);
  }

  &.disabled {
    background-color: var(--afun-base-input-disabled-background-color);
  }

  .input-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    padding: var(--afun-base-input-padding-y) 0;
    input {
      width: 100%;
      line-height: var(--afun-base-input-line-height);
      color: var(--afun-base-input-color);
      font-size: var(--afun-base-input-font-size);
      font-weight: var(--afun-base-input-font-weight);
      &::placeholder {
        color: var(--afun-base-input-style-placeholder-color);
        font-size: var(--afun-base-input-style-placeholder-font-size);
        opacity: 1;
      }
    }
  }

  .clear {
    font-size: var(--afun-base-input-icon-size);
    display: flex;
    justify-content: center;
    align-items: center;
    --tg-base-icon-color: var(--afun-base-input-icon-color);
    margin-left: 8px;
  }
  .eye {
    flex-shrink: 0;
    font-size: var(--afun-base-input-icon-size);
    display: flex;
    justify-content: center;
    align-items: center;
    --tg-base-icon-color: var(--afun-base-input-icon-color);
    margin-left: 8px;
  }
}
.border-placeholder {
  opacity: 0;
  background: linear-gradient(to top, #0f212e 50%, transparent 50%);
}
.border-placeholder-move {
  transform: translateY(-50%);
  opacity: 1;
}
</style>
