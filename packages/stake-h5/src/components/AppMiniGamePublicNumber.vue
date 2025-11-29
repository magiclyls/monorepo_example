<script setup lang='ts'>
interface Props {
  modelValue: string
  disabled?: boolean
  min?: number
  max?: number
}
defineOptions({
  name: 'AppMiniGamePublicNumber',
})
const props = withDefaults(defineProps<Props>(), {
  disabled: undefined,
  max: 999999999,
  min: 0,
})
const emit = defineEmits(['input', 'update:modelValue', 'blur'])
const { t } = useI18n()

const formDisabled = inject('formDisabled', ref(false))

const { floatingState, setFloatingTrue, setFloatingFalse } = useFloatingVue()
const { bool: isFocus } = useBoolean(false)

const isOverMax = computed(() => +props.modelValue > props.max)
const isUnderMin = computed(() => +props.modelValue < props.min)
const errorMsg = computed(() => {
  if (isOverMax.value)
    return `${t('input_max')} "${props.max}"`
  else if (isUnderMin.value)
    return `${t('input_min')} "${props.min}"`
  return ''
})
const NumberError = computed(() => isOverMax.value || isUnderMin.value)
const _disabled = computed(() => props.disabled ?? formDisabled.value)

function onInput(e: any) {
  let v = e.target.value
  if (+v < 0)
    v = 0
  emit('input', v)
  emit('update:modelValue', v)

  nextTick(() => {
    if (NumberError.value)
      setFloatingTrue()
    else
      setFloatingFalse()
  })
}
function onFocus() {
  isFocus.value = true
  if (NumberError.value)
    setFloatingTrue()
}
function onBlur(e: any) {
  let v = e.target.value
  isFocus.value = false
  if (+v < 0)
    v = '0'
  emit('update:modelValue', v)
  emit('blur', v)
}
function onMouseenter() {
  if (NumberError.value)
    setFloatingTrue()
}
function onMouseleave() {
  if (!isFocus.value)
    setFloatingFalse()
}

defineExpose({ NumberError })
</script>

<template>
  <VTooltip :shown="floatingState" :triggers="[]" :auto-hide="false" placement="top">
    <div class="base-input group w-full flex" :class="[_disabled ? 'cursor-not-allowed' : '']">
      <div
        class="input-wrap input-box relative w-full flex grow"
        :class="[!isFocus && NumberError ? 'border-[var(--tg-text-error)]' : '']"
      >
        <input
          :value="modelValue" type="number" inputmode="decimal" :disabled="_disabled" min="0"
          class="leading[1.5] text-tg-text-white bg-tg-secondary-dark focus:border-[var(--tg-text-grey)] w-full border-[2px] rounded-l-[4px] border-solid p-[7px] p-r-0 text-[14px] font-semibold duration-[0.25s]"
          :class="[
            _disabled ? 'cursor-not-allowed opacity-[0.5]' : 'cursor-text',
          ]"
          @input="onInput" @focus="onFocus" @mouseenter="onMouseenter" @click.stop @mouseleave="onMouseleave"
          @blur="onBlur"
        >
        <template v-if="globalInitMap.currentTemplate != 4 && globalInitMap.currentTemplate != 2">
          <div v-show="$slots['right-icon']" class="right-icon">
            <slot name="right-icon" />
          </div>
        </template>
      </div>
    </div>
    <template #popper>
      <div class="tiny-menu-item-title">
        {{ errorMsg }}
      </div>
    </template>
  </VTooltip>
</template>

<style>
:root {
  --tg-base-input-style-pad-x:7px;
}
</style>

<style lang='scss' scoped>
.base-input {
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
    border-radius: var(--tg-radius-default);
    overflow: hidden;
    .right{
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
    border-radius: var(--tg-radius-default);
    background: var(--tg-secondary-dark);
    border: var(--tg-base-input-style-border);
    position: relative;
    transition: all ease .25s;
    display: flex;
    align-items: center;
    @include webTheme('white') {
      background: #F5F5F5;
    }
    @include webTheme('green') {
      border: 1px solid #055434;
    }

    &:hover:not(.error) {
      border-color: var(--tg-border-color-deep-grey);
    }

    &.readonly {
      background-color: var(--tg-secondary-main);
    }
    &.border-tg-text-error {
      border: 2px solid var(--tg-text-error);
    }

    input {
      line-height: var(--tg-base-input-line-height);
      width: 100%;
      background-color: var(--tg-base-input-style-background-color);
      color: var(--tg-text-white);
      border: none;
      outline: none;
      padding: var(--tg-base-input-style-pad-y) var(--tg-base-input-style-pad-x);
      padding-left: var(--tg-base-input-style-pad-left);
      font-weight: var(--tg-base-input-style-font-weight);
      cursor: text;
      @include webTheme('green') {
        --tg-base-input-style-background-color:transparent;
      }

      &::placeholder {
        color: var(--tg-base-input-style-placeholder-color);
        opacity: var(--tg-base-input-style-placeholder-opacity);
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
      &:disabled{
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
      padding: var(--tg-spacing-8);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .right-icon {
      padding: var(--tg-base-input-style-right-icon-pad-v) var(--tg-spacing-8);
      display: flex;
      font-size: var(--tg-font-size-base);
      align-items: center;
      justify-content: center;
    }
  }

  .radio-r-o {
    border-radius: var(--tg-radius-default) 0 0 var(--tg-radius-default);
  }

  .active {
    border-color: var(--tg-border-color-deep-grey);
  }

  .error {
    border-color: var(--tg-text-error);
  }
}
</style>
