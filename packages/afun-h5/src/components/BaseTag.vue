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
  --base-tag-bg: #2f4553;
  --base-tag-text-color: #b1bad3;
  --base-tag-icon-color: #b1bad3;
}
</style>

<style lang='scss' scoped>
.base-tag {
  font-size: 12px;
  color: var(--base-tag-text-color);
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--base-tag-bg);
  border-radius: 100px;
  min-width: 22rem;
  display: inline-block;
  padding: 0 6rem;
  --tg-icon-color: var(--base-tag-icon-color);

  .warp {
    display: flex;
    align-items: center;
    padding: 4rem;
    cursor: pointer;
    line-height: 1;
    > *:not(:first-child) {
      margin-left: 8rem;
    }

    span {
      font-weight: 600;

      &:hover {
        color: #fff;
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
      font-size: 12px;

      &:hover {
        --tg-icon-color: #fff;
      }

      &:active {
        transform: scale(0.96);
      }
    }
  }
}
</style>
