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
}
defineOptions({
  name: 'BaseBcGameInput',
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
const isPassword = computed(() => props.type === 'password')

function toggleType() {
  if (_type.value === 'text')
    return _type.value = 'password'
  _type.value = 'text'
}

function onInput(event: any) {
  const v = event.target.value
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
  <div class="base-bcgame-input">
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
            :placeholder="_placeholder" :class="{ 'p-r-0': $slots['right-icon'], 'area-disabled': disabled }"
            autocomplete="new-password" :disabled="disabled" :readonly="readonly" @input="onInput" @focus="onFocus"
            @keydown.enter="keyDownEnter" @paste="onPaste" @compositionstart="onCompositionStart"
            @compositionend="onCompositionEnd" />
        </div>
        <input v-else ref="iInput" :value="modelValue" :step="step" min="0" :maxlength="max" :placeholder="_placeholder"
          :type="_type" :inputMode="inputMode" :disabled="disabled" :readonly="readonly" :class="{
            'p-r-0': $slots['right-icon'],
            'p-l-0': $slots['left-icon'],
            'textCenter': textCenter,
            'readonly': readonly,
            hideSpinBtn,
          }" :autocomplete="`new-${_type}`" title="" :name="name" @input="onInput" @focus="onFocus" @paste="onPaste"
          @focusout="onFocusout" @keydown.enter="keyDownEnter" @compositionstart="onCompositionStart"
          @compositionend="onCompositionEnd">
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
  --tg-base-bcgame-input-style-background-color: transparent;
  --tg-base-bcgame-input-style-pad-x: var(--tg-spacing-input-padding-horizontal);
  --tg-base-bcgame-input-style-pad-y: var(--tg-spacing-input-padding-vertical);
  --tg-base-bcgame-input-style-right-icon-pad-v: var(--tg-spacing-8);
  --tg-base-bcgame-input-style-placeholder-color: var(--tg-text-white);
  --tg-base-bcgame-input-style-placeholder-opacity: 0.3;
  --tg-base-bcgame-input-style-pad-left: var(--tg-base-bcgame-input-style-pad-x);
  --tg-base-bcgame-input-textarea-pad-x: var(--tg-spacing-8);
  --tg-base-bcgame-input-textarea-pad-y: var(--tg-spacing-8);
  --tg-base-bcgame-input-textarea-minheight: 2.8em;
  --tg-base-bcgame-input-right-button-padding: var(--tg-spacing-button-padding-vertical-sm) var(--tg-spacing-button-padding-horizontal-sm);
  --tg-base-bcgame-input-style-border: var(--tg-border-width-sm) solid var(--tg-border-color-main);
  --tg-base-bcgame-input-style-font-weight: var(--tg-font-weight-semibold);
  --tg-base-bcgame-input-right-button-bg: var(--tg-secondary-main);
  --tg-base-bcgame-input-right-button-hover-bg: var(--tg-third-grey);
  --tg-base-bcgame-input-right-button-color: var(--tg-text-white);
  --tg-base-bcgame-input-right-button-min-width: auto;
  --tg-base-bcgame-input-right-button-max-width: auto;
  --tg-base-bcgame-input-line-height: 1.5;
  --tg-base-bcgame-input-height: 41px;
  --tg-base-textarea-maxheight: 95px;
  --tg-base-bcgame-input-readonly-bg-color: var(--tg-secondary-main);
  --tg-base-bcgame-input-style-box-opacity: 0.5;
  --tg-input-lefticon-py: var(--tg-spacing-8);
  --tg-input-lefticon-px: var(--tg-spacing-8);
}

[theme="green"] {
  --tg-base-bcgame-input-style-placeholder-color: #00ffa6;
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
    background: var(--tg-secondary-dark);
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
    padding: var(--tg-base-bcgame-input-textarea-pad-y) var(--tg-base-bcgame-input-textarea-pad-x);
    transition: none;

    &::placeholder {
      color: var(--tg-text-white);
      opacity: 0.3;
    }
  }

  pre {
    min-height: var(--tg-base-bcgame-input-textarea-minheight);
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
      opacity: var(--tg-base-bcgame-input-style-placeholder-opacity);
    }
  }
}

.base-bcgame-input {
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
    box-shadow: var(--tg-box-shadow);
    border-radius: var(--tg-radius-md);
    overflow: hidden;

    .right {
      cursor: pointer;
    }

    .right-button {
      padding: var(--tg-base-bcgame-input-right-button-padding);
      cursor: pointer;
      display: flex;
      border-left: none;
      border-right: none;
      white-space: nowrap;
      line-height: 1;
      color: var(--tg-base-bcgame-input-right-button-color);
      font-weight: var(--tg-font-weight-semibold);
      font-size: var(--tg-font-size-default);
      background-color: var(--tg-base-bcgame-input-right-button-bg);
      transition: all ease .25s;
      min-width: var(--tg-base-bcgame-input-right-button-min-width);
      max-width: var(--tg-base-bcgame-input-right-button-max-width);
      align-items: center;
      justify-content: center;

      &:active {
        .content {
          transform: scale(0.96);
        }

      }

      &:hover:not(:active) {
        background-color: var(--tg-base-bcgame-input-right-button-hover-bg);
      }
    }
  }

  .mb0 {
    margin-bottom: 0;
  }

  .input-box {
    width: 100%;
    height: var(--tg-base-bcgame-input-height);
    border-radius: var(--tg-radius-md);
    background: var(--tg-secondary-dark);
    border: var(--tg-base-bcgame-input-style-border);
    position: relative;
    transition: all ease .25s;
    display: flex;
    align-items: center;

    &:hover:not(.error) {
      border-color: var(--tg-border-color-deep-grey);
    }

    &.readonly {
      background-color: var(--tg-base-bcgame-input-readonly-bg-color);
    }

    &.box-disabled {
      opacity: var(--tg-base-bcgame-input-style-box-opacity);
    }

    input {
      line-height: var(--tg-base-bcgame-input-line-height);
      width: 100%;
      background-color: var(--tg-base-bcgame-input-style-background-color);
      color: var(--tg-text-white);
      border: none;
      outline: none;
      padding: var(--tg-base-bcgame-input-style-pad-y) var(--tg-base-bcgame-input-style-pad-x);
      padding-left: var(--tg-base-bcgame-input-style-pad-left);
      font-weight: var(--tg-base-bcgame-input-style-font-weight);
      cursor: text;
      // height: 20px;
      // box-sizing: content-box;

      &::placeholder {
        color: var(--tg-base-bcgame-input-style-placeholder-color);
        opacity: var(--tg-base-bcgame-input-style-placeholder-opacity);
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
      padding: var(--tg-base-bcgame-input-style-right-icon-pad-v) var(--tg-spacing-8);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .radio-r-o {
    border-radius: var(--tg-radius-md) 0 0 var(--tg-radius-md);
  }

  .active {
    border-color: var(--tg-border-color-deep-grey);
  }

  .error {
    border-color: var(--tg-text-error);
  }
}
</style>
