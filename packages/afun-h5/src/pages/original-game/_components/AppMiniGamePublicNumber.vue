<script setup lang='ts'>
import { useBoolean, useFloatingVue } from '@tg/hooks'
import { computed, inject, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'

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
    return `${t('最大值')} "${props.max}"`
  else if (isUnderMin.value)
    return `${t('最小值')} "${props.min}"`
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
        :class="[!isFocus && NumberError ? 'border-tg-text-error' : '']"
      >
        <input
          :value="modelValue" type="number" inputmode="decimal" :disabled="_disabled" min="0"
          class="text-[#0D2245] bg-tg-secondary-dark leading[1.5] focus:border-tg-text-grey w-full border-[2px] rounded-l-[4px] border-solid p-[7px] p-r-0 text-[13px] font-semibold duration-[0.25s]"
          :class="[
            _disabled ? 'cursor-not-allowed opacity-[0.5]' : 'cursor-text',
          ]" @input="onInput" @focus="onFocus" @mouseenter="onMouseenter" @click.stop @mouseleave="onMouseleave"
          @blur="onBlur"
        >
        <div v-show="$slots['right-icon']" class="right-icon">
          <slot name="right-icon" />
        </div>
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
  --tg-base-input-style-pad-x: 7px;
}
</style>

<style lang='scss' scoped>
.base-input {
  width: 100%;
  font-size: 14px;

  label {
    color: #b1bad3;
    font-weight: 500;

    span {
      color: #ed4163;
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
    box-shadow: var(--tg-box-shadow);
    border-radius: 4px;
    overflow: hidden;

    .right {
      cursor: pointer;
    }

    .right-button {
      padding: 13px 16px;
      cursor: pointer;
      display: flex;
      border-left: none;
      border-right: none;
      white-space: nowrap;
      line-height: 1;
      color: #fff;
      font-weight: 500;
      font-size: 14px;
      background-color: #2f4553;
      transition: all ease 0.25s;
      min-width: auto;
      max-width: auto;
      align-items: center;
      justify-content: center;

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
    border-radius: 4px;
    background: #0f212e;
    border: 2px solid #2f4553;
    position: relative;
    transition: all ease 0.25s;
    display: flex;
    align-items: center;

    &:hover:not(.error) {
      border-color: #557086;
    }

    &.readonly {
      background-color: #2f4553;
    }

    &.border-tg-text-error {
      border: 1px solid #ed4163;
    }

    input {
      line-height: 1.45;
      width: 100%;
      background-color: transparent;
      color: #fff;
      border: none;
      outline: none;
      padding: 10px;
      padding-left: 8px;
      font-weight: 500;
      cursor: text;

      &::placeholder {
        color: #b1bad3;
        opacity: 0.3;
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
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .right-icon {
      padding: 8px 8px;
      display: flex;
      font-size: 16px;
      align-items: center;
      justify-content: center;
    }
  }

  .radio-r-o {
    border-radius: 4px 0 0 4px;
  }

  .active {
    border-color: #557086;
  }

  .error {
    border-color: #ed4163;
  }
}
</style>
