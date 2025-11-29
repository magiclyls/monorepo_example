<script setup lang="ts">
import { useBoolean } from '@tg/hooks'
import { IconUniCircleAdd, IconUniEyeClose, IconUniEyeOpen, IconUniWarningColor } from '@tg/icons'
import { onClickOutside } from '@vueuse/core'
import { computed, inject, ref, watch } from 'vue'

type InputMode = 'decimal' | 'email' | 'none' | 'numeric' | 'search' | 'tel' | 'text' | 'url'
interface Props {
  modelValue?: string | number
  label?: string
  layout?: 'horizontal' | 'vertical'

  type?: HTMLInputElement['type']

  placeholder?: string
  msg?: string
  must?: boolean
  textarea?: boolean
  mb0?: boolean
  disabled?: boolean
  max?: number | string
  step?: number | string
  msgAfterTouched?: boolean
  textCenter?: boolean
  name?: string
  readonly?: boolean
  hideSpinBtn?: boolean
  clearable?: boolean
  inputMode?: 'decimal' | 'email' | 'none' | 'numeric' | 'search' | 'tel' | 'text' | 'url'
  clearPlaceHolderOnFocus?: boolean
  showErrorMsg?: boolean
  active?: boolean
  isInteger?: boolean
  required?: boolean
  search?: boolean
  /** 搜索图标 */
  searchIcon?: string
}

defineOptions({
  name: 'AfunBaseChatInput',
})

const props = withDefaults(defineProps<Props>(), {
  layout: 'vertical',
  type: 'text',
  textarea: false,
  name: '',
  step: '1',
  inputMode: 'text',
  disabled: undefined,
  showErrorMsg: true,
  searchIcon: 'uni-search1',
})

const emit = defineEmits(
  ['update:modelValue', 'input', 'blur', 'focus', 'downEnter', 'change', 'keyEnter', 'onRightButton', 'paste', 'clear', 'error'],
)
const formDisabled = inject('formDisabled', ref(false))
const isMobile = ref(true)

const {
  bool: isTouched,
  setTrue: setTouchTrue,
  setFalse: setTouchFalse,
} = useBoolean(false)

const _type = ref(props.type)

const { bool: isFocus_, setTrue, setFalse } = useBoolean(false)
const iTextarea = ref()
const iInput = ref()
const inputBoxRef = ref()
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

const _disabled = computed(() => props.disabled ?? formDisabled.value)

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

function _onInput(event: any) {
  let v = event.target.value
  if (isMobile.value && props.inputMode === 'decimal' && props.type === 'number' && props.isInteger) {
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

function _onBlur() {
  if (props.clearPlaceHolderOnFocus)
    _placeholder.value = props.placeholder

  setFalse()
  !!props.modelValue && setTouchTrue()
  emit('blur')
}

function getFocus() {
  iTextarea.value?.focus()
  iInput.value?.focus()
  onFocus()
}

function setBlur() {
  iTextarea.value?.blur()
  iInput.value?.blur()
  _onBlur()
}

function keyDownEnter(event: KeyboardEvent) {
  emit('downEnter', event)
}

function inputKeyDown(event: KeyboardEvent) {
  if (!isMobile.value && props.inputMode === 'decimal' && props.type === 'number' && props.isInteger) {
    if (event.key === '.' || event.key === '-') {
      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()
    }
  }
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

onClickOutside(inputBoxRef, () => {
  if (isFocus_.value)
    _onBlur()
})

defineExpose({ getFocus, setTouchTrue, setTouchFalse, iInput, isTouched, setBlur })
</script>

<template>
  <div class="base-input input-chat w-full">
    <div class="input-wrap" :class="{ mb0 }">
      <!-- 如果type是password，就添加一个隐藏的输入框 -->
      <input v-if="_type === 'password'" style="width:0;height:0;overflow:hidden;">
      <div
        ref="inputBoxRef" class="input-box" :class="[_disabled ? 'box-disabled cursor-not-allowed' : '', {
          'active': isFocus_ || active,
          'error': error && !isFocus_,
          'check-dom-error': error,
          'radio-r-o': $slots['right-button'] || $slots.right,
          'readonly': readonly,
        }]
        "
      >
        <div v-show="$slots['left-icon']" class="left-icon">
          <slot name="left-icon" />
        </div>
        <div v-if="textarea" class="textarea-container">
          <pre aria-hidden="true">{{ modelValue }}</pre>
          <textarea
            ref="iTextarea" :value="modelValue" min="0" :maxlength="max" class="scroll-y"
            :placeholder="_placeholder" :class="{ 'p-r-0': $slots['right-icon'], 'area-disabled': disabled }"
            autocomplete="new-password" :disabled="disabled" :readonly="readonly" @input="_onInput" @focus="onFocus"
            @keydown.enter="keyDownEnter" @paste="onPaste" @compositionstart="onCompositionStart"
            @compositionend="onCompositionEnd"
          />
        </div>
        <input
          v-else ref="iInput" :value="modelValue" :step="step" min="0" :maxlength="max" :placeholder="_placeholder"
          :type="_type" :inputMode="inputMode" :disabled="disabled" :readonly="readonly" :class="{
            'p-r-0': $slots['right-icon'],
            'p-l-0': $slots['left-icon'],
            'textCenter': textCenter,
            'readonly': readonly,
            hideSpinBtn,
          }" :autocomplete="`new-${_type}`" title="" :name="name" @input="_onInput" @focus="onFocus" @paste="onPaste"
          @focusout="onFocusout" @keydown.enter="keyDownEnter" @compositionstart="onCompositionStart"
          @keydown="inputKeyDown" @compositionend="onCompositionEnd"
        >
        <BaseButton v-if="isPassword" type="text" size="none" class="eye" @click="toggleType">
          <IconUniEyeOpen v-if="_type === 'password'" />
          <IconUniEyeClose v-else />
        </BaseButton>
        <BaseButton v-if="clearable && modelValue" type="text" size="none" class="eye" @click="onClear">
          <IconUniCircleAdd style="transform: rotate(45deg);" />
        </BaseButton>
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
  --afun-base-input-border-radius: 6px;
  --afun-base-input-border-color: #ebebeb;
  --afun-base-input-border-color-focus: #f23038;
  --afun-base-input-padding-left: 12px;
  --afun-base-input-padding-right: 12px;
  --afun-base-input-padding-y: 11px;
  --afun-base-input-background-color: #fff;
  --afun-base-input-font-size: 14px;
  --afun-base-input-color: #0d2245;
  --afun-base-input-style-placeholder-color: #9dabc9;
  --afun-base-input-icon-size: 20px;
  --afun-base-input-icon-color: var(--tg-base-icon-color);
  --afun-base-input-line-height: 20px;
  --afun-base-input-search-icon-size: 20px;
}
</style>

<style lang='scss' scoped>
  .textarea-container {
  position: relative;
  width: calc(100% - 35px);
  font-size: 14px;
  flex: 1;

  pre,
  textarea {
    line-height: 1.5;
    overflow: hidden;
    white-space: break-spaces;
    word-break: break-word;
    width: 100%;
    /* color: #ffffff; */
    letter-spacing: 0;
    font-weight: 600;
    // transition: all var(--input-transition);
    outline: 0;
    margin: 0;
    cursor: text;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    font-size: 14px;
    font-weight: 600;
    padding: 8px 8px;
    transition: none;

    &::placeholder {
      /* color: #ffffff; */
      /* opacity: 0.3; */

      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: 21px;
    }
  }

  pre {
    color: #ffffff;
    min-height: 2.8em;
    max-height: 95px;
    opacity: 0;
  }

  textarea {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    resize: none;
    overflow: auto;
    overflow-x: hidden;
    font-weight: 600;

    &::placeholder {
      /* color: #ffffff; */
      opacity: 0.3;

      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: 21px;
    }
  }
}

.base-input {
  width: 100%;
  display: flex;
  border-radius: var(--afun-base-input-border-radius);
  border: 1px solid var(--afun-base-input-border-color);
  padding-left: var(--afun-base-input-padding-left);
  padding-right: var(--afun-base-input-padding-right);
  background-color: var(--afun-base-input-background-color);
  font-size: 14px;

  label {
    color: #b1bad3;
    font-weight: 600;

    span {
      color: #ff4d4f;
    }
  }

  .msg {
    font-size: 18px;
    display: flex;
    align-items: center;
    padding-top: 8px;
    padding-bottom: 4px;
    color: #f2708a;

    .error-icon {
      font-size: 12px;
    }

    span {
      font-size: 12px;
      color: #f2708a;
      margin-left: 4px;
    }
  }

  .vertical {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    label {
      margin-bottom: 4px;
    }
  }

  .horizontal {
    display: flex;
    align-items: center;

    label {
      width: 100px;
      margin-right: 10px;
    }
  }

  .input-wrap {
    width: 100%;
    position: relative;
    display: flex;
    // align-items: center;
    overflow: hidden;

    .right {
      cursor: pointer;
    }

    .right-button {
      padding: var(--afun-base-input-right-button-padding);
      cursor: pointer;
      display: flex;
      border-left: none;
      border-right: none;
      white-space: nowrap;
      line-height: 1;
      color: #ffffff;
      font-weight: 600;
      font-size: 14px;
      background-color: #2f4553;
      transition: all ease 0.25s;
      min-width: auto;
      max-width: auto;
      align-items: center;
      justify-content: center;

      &:hover {
        background-color: #d4d4d4;
      }

      &:active {
        .content {
          transform: scale(0.96);
        }
      }

      &:hover:not(:active) {
        background-color: #557086;
      }
    }
  }

  .mb0 {
    margin-bottom: 0;
  }

  .input-box {
    width: 100%;
    height: auto;
    /* height: 38px; */
    /* border-radius: 4px; */
    /* background-color: #0f212e; */
    /* border: 2px solid #e3e3e3; */

    position: relative;
    transition: all ease 0.25s;
    display: flex;
    align-items: center;

    &:hover:not(.error) {
      border-color: #f2ca5c;
    }

    &.readonly {
      /* background-color: #0f212e; */
    }

    &.box-disabled {
      opacity: 0.5;
    }

    input {
      line-height: 1.5;
      width: 100%;
      /* background-color: #ffffff; */
      border: none;
      outline: none;
      cursor: text;

      // height: 20px;
      // box-sizing: content-box;
      border-radius: 4px;

      &::placeholder {
        color: #c1c1c1;

        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 21px;
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
      font-size: 18px;
      cursor: pointer;
      display: flex;
      padding: 10px 16px;
    }

    .left-icon {
      padding: 8px 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .right-icon {
      padding: 8px 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .radio-r-o {
    border-radius: 4px 0 04px;
  }

  .active {
    border-color: #f2ca5c;
  }

  .error {
    border-color: #ed4163;
  }

  .left {
    border-right: 1px solid var(--afun-base-input-border-color);
    padding-right: 8px;
    margin-right: 8px;
  }

  .search {
    font-size: var(--afun-base-input-search-icon-size);
    display: flex;
    justify-content: center;
    align-items: center;
    --tg-base-icon-color: var(--afun-base-input-icon-color);
    margin-right: 8px;
  }

  &.isFocus {
    border-color: var(--afun-base-input-border-color-focus);
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

      &::placeholder {
        color: var(--afun-base-input-style-placeholder-color);
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
    font-size: var(--afun-base-input-icon-size);
    display: flex;
    justify-content: center;
    align-items: center;
    --tg-base-icon-color: var(--afun-base-input-icon-color);
    margin-left: 8px;
  }
}
</style>
