<script setup lang='ts'>
import { IconUniClose } from '@tg/icons'
defineOptions({
  name: 'BaseTag',
})
defineProps<{ text: string }>()
defineEmits(['click', 'close'])
</script>

<template>
  <div class="base-tag">
    <div class="warp">
      <span @click="$emit('click', text)">{{ text }}</span>
      <div class="icon" @click="$emit('close', text)">
        <IconUniClose />
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --base-tag-bg: var(--tg-secondary-main);
  --base-tag-text-color: var(--tg-text-lightgrey);
  --base-tag-icon-color: var(--tg-svg-default-color:);
}

[theme="green"] {
  --base-tag-bg: #02432D;
  --base-tag-text-color: #5ECEA6;
  --base-tag-icon-color: #5ECEA6;
}

[theme="greenblack"] {
  --base-tag-bg: var(--tg-primary-active);
  --base-tag-text-color: var(--tg-text-black-secondary);
  --base-tag-icon-color: var(--tg-text-black);
}

[theme="white"] {
  --base-tag-bg: #ffffff;
}
</style>

<style lang='scss' scoped>
.base-tag {
  font-size: var(--tg-font-size-xs);
  color: var(--base-tag-text-color);
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--base-tag-bg);
  border-radius: 100px;
  min-width: var(--tg-spacing-22);
  display: inline-block;
  padding: 0 var(--tg-spacing-6);
  --tg-icon-color: var(--base-tag-icon-color);
  @include webTheme('white'){
    background-color: #454545;
    color:#e8e8e8;
  }
  .warp {
    display: flex;
    align-items: center;
    padding: var(--tg-spacing-4);
    cursor: pointer;
    line-height: 1;
    > *:not(:first-child) {
      margin-left: var(--tg-spacing-8);
    }

    span {
      font-weight: var(--tg-font-weight-semibold);

      &:hover {
        color: var(--tg-text-white);
        @include webTheme('white'){
          color:white;
        }
      }

      &:active {
        transform: scale(0.96);
      }
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: var(--tg-font-size-xs);

      &:hover {
        --tg-icon-color: var(--tg-text-white);
        @include webTheme('white'){
          --tg-icon-color :white;
        }
      }

      &:active {
        transform: scale(0.96);
      }
    }
  }
}
</style>
