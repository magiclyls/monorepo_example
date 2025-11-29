<script setup lang='ts'>
import { IconUniEyeOpen, IconUniEyeClose, IconUniCircleAdd, IconUniWarningColor } from '@tg/icons';

interface Props {
  modelValue?: string | number
  label?: string
  layout?: 'horizontal' | 'vertical'
  type?: 'text' | 'password' | 'number' | 'email'
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
  isInteger?: boolean
  openBorderPlaceholder?: boolean
  floatLabel?: string
  dealInputVal?: (val: string) => string
}
defineOptions({
  name: 'BaseInput',
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
  openBorderPlaceholder: false,

})
const emit = defineEmits(
  ['update:modelValue', 'input', 'blur', 'focus', 'downEnter', 'onRightButton', 'paste', 'clear', 'error'],
)
const formDisabled = inject('formDisabled', ref(false))

const { isMobile } = storeToRefs(useWindowStore())

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
const borderPlaceholder = ref(props.placeholder)


const _disabled = computed(() => props.disabled ?? formDisabled.value)
const error = computed(() => {
  if (props.msgAfterTouched)
    return isTouched.value && !!props.msg
  return !!props.msg
})
const isPassword = computed(() => props.type === 'password')

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
  if (props.dealInputVal)
    event.target.value = props.dealInputVal(event.target.value)
  let v = event.target.value
  if (isMobile.value && props.inputMode === 'decimal' && props.type === 'number' && props.isInteger) {
    v = v.replace(/[^0-9]/g, '')
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
  dealPlaceholder()
  emit('focus')
}

function onBlur() {
  if (props.clearPlaceHolderOnFocus)
    _placeholder.value = props.placeholder

  setFalse()
  !!props.modelValue && setTouchTrue()
  dealPlaceholder()
  emit('blur')
}
function dealPlaceholder() {
  if (!props.openBorderPlaceholder)
    return
  if (isFocus.value) {
    borderPlaceholder.value = ''
  }
  else {
    borderPlaceholder.value = props.placeholder
  }
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

defineExpose({ getFocus, setTouchTrue, setTouchFalse, iInput, isTouched, setBlur })
</script>

<template>
  <div class="base-input">
        <div v-if="openBorderPlaceholder" class="border-placeholder font-[500]  absolute transition-[opacity,transform]  px-[4px] duration-200 pointer-events-none top-[0px] left-[16px] z-10 leading-[20px]" :class="[{ 'border-placeholder-move': isFocus || modelValue }, modelValue && !isFocus ? 'text-[#B1BAD3]' : 'text-[var(--tg-base-input-box-border-hover-color)]']">
      {{ props.floatLabel ? props.floatLabel : props.placeholder }}
    </div>
    <div class="input-wrap" :class="{ mb0 }">
      <!-- 如果type是password，就添加一个隐藏的输入框 -->
      <input v-if="_type === 'password'" style="width:0;height:0;overflow:hidden;">
      <div ref="inputBoxRef" class="input-box" :class="[_disabled ? 'box-disabled cursor-not-allowed' : '', {
        'active': isFocus,
        'error': error && !isFocus,
        'check-dom-error': error,
        'radio-r-o': $slots['right-button'] || $slots.right,
        'readonly': readonly,
      }]
        ">
        <div v-show="$slots['left-icon']" class="left-icon">
          <slot name="left-icon" />
        </div>
        <div v-if="textarea" class="textarea-container">
          <pre aria-hidden="true">{{ modelValue }}</pre>
          <textarea ref="iTextarea" :value="modelValue" min="0" :maxlength="max" class="scroll-y"
            :placeholder="openBorderPlaceholder ? borderPlaceholder : _placeholder" :class="{ 'p-r-0': $slots['right-icon'], 'area-disabled': disabled }"
            autocomplete="new-password" :disabled="disabled" :readonly="readonly" @input="onInput" @focus="onFocus"
            @keydown.enter="keyDownEnter" @paste="onPaste" @compositionstart="onCompositionStart"
            @compositionend="onCompositionEnd" @blur="onBlur" />
        </div>
        <input v-else ref="iInput" :value="modelValue" @blur="onBlur" :step="step" min="0" :maxlength="max" :placeholder="openBorderPlaceholder ? borderPlaceholder : _placeholder"
          :type="_type" :inputMode="inputMode" :disabled="disabled" :readonly="readonly" :class="{
            'p-r-0': $slots['right-icon'],
            'p-l-0': $slots['left-icon'],
            'textCenter': textCenter,
            'readonly': readonly,
            hideSpinBtn,
          }" :autocomplete="`new-${_type}`" title="" :name="name" @input="onInput" @focus="onFocus" @paste="onPaste"
          @focusout="onFocusout" @keydown.enter="keyDownEnter" @compositionstart="onCompositionStart"
          @keydown="inputKeyDown" @compositionend="onCompositionEnd">
        <BaseButton v-if="isPassword" type="text" size="none" class="eye" @click="toggleType">
          <IconUniEyeOpen v-if="_type === 'password'" />
          <IconUniEyeClose v-else />
        </BaseButton>
        <BaseButton v-if="clearable && modelValue" type="text" size="none" class="eye" @click="onClear">
          <IconUniCircleAdd name="uni-circle-add" style="transform: rotate(45deg);" />
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
      <IconUniWarningColor class="error-icon" name="uni-warning-color" />
      <span>{{ msg }}</span>
    </div>
  </div>
</template>

<style>
:root {
  --tg-base-input-style-background-color: transparent;
  --tg-base-input-style-pad-x: var(--tg-spacing-input-padding-horizontal);
  --tg-base-input-style-pad-y: var(--tg-spacing-input-padding-vertical);
  --tg-base-input-style-right-icon-pad-v: var(--tg-spacing-8);
  --tg-base-input-style-placeholder-color: var(--tg-text-white);
  --tg-base-input-style-placeholder-opacity: 0.3;
  --tg-base-input-style-pad-left: var(--tg-base-input-style-pad-x);
  --tg-base-input-textarea-pad-x: var(--tg-spacing-8);
  --tg-base-input-textarea-pad-y: var(--tg-spacing-8);
  --tg-base-input-textarea-minheight: 2.8em;
  --tg-base-input-right-button-padding: var(--tg-spacing-button-padding-vertical-sm) var(--tg-spacing-button-padding-horizontal-sm);
  --tg-base-input-style-border: 1px solid #2F4553;
  --tg-base-input-style-font-weight: var(--tg-font-weight-semibold);
  --tg-base-input-right-button-bg: var(--tg-secondary-main);
  --tg-base-input-right-button-hover-bg: var(--tg-third-grey);
  --tg-base-input-right-button-color: var(--tg-text-white);
  --tg-base-input-right-button-min-width: auto;
  --tg-base-input-right-button-max-width: auto;
  --tg-base-input-line-height: 1.5;
  --tg-base-input-height: 41px;
  --tg-base-textarea-maxheight: 95px;
  --tg-base-input-readonly-bg-color: var(--tg-secondary-main);
  --tg-base-input-style-box-opacity: 0.5;
  --tg-input-lefticon-py: var(--tg-spacing-8);
  --tg-input-lefticon-px: var(--tg-spacing-8);
  --tg-base-input-style-bg: var(--tg-secondary-dark);
  --tg-base-input-style-shadow: var(--tg-box-shadow);
  --tg-base-input-style-text-color: var(--tg-text-white);
  --tg-base-input-style-caret-color: var(--tg-primary-active);
  --tg-base-input-box-border-hover-color: #24EE89;
}

[theme="green"] {
  --tg-base-input-style-placeholder-color: #3CB389;
  --tg-base-input-style-placeholder-opacity: 1;
  --tg-base-input-right-button-bg: #197B59;
  --tg-base-input-style-border: 2px solid #197B59;
  --tg-base-input-style-shadow: none;
  --tg-base-input-style-background-color: #02432d;
  --tg-inner-input-radius-theme-green: 4px;
  --tg-base-input-readonly-bg-color: #055434;
}

[theme="white"] {
  --tg-base-input-style-background-color: #ffffff;
  --tg-base-input-style-placeholder-color: #C1C1C1;
  --tg-base-input-style-placeholder-opacity: 1;
  --tg-base-input-style-bg: #ffffff;
  --tg-base-input-readonly-bg-color: #f5f5f5;
  --tg-base-input-right-button-bg: #e3e3e3;
  --tg-base-input-right-button-hover-bg: #d4d4d4;
  --tg-base-input-style-border: 1px solid transparent;
  --tg-base-input-style-shadow: none;
}
</style>

<style lang='scss' scoped>
.textarea-container {
  position: relative;
  width: calc(100% - 35px);
  font-size: var(--tg-font-size-default);
  flex: 1;

  pre,
  textarea {
    line-height: 1.5;
    overflow: hidden;
    white-space: break-spaces;
    word-break: break-word;
    width: 100%;
    color: var(--tg-text-white);
    background: var(--tg-base-input-style-bg);
    // box-shadow: var(--tg-box-shadow);
    // border: 2px solid var(--tg-secondary-main);
    // border-radius: var(--input-border-radius);
    letter-spacing: 0;
    font-weight: var(--tg-font-weight-semibold);
    // transition: all var(--input-transition);
    outline: 0;
    margin: 0;
    cursor: text;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    font-size: var(--tg-font-size-default);
    font-weight: var(--tg-font-weight-semibold);
    padding: var(--tg-base-input-textarea-pad-y) var(--tg-base-input-textarea-pad-x);
    transition: none;

    &::placeholder {
      color: var(--tg-text-white);
      opacity: 0.3;

      @include webTheme('green') {
        opacity: 1;
        color: #197B59;
      }

      @include webTheme('white') {
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 21px;
      }
    }
  }

  pre {
    min-height: var(--tg-base-input-textarea-minheight);
    max-height: var(--tg-base-textarea-maxheight);
  }

  textarea {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    resize: none;
    overflow: auto;
    overflow-x: hidden;
    font-weight: var(--tg-font-weight-semibold);

    &::placeholder {
      color: var(--tg-text-white);
      opacity: var(--tg-base-input-style-placeholder-opacity);

      @include webTheme('white') {
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 21px;
      }
    }
  }
}

.base-input {
.border-placeholder {
  opacity: 0;
  background: linear-gradient(to top, #0f212e 50%, transparent 50%);
}
.border-placeholder-move {
  transform: translateY(-50%);
  opacity: 1;
}
  position: relative;
  width: 100%;
  font-size: var(--tg-font-size-default);

  label {
    color: var(--tg-text-lightgrey);
    font-weight: var(--tg-font-weight-semibold);

    span {
      color: var(--tg-text-error);
    }
  }

  .msg {
    font-size: var(--tg-font-size-md);
    display: flex;
    align-items: center;
    padding-top: 8px;
    padding-bottom: 4px;
    --tg-icon-color: var(--tg-text-error-sub);

    .error-icon {
      font-size: var(--tg-font-size-xs);
    }

    span {
      font-size: var(--tg-font-size-xs);
      color: var(--tg-text-error-sub);
      margin-left: var(--tg-spacing-4);
    }
  }

  .vertical {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    label {
      margin-bottom: var(--tg-spacing-4);
    }

  }

  .horizontal {
    display: flex;
    align-items: center;

    label {
      width: 100px;
      margin-right: var(--tg-spacing-10);
    }
  }

  .input-wrap {
    width: 100%;
    position: relative;
    display: flex;
    // align-items: center;
    // box-shadow: var(--tg-base-input-style-shadow);
    border-radius: var(--tg-radius-default);
    overflow: hidden;

    .right {
      cursor: pointer;
    }

    .right-button {
      padding: var(--tg-base-input-right-button-padding);
      cursor: pointer;
      display: flex;
      border-left: none;
      border-right: none;
      white-space: nowrap;
      line-height: 1;
      color: var(--tg-base-input-right-button-color);
      font-weight: var(--tg-font-weight-semibold);
      font-size: var(--tg-font-size-default);
      background-color: var(--tg-base-input-right-button-bg);
      transition: all ease .25s;
      min-width: var(--tg-base-input-right-button-min-width);
      max-width: var(--tg-base-input-right-button-max-width);
      align-items: center;
      justify-content: center;

      @include webTheme('white') {
        &:hover {
          background-color: #d4d4d4;
        }

      }

      &:active {
        .content {
          transform: scale(0.96);
        }

      }

      &:hover:not(:active) {
        background-color: var(--tg-base-input-right-button-hover-bg);
      }
    }
  }

  .mb0 {
    margin-bottom: 0;
  }

  .input-box {
    width: 100%;
    height: var(--tg-base-input-height);
    border-radius: var(--tg-radius-default);
    background-color: var(--tg-base-input-style-bg);
    border: var(--tg-base-input-style-border);
    position: relative;
    transition: all ease .25s;
    display: flex;
    align-items: center;

    @include webTheme('green') {
      border-width: 1px;
    }

    &:hover:not(.error) {
      border-color: var(--tg-base-input-box-border-hover-color);

      @include webTheme('white') {
        border-color: #F2CA5C;
      }

      @include webTheme('green') {
        border-color: #5ECEA6;
      }
    }

    &.readonly {
      background-color: var(--tg-base-input-readonly-bg-color);
    }

    &.box-disabled {
      opacity: var(--tg-base-input-style-box-opacity);
    }

    input {
      line-height: var(--tg-base-input-line-height);
      width: 100%;
      background-color: var(--tg-base-input-style-background-color);
      color: var(--tg-base-input-style-text-color);
      border: none;
      outline: none;
      padding: var(--tg-base-input-style-pad-y) var(--tg-base-input-style-pad-x);
      padding-left: var(--tg-base-input-style-pad-left);
      font-weight: var(--tg-base-input-style-font-weight);
      cursor: text;

      // height: 20px;
      // box-sizing: content-box;
      @include webTheme('white') {
        border-radius: var(--tg-radius-default);
      }

      @include webTheme('green') {
        border-radius: var(--tg-inner-input-radius-theme-green);
        caret-color: var(--tg-base-input-style-caret-color);

      }

      &::placeholder {
        color: var(--tg-base-input-style-placeholder-color);
        opacity: var(--tg-base-input-style-placeholder-opacity);

        @include webTheme('white') {
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: 21px;
        }

        @include webTheme('green') {
          color: #197B59;
        }
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
      font-size: var(--tg-font-size-md);
      cursor: pointer;
      display: flex;
      padding: var(--tg-spacing-10) var(--tg-spacing-16);
    }

    .left-icon {
      padding: var(--tg-input-lefticon-py) var(--tg-input-lefticon-px);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .right-icon {
      padding: var(--tg-base-input-style-right-icon-pad-v) var(--tg-spacing-8);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .radio-r-o {
    border-radius: var(--tg-radius-default) 0 0 var(--tg-radius-default);
  }

  .active {
    border-color: var(--tg-base-input-box-border-hover-color);

    @include webTheme('white') {
      border-color: #F2CA5C;
    }

    @include webTheme('green') {
      border-color: #5ECEA6;
    }
  }

  .error {
    border-color: var(--tg-text-error);
  }
}
</style>
