<script setup lang='ts'>
import { IconUniHook, IconUniWarningColor } from '@tg/icons';

interface Props {
  modelValue: boolean
  disabled?: boolean
  shape?: 'square' | 'circle'
  msg?: string
  error?: boolean
  msgType?: 'text' | 'tooltip'
}
defineOptions({
  name: 'BaseCheckBox',
})
const props = withDefaults(defineProps<Props>(), {
  shape: 'square',
  msgType: 'text',
})
const emit = defineEmits(['update:modelValue', 'check'])

const { bool, setTrue, setFalse } = useBoolean(false)
const { bool: toolShown } = useBoolean(!!props.msg && props.msgType === 'tooltip')

const outerRef = ref()

const msgTypeText = computed(() => props.msgType === 'text')
const msgTypeTooltip = computed(() => props.msgType === 'tooltip')

onClickOutside(outerRef, () => {
  setFalse()
})

function onClick() {
  if (props.disabled)
    return

  setTrue()
  emit('update:modelValue', !props.modelValue)
  emit('check', !props.modelValue)
}
function refreshTooltipStatus() {
  toolShown.value = false
  nextTick(() => {
    toolShown.value = !!props.msg && props.msgType === 'tooltip'
  })
}

watch(() => props.msg, (a) => {
  toolShown.value = !!a && msgTypeTooltip.value
})

defineExpose({ refreshTooltipStatus })
</script>

<template>
  <div class="base-check-box">
    <div class="check-box-wrap grid grid-cols-[auto_1fr] gap-x-[8px]" :class="{ disabled }" @click="onClick">
      <VTooltip v-model:shown="toolShown" placement="bottom" :distance="10" :skidding="55" :triggers="[]">
        <span ref="outerRef" class="outer" :class="[shape, { active: modelValue, focus: bool, error }]">
          <!--  <span v-show="modelValue" class="icon" /> -->
          <IconUniHook v-show="modelValue" class="icon text-[16px]" name="uni-hook" />
        </span>
        <template #popper>
          <div class="tiny-menu-item-title">
            {{ msg }}
          </div>
        </template>
      </VTooltip>

      <span class="label">
        <slot />
      </span>
    </div>
    <div v-show="msg && msgTypeText" class="msg">
      <IconUniWarningColor class="error-icon" name="uni-warning-color" />
      <span>{{ msg }}</span>
    </div>
  </div>
</template>

<style>
:root {
  --tg-base-checkbox-error-color: var(--tg-text-error-sub);
  --tg-base-checkbox-error-border-color: var(--tg-text-error);
  --tg-base-checkbox-error-icon-size: var(--tg-font-size-md);
  --tg-base-checkbox-msg-margin-top: var(--tg-spacing-6);
  --tg-base-checkbox-error-icon-color: var(--tg-text-error-sub);
  --tg-base-checkbox-wrap-width: auto;
  --tg-base-checkbox-label-color: var(--tg-text-lightgrey);
  --tg-base-checkbox-box-width: 21px;
  --tg-base-checkbox-label-font-size: var(--tg-font-size-base);
  --tg-base-checkbox-outer-border-color: var(--tg-border-color-main);
  --tg-base-checkbox-outer-border-color-active: var(--tg-border-color-main);
}

[theme="green"] {
  --tg-base-checkbox-outer-border-color: #42bc91;
  --tg-check-box-active-theme-green: #3CB389;
  --tg-check-box-theme-green: #02432D;
}

[theme="white"] {
  --tg-base-checkbox-outer-border-color: #F2CA5C;
  --tg-check-box-theme-white: #fff;
  --tg-check-box-check-color: #555;
}
</style>

<style lang='scss' scoped>
.error-icon {
  --tg-icon-color: var(--tg-base-checkbox-error-icon-color);
}

.base-check-box {
  display: flex;
  flex-direction: column;

  .msg {
    font-size: var(--tg-font-size-md);
    display: flex;
    align-items: center;
    padding-top: 8px;
    padding-bottom: 4px;

    .error-icon {
      font-size: var(--tg-base-checkbox-error-icon-size);
    }

    span {
      font-size: var(--tg-font-size-xs);
      color: var(--tg-base-checkbox-error-color);
      margin-left: var(--tg-spacing-8);
    }
  }
}

.check-box-wrap {
  align-items: center;
  color: var(--tg-text-lightgrey);
  cursor: pointer;
  font-weight: var(--tg-font-weight-semibold);
  width: var(--tg-base-checkbox-wrap-width);

  .label {
    color: var(--tg-base-checkbox-label-color);
    font-size: var(--tg-base-checkbox-label-font-size);
  }

  &:hover {
    .outer {
      border-color: var(--tg-border-color-deep-grey);
    }
  }

  .outer {
    transition: all ease .25s;
    box-shadow: 0 1px 3px 0 #{rgba($color: var(--tg-color-black-rgb), $alpha: 0.2)},
    0 1px 2px 0 #{rgba($color: var(--tg-color-black-rgb), $alpha: 0.12)};
    border-width: var(--tg-border-width-sm);
    border-style: solid;
    border-color: var(--tg-base-checkbox-outer-border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--tg-base-checkbox-box-width);
    height: var(--tg-base-checkbox-box-width);

    @include webTheme('white') {
      box-shadow: none;

      .icon {
        color: var(--tg-check-box-check-color);
      }
    }

    @include webTheme('green') {
      background-color: var(--tg-check-box-theme-green);
    }

    .icon {
      color: var(--tg-text-white);
    }

    &:hover {
      border-color: var(--tg-border-color-deep-grey);
    }
  }

  .square {
    border-radius: var(--tg-radius-default);
  }

  .circle {
    border-radius: 100px;

    .icon {
      border-radius: 50%;
      width: var(--tg-spacing-10);
      height: var(--tg-spacing-10);
      background-color: var(--tg-text-white);
    }
  }

  .active {
    border-color: var(--tg-base-checkbox-outer-border-color-active);
    background-color: var(--tg-secondary-main);

    @include webTheme('green') {
      background-color: var(--tg-check-box-active-theme-green);
    }

    @include webTheme('white') {
      background-color: var(--tg-check-box-theme-white);
    }
  }

  .active.focus {
    border-color: var(--tg-border-color-deep-grey);
    background-color: var(--tg-secondary-main);
  }

  .focus {
    border-color: var(--tg-border-color-deep-grey);
  }

  .error {
    border-color: var(--tg-base-checkbox-error-border-color);
  }
}

.disabled {
  cursor: not-allowed;

  &:hover {
    .outer {
      border-color: var(--tg-border-color-main);
    }

    .active {
      border-color: var(--tg-border-color-deep-grey);
    }
  }

  .outer {
    cursor: not-allowed;
    opacity: 0.5;

    &:hover {
      border-color: var(--tg-border-color-main);
    }
  }

  .active {
    border-color: var(--tg-border-color-deep-grey);

    &:hover {
      border-color: var(--tg-border-color-deep-grey);
    }
  }
}
</style>
