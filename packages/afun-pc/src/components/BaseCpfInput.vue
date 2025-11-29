<script setup lang="ts">
import { IconInfo } from '@tg/icons'
import { onClickOutside } from '@vueuse/core'
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string
  msg?: string
  disabled?: boolean
  msgAfterTouched?: boolean
  readonly?: boolean
  hideBorderPlaceholder?: boolean
}

defineOptions({
  name: 'BaseCpfInput',
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  msg: '',
  hideBorderPlaceholder: false,
})

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus'])

const {
  bool: isTouched,
  setTrue: setTouchTrue,
  setFalse: setTouchFalse,
} = useBoolean(false)

const inputRef = ref<HTMLInputElement | null>(null)
const baseInputRef = ref<HTMLElement | null>(null)
const isFocus = ref(false)

// 两种状态的模版
const MASK_EMPTY = '000.000.000-00'
const MASK_TYPING = '___.___.___-__'

// 1. 纯数字 -> 格式化字符串 (用于显示)
function formatCPF(value: string) {
  if (!value)
    return ''
  const numbers = value.replace(/\D/g, '').slice(0, 11)

  let result = ''
  for (let i = 0; i < numbers.length; i++) {
    result += numbers[i]
    if ((i === 2 || i === 5) && i !== numbers.length - 1) {
      result += '.'
    }
    if (i === 8 && i !== numbers.length - 1) {
      result += '-'
    }
  }
  return result
}

// 2. 格式化字符串 -> 纯数字 (用于 emit)
function stripCPF(value: string) {
  return value.replace(/\D/g, '').slice(0, 11)
}

const displayValue = computed(() => {
  return formatCPF(props.modelValue)
})

const error = computed(() => {
  if (props.msgAfterTouched)
    return isTouched.value && !!props.msg
  return !!props.msg
})

/**
 * 核心逻辑更新：
 * 1. 根据是否有输入值，选择不同的 Mask 模版。
 * 2. 如果有输入，颜色需要跟随输入框颜色 (isTyping = true)。
 */
const ghostContent = computed(() => {
  const currentDisplayVal = displayValue.value
  const len = currentDisplayVal.length
  const hasInput = len > 0

  // 选择当前状态的模版
  const currentMask = hasInput ? MASK_TYPING : MASK_EMPTY

  if (len === 0) {
    return {
      invisible: '',
      visible: currentMask,
      isTyping: false, // 灰色
    }
  }

  if (len >= currentMask.length) {
    return {
      invisible: currentDisplayVal,
      visible: '',
      isTyping: true,
    }
  }

  const remainder = currentMask.slice(len)

  return {
    invisible: currentDisplayVal,
    visible: remainder,
    isTyping: true, // 白色（跟随输入色）
  }
})

function onInput(e: any) {
  const rawVal = e.target.value
  const cleanVal = stripCPF(rawVal)
  const nextDisplayVal = formatCPF(cleanVal)

  if (e.target.value !== nextDisplayVal) {
    e.target.value = nextDisplayVal
  }

  emit('update:modelValue', cleanVal)
  emit('change', e)
}

function onFocus(e: any) {
  isFocus.value = true
  emit('focus', e)
}

function onBlur(e: any) {
  if (props.modelValue)
    setTouchTrue()
  isFocus.value = false
  emit('blur', e)
}

function clickHandler() {
  inputRef.value?.focus()
}

onClickOutside(baseInputRef, () => {
  if (isFocus.value) {
    onBlur(null)
  }
})

defineExpose({ setTouchTrue, setTouchFalse, isTouched })
</script>

<template>
  <div class="size-full relative">
    <div
      v-if="!props.hideBorderPlaceholder"
      class="border-placeholder font-[500] absolute transition-[opacity,transform] px-[4px] duration-200 pointer-events-none top-[0px] left-[16px] z-20 leading-[20px]"
      :class="[
        { 'border-placeholder-move': isFocus || modelValue },
        modelValue && !isFocus ? 'text-[#B1BAD3]' : 'text-[var(--tg-base-cpf-input-border-color-focus)]',
      ]"
    >
      CPF
    </div>

    <div ref="baseInputRef" class="base-input" :class="{ isFocus, disabled: props.disabled }" @click="clickHandler">
      <div class="input-wrap relative">
        <div class="ghost-layer">
          <span class="invisible-text">{{ ghostContent.invisible }}</span>
          <span
            class="visible-placeholder"
            :class="{ 'is-typing': ghostContent.isTyping }"
          >
            {{ ghostContent.visible }}
          </span>
        </div>

        <input
          ref="inputRef"
          name="cpf"
          inputmode="numeric"
          type="text"
          :readonly="readonly"
          :disabled="props.disabled"
          :value="displayValue"
          autocomplete="off"
          maxlength="14"
          @input="onInput"
          @blur="onBlur"
          @focus="onFocus"
        >
      </div>

      <div v-if="$slots.right" class="-mr-[12px] flex items-center flex-none" @click.stop>
        <slot name="right" />
      </div>
    </div>

    <div v-if="error" class="mt-[5px] flex leading-[17px] text-[12px] font-[600]">
      <div class="h-[17px] mr-[4px] flex items-center">
        <IconInfo class="text-[14px] text-[var(--tg-base-cpf-input-error-icon-color)]" />
      </div>
      <span class="text-[var(--tg-base-cpf-input-error-text-color)]">{{ msg }}</span>
    </div>
  </div>
</template>

<style>
:root {
  --tg-base-cpf-input-border-radius: 4px;
  --tg-base-cpf-input-border-color: #2f4553;
  --tg-base-cpf-input-border-color-focus: #24ee89;
  --tg-base-cpf-input-padding-left: 12px;
  --tg-base-cpf-input-padding-right: 12px;
  --tg-base-cpf-input-padding-y: 8px;
  --tg-base-cpf-input-background-color: #0f212e;
  --tg-base-cpf-input-disabled-background-color: #1a2c38;
  --tg-base-cpf-input-font-size: 14px;
  --tg-base-cpf-input-font-weight: 600;
  --tg-base-cpf-input-color: #fff; /* 输入文字颜色（通常为白色） */
  --tg-base-cpf-input-style-placeholder-color: #566771; /* 默认 Placeholder 颜色（灰色） */
  --tg-base-cpf-input-style-placeholder-font-size: 14px;
  --tg-base-cpf-input-line-height: 20px;
  --tg-base-cpf-input-shadow: none;
  --tg-base-cpf-input-error-text-color: #ed4163;
  --tg-base-cpf-input-error-icon-color: #ed4163;
  --tg-base-cpf-input-height: 41px;
}
</style>

<style scoped lang="scss">
.base-input {
  position: relative;
  width: 100%;
  height: var(--tg-base-cpf-input-height);
  display: flex;
  overflow: hidden;
  border-radius: var(--tg-base-cpf-input-border-radius);
  border: 1px solid var(--tg-base-cpf-input-border-color);
  padding-left: var(--tg-base-cpf-input-padding-left);
  padding-right: var(--tg-base-cpf-input-padding-right);
  background-color: var(--tg-base-cpf-input-background-color);
  box-shadow: var(--tg-base-cpf-input-shadow);

  &.isFocus {
    border-color: var(--tg-base-cpf-input-border-color-focus);
  }

  &.disabled {
    background-color: var(--tg-base-cpf-input-disabled-background-color);
  }

  .input-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    padding: var(--tg-base-cpf-input-padding-y) 0;
    position: relative;

    .ghost-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      pointer-events: none;
      white-space: pre;
      font-size: var(--tg-base-cpf-input-font-size);
      font-weight: var(--tg-base-cpf-input-font-weight);
      line-height: var(--tg-base-cpf-input-line-height);
      padding: var(--tg-base-cpf-input-padding-y) 0;

      .invisible-text {
        color: transparent;
      }

      .visible-placeholder {
        /* 默认状态：灰色 */
        color: var(--tg-base-cpf-input-style-placeholder-color);
        transition: color 0.2s;

        /* 输入状态：变更为输入文字颜色 (白色) */
        &.is-typing {
          color: var(--tg-base-cpf-input-color);
        }
      }
    }

    input {
      width: 100%;
      line-height: var(--tg-base-cpf-input-line-height);
      color: var(--tg-base-cpf-input-color);
      font-size: var(--tg-base-cpf-input-font-size);
      font-weight: var(--tg-base-cpf-input-font-weight);
      background-color: transparent;
      position: relative;
      z-index: 10;

      &::placeholder {
        opacity: 0;
      }
    }
  }
}

.border-placeholder {
  opacity: 0;
  background: linear-gradient(to top, var(--tg-base-cpf-input-background-color) 50%, transparent 50%);
}

.border-placeholder-move {
  transform: translateY(-50%);
  opacity: 1;
}
</style>
