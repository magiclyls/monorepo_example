<script setup lang='ts'>
import { IconUniHook } from '@tg/icons';

interface CheckItem {
  value: string
  label: string
  isChecked?: boolean
  [text: string]: any
}
interface Props {
  list: Array<CheckItem>
  modelValue: string[]
  layout?: 'horizontal' | 'vertical'
  shape?: 'square' | 'circle'
  size?: 'small' | 'mid'
}
defineOptions({
  name: 'BaseCheckboxGroup',
})
const props = withDefaults(defineProps<Props>(), {
  layout: 'vertical',
  shape: 'square',
  size: 'small',
})
const emit = defineEmits(['update:modelValue', 'check'])
function checkValue(v: string) {
  return props.modelValue.findIndex(a => a === v) > -1
}
function onItemChecked(v: string, item: CheckItem) {
  item.isChecked = !item.isChecked
  const arr: string[] = cloneDeep(props.modelValue)
  if (checkValue(v))
    arr.splice(arr.findIndex(a => a === v), 1)

  else
    arr.push(v)

  emit('update:modelValue', arr)
  emit('check', arr)
}
</script>

<template>
  <div class="base-checkbox-group" :class="[layout]">
    <div v-for="item in list" :key="item.value" class="base-check-box" @click="onItemChecked(item.value, item)">
      <span class="outer" :class="[shape, size, { active: checkValue(item.value) }]">
        <IconUniHook v-show="checkValue(item.value)" class="icon" name="uni-hook" />
      </span>
      <slot :item="item">
        {{ item.label }}
      </slot>
    </div>
  </div>
</template>

<style>
:root {
  --tg-base-checkbox-group-outer-border-color: var(--tg-border-color-main);
  --tg-base-checkbox-group-outer-border-color-active: var(--tg-border-color-main);
  --tg-base-checkbox-group-outer-background-color-active: var(--tg-secondary-main);
}

[theme="green"] {
  --tg-base-checkbox-group-outer-border-color: #42bc91;
  --tg-base-checkbox-group-outer-background-color-active: #02432D;
}
</style>

<style lang='scss' scoped>
.base-checkbox-group {
  display: flex;
}

.vertical {
  flex-direction: column;
}

.horizontal {
  flex-direction: row;
}

.base-check-box {
  display: flex;
  align-items: center;
  color: var(--tg-text-lightgrey);
  cursor: pointer;
  margin-bottom: var(--tg-spacing-8);

  &:last-of-type {
    margin-bottom: 0;
  }

  .outer {
    transition: all ease .25s;
    box-shadow: 0 1px 3px 0 #{rgba($color: var(--tg-color-black-rgb), $alpha: 0.2)},
    0 1px 2px 0 #{rgba($color: var(--tg-color-black-rgb), $alpha: 0.12)};
    margin-right: 8px;
    border-width: var(--tg-border-width-sm);
    border-style: solid;
    border-color: var(--tg-base-checkbox-group-outer-border-color);
    display: flex;
    align-items: center;
    justify-content: center;

    @include webTheme('white') {
      border-color: #F2CA5C;
      box-shadow: none;
      background-color: #ffffff;
    }

    .icon {
      color: var(--tg-text-white);
    }

    &:hover {
      border-color: var(--tg-border-color-deep-grey);
    }
  }

  .small {
    width: 21px;
    height: 21px;
  }

  .mid {
    width: 24px;
    height: 24px;
  }

  .square {
    border-radius: var(--tg-radius-default);
  }

  .circle {
    border-radius: 100px;

    .icon {
      background-image: url('');
      border-radius: 50%;
      width: var(--tg-spacing-10);
      height: var(--tg-spacing-10);
      background-color: var(--tg-text-white);
    }
  }

  .active {
    border-color: var(--tg-base-checkbox-group-outer-border-color-active);
    background-color: var(--tg-base-checkbox-group-outer-background-color-active);

    @include webTheme('white') {
      background-color: white;
    }
  }

  .active.focus {
    border-color: var(--tg-border-color-deep-grey);
    background-color: var(--tg-base-checkbox-group-outer-background-color-active);
  }

  .focus {
    border-color: var(--tg-border-color-deep-grey);
  }
}
</style>
