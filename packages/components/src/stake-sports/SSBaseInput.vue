<script setup lang='ts'>
import { useBoolean } from '@tg/hooks'
import { IconUniWarningColor } from '@tg/icons'
import { onClickOutside } from '@vueuse/core'
import { computed, inject, ref, watch } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'password' | 'number' | 'email'
  placeholder?: string
  msg?: string
  must?: boolean
  mb0?: boolean
  disabled?: boolean
  max?: number | string
  step?: number | string
  msgAfterTouched?: boolean
  textCenter?: boolean
  name?: string
  readonly?: boolean
  hideSpinBtn?: boolean
  inputMode?: 'decimal' | 'email' | 'none' | 'numeric' | 'search' | 'tel' | 'text' | 'url'
  clearPlaceHolderOnFocus?: boolean
  showErrorMsg?: boolean
  active?: boolean
  isInteger?: boolean
}
defineOptions({
  name: 'SSBaseInput',
})
const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  textarea: false,
  name: '',
  step: '1',
  inputMode: 'text',
  disabled: undefined,
  showErrorMsg: true,
})
const emit = defineEmits(
  ['update:modelValue', 'input', 'blur', 'focus', 'downEnter', 'onRightButton', 'paste', 'clear', 'error'],
)
const formDisabled = inject('formDisabled', ref(false))

const { bool: isFocus, setTrue, setFalse } = useBoolean(false)
const {
  bool: isTouched,
  setTrue: setTouchTrue,
  setFalse: setTouchFalse,
} = useBoolean(false)
const iTextarea = ref()
const iInput = ref()
const inputBoxRef = ref()
const _type = ref(props.type)
const _placeholder = ref(props.placeholder)

const _disabled = computed(() => props.disabled ?? formDisabled.value)
const error = computed(() => {
  if (props.msgAfterTouched)
    return isTouched.value && !!props.msg
  return !!props.msg
})

function toggleType() {
  if (_type.value === 'text')
    return _type.value = 'password'
  _type.value = 'text'
}

function setCaretPosition(ctrl: any, pos: number) {
  if (ctrl.setSelectionRange) {
    ctrl.type = 'text'
    ctrl.focus()
    ctrl.setSelectionRange(pos, pos)
    ctrl.type = 'number'
  }
  else if (ctrl.createTextRange) {
    const range = ctrl.createTextRange()
    range.collapse(true)
    range.moveEnd('character', pos)
    range.moveStart('character', pos)
    range.select()
  }
}

function onInput(event: any) {
  let v = event.target.value
  if (props.inputMode === 'decimal' && props.type === 'number' && props.isInteger) {
    v = v.replace(/\D/g, '')
    event.target.value = v
    setCaretPosition(event.target, 100)
  }

  emit('input', v)
  emit('update:modelValue', v)
}

function onFocus() {
  if (props.clearPlaceHolderOnFocus)
    _placeholder.value = ''

  setTrue()
  emit('focus')
}

function onBlur() {
  if (props.clearPlaceHolderOnFocus)
    _placeholder.value = props.placeholder

  setFalse()
  !!props.modelValue && setTouchTrue()
  emit('blur')
}
onClickOutside(inputBoxRef, () => {
  if (isFocus.value)
    onBlur()
})

function getFocus() {
  iTextarea.value?.focus()
  iInput.value?.focus()
  onFocus()
}

function setBlur() {
  iTextarea.value?.blur()
  iInput.value?.blur()
  onBlur()
}

function keyDownEnter(event: KeyboardEvent) {
  emit('downEnter', event)
}

function inputKeyDown(event: KeyboardEvent) {
}

function onRightButton() {
  emit('onRightButton')
}

function onPaste() {
  emit('paste')
}
function onClear() {
  emit('update:modelValue', '')
  emit('clear')
}

function onCompositionStart() {
  console.log('composition start')
}

function onCompositionEnd() {
  console.log('composition end')
}

function onFocusout() {
  if (props.clearPlaceHolderOnFocus)
    _placeholder.value = props.placeholder
}

watch(() => props.placeholder, (a) => {
  _placeholder.value = a
})

defineExpose({ getFocus, setTouchTrue, setTouchFalse, iInput, isTouched, setBlur })
</script>

<template>
  <div class="base-input">
    <div class="input-wrap" :class="{ mb0 }">
      <div
        ref="inputBoxRef" class="input-box" :class="[_disabled ? 'box-disabled cursor-not-allowed' : '', {
          'active': isFocus || active,
          'error': error && !isFocus,
          'check-dom-error': error,
          'radio-r-o': $slots['right-button'] || $slots.right,
          'readonly': readonly,
        }]
        "
      >
        <div v-show="$slots['left-icon']" class="left-icon">
          <slot name="left-icon" />
        </div>
        <input
          ref="iInput" :value="modelValue" :step="step" min="0" :maxlength="max" :placeholder="_placeholder"
          :type="_type" :inputMode="inputMode" :disabled="disabled" :readonly="readonly" :class="{
            'p-r-0': $slots['right-icon'],
            'p-l-0': $slots['left-icon'],
            'textCenter': textCenter,
            'readonly': readonly,
            hideSpinBtn,
          }" :autocomplete="`new-${_type}`" title="" :name="name" @input="onInput" @focus="onFocus" @paste="onPaste"
          @focusout="onFocusout" @keydown.enter="keyDownEnter" @compositionstart="onCompositionStart"
          @keydown="inputKeyDown"
          @compositionend="onCompositionEnd"
        >
        <div v-show="$slots['right-icon']" class="right-icon">
          <slot name="right-icon" />
        </div>
      </div>
      <div v-show="$slots['right-button']" class="right-button" :class="{ disabled }" @click.stop="onRightButton">
        <div class="content">
          <slot name="right-button" />
        </div>
      </div>
      <div v-show="$slots.right" class="right">
        <slot name="right" />
      </div>
    </div>
    <div v-show="error && showErrorMsg" class="msg">
      <IconUniWarningColor class="error-icon" />
      <span>{{ msg }}</span>
    </div>
  </div>
</template>

<style>
:root {
  --ss-base-input-style-background-color: transparent;
  --ss-base-input-style-pad-x: 10rem;
  --ss-base-input-style-pad-y: 8rem;
  --ss-base-input-style-right-icon-pad-v: 8rem;
  --ss-base-input-style-placeholder-color: #566771;
  --ss-base-input-style-placeholder-opacity: 1;
  --ss-base-input-style-pad-left: var(--ss-base-input-style-pad-x);
  --ss-base-input-textarea-pad-x: 8rem;
  --ss-base-input-textarea-pad-y: 8rem;
  --ss-base-input-textarea-minheight: 2.8em;
  --ss-base-input-right-button-padding: 13rem 16rem;
  --ss-base-input-style-border: 1rem solid #ebebeb;
  --ss-base-input-style-font-weight: 600;
  --ss-base-input-right-button-bg: #2f4553;
  --ss-base-input-right-button-hover-bg: #557086;
  --ss-base-input-right-button-color: #0d2245;
  --ss-base-input-right-button-min-width: auto;
  --ss-base-input-right-button-max-width: auto;
  --ss-base-input-line-height: 1.5;
  --ss-base-input-height: 41px;
  --ss-base-textarea-maxheight: 95px;
  --ss-base-input-readonly-bg-color: #2f4553;
  --ss-base-input-style-box-opacity: 0.5;
  --ss-input-lefticon-py: 8rem;
  --ss-input-lefticon-px: 8rem;
  --ss-base-input-style-bg: #f6f7f8;
  --ss-base-input-style-text-color: #0d2245;
  --ss-base-input-style-caret-color: #1475e1;
  --ss-base-input-box-shadow: none;
  --ss-base-input-box-active-border-color: #f2ca5c;
  --ss-base-input-box-hover-border-color: #f23038;
}
</style>

<style lang='scss' scoped>
.base-input {
  width: 100%;
  font-size: 14rem;

  label {
    color: #b1bad3;
    font-weight: 600;

    span {
      color: #ed4163;
    }
  }

  .msg {
    font-size: 18rem;
    display: flex;
    align-items: center;
    padding-top: 8rem;
    padding-bottom: 4rem;

    .error-icon {
      font-size: 12rem;
      color: #f2708a;
    }

    span {
      font-size: 12rem;
      color: #f2708a;
      margin-left: 4rem;
    }
  }

  .input-wrap {
    width: 100%;
    position: relative;
    display: flex;
    border-radius: 4rem;
    overflow: hidden;
    box-shadow: var(--ss-base-input-box-shadow);

    .right {
      cursor: pointer;
    }

    .right-button {
      padding: var(--ss-base-input-right-button-padding);
      cursor: pointer;
      display: flex;
      border-left: none;
      border-right: none;
      white-space: nowrap;
      line-height: 1;
      color: var(--ss-base-input-right-button-color);
      font-weight: 600;
      font-size: 14rem;
      background-color: var(--ss-base-input-right-button-bg);
      transition: all ease 0.25s;
      min-width: var(--ss-base-input-right-button-min-width);
      max-width: var(--ss-base-input-right-button-max-width);
      align-items: center;
      justify-content: center;

      &:active {
        .content {
          transform: scale(0.96);
        }
      }

      &:hover:not(:active) {
        background-color: var(--ss-base-input-right-button-hover-bg);
      }
    }
  }

  .mb0 {
    margin-bottom: 0;
  }

  .input-box {
    width: 100%;
    height: var(--ss-base-input-height);
    border-radius: 4rem;
    background-color: var(--ss-base-input-style-bg);
    border: var(--ss-base-input-style-border);
    position: relative;
    transition: all ease 0.25s;
    display: flex;
    align-items: center;

    &:hover:not(.error) {
      border-color: var(--ss-base-input-box-hover-border-color);
    }

    &.readonly {
      background-color: var(--ss-base-input-readonly-bg-color);
    }

    &.box-disabled {
      opacity: var(--ss-base-input-style-box-opacity);
    }

    input {
      line-height: var(--ss-base-input-line-height);
      width: 100%;
      background-color: var(--ss-base-input-style-background-color);
      color: var(--ss-base-input-style-text-color);
      border: none;
      outline: none;
      padding: var(--ss-base-input-style-pad-y) var(--ss-base-input-style-pad-x);
      padding-left: var(--ss-base-input-style-pad-left);
      font-weight: var(--ss-base-input-style-font-weight);
      cursor: text;
      &::placeholder {
        color: var(--ss-base-input-style-placeholder-color);
        opacity: var(--ss-base-input-style-placeholder-opacity);
      }

      &.textCenter {
        text-align: center;
      }

      &.hideSpinBtn {
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          appearance: none;
          margin: 0;
        }
      }

      &:disabled {
        cursor: not-allowed;
      }
    }

    .p-l-0 {
      padding-left: 0;
    }

    .p-r-0 {
      padding-right: 0;
    }

    .textCenter {
      text-align: center;
    }

    .eye {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 18rem;
      cursor: pointer;
      display: flex;
      padding: 10rem 16rem;
    }

    .left-icon {
      padding: var(--ss-input-lefticon-py) var(--ss-input-lefticon-px);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .right-icon {
      padding: var(--ss-base-input-style-right-icon-pad-v) 8rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .radio-r-o {
    border-radius: 4rem 0 0 4rem;
  }

  .active {
    border-color: var(--ss-base-input-box-active-border-color);
  }

  .error {
    border-color: #ed4163;
  }
}
</style>
