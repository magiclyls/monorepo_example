<script setup lang="ts">
import { IconKeyboardDelete, IconKeyboardDeleteCh, IconKeyboardHide } from '@tg/icons';

const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
})

const emit = defineEmits(['keyNum', 'keyOk', 'keyDelete', 'keyMax', 'keyHide'])

function keyUpNum(event: any) {
  const num = event.target?.dataset.num
  if (num)
    emit('keyNum', num)
}
</script>

<template>
  <div v-if="type === 'default'" class="base-numeric-keypad" @click.stop="keyUpNum">
    <div data-num="7">
      7
    </div>
    <div data-num="8">
      8
    </div>
    <div data-num="9">
      9
    </div>
    <div style="--tg-icon-color: var(--tg-text-white)" @click.stop="emit('keyDelete')">
      <IconKeyboardDelete name="keyboard-delete" />
    </div>
    <div data-num="4">
      4
    </div>
    <div data-num="5">
      5
    </div>
    <div data-num="6">
      6
    </div>
    <div class="ok-3" @click.stop="emit('keyOk')">
      ok
    </div>
    <div data-num="1">
      1
    </div>
    <div data-num="2">
      2
    </div>
    <div data-num="3">
      3
    </div>
    <div data-num="00">
      00
    </div>
    <div data-num="0">
      0
    </div>
    <div data-num=".">
      .
    </div>
  </div>
  <div v-else class="base-numeric-keypad ch" @click.stop="keyUpNum">
    <div data-num="1">
      1
    </div>
    <div data-num="2">
      2
    </div>
    <div data-num="3">
      3
    </div>
    <div class="max" @click.stop="emit('keyMax')">
      最大
    </div>
    <div data-num="4">
      4
    </div>
    <div data-num="5">
      5
    </div>
    <div data-num="6">
      6
    </div>
    <div class="del" style="font-size: 20px" @click.stop="emit('keyDelete')">
      <IconKeyboardDeleteCh name="keyboard-delete-ch" style="color: var(--tg-text-white);" />
    </div>
    <div data-num="7">
      7
    </div>
    <div data-num="8">
      8
    </div>
    <div data-num="9">
      9
    </div>
    <div data-num=".">
      .
    </div>
    <div data-num="0">
      0
    </div>
    <div data-num="00">
      00
    </div>
    <div style="font-size: 20px" @click.stop="emit('keyHide')">
      <IconKeyboardHide name="keyboard-hide" style="color: var(--tg-text-white);" />
    </div>
  </div>
</template>

<style>
:root {
  --base-numeric-keypad-bg: var(--tg-secondary-grey);
  --base-numeric-keypad-hover-bg: var(--tg-secondary-main);
}

[theme="green"] {
  --base-numeric-keypad-bg: #055434;
  --base-numeric-keypad-hover-bg: #eccb6e;
}

[theme="white"] {
  --base-numeric-keypad-bg: #ffffff;
  --base-numeric-keypad-hover-bg: #eccb6e;
}
</style>

<style lang="scss" scoped>
.base-numeric-keypad {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-row-gap: var(--tg-border-width-default);
  grid-column-gap: var(--tg-border-width-default);
  font-size: var(--tg-font-size-md);
  font-weight: var(--tg-font-weight-normal);
  color: var(--tg-text-white);
  user-select: none;

  &.ch {
    grid-row-gap: 5px;
    grid-column-gap: 4px;

    >div {
      border-radius: 6px;
    }
  }

  >div {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--base-numeric-keypad-bg);
    text-align: center;
    cursor: pointer;

    &:hover {
      background-color: var(--base-numeric-keypad-hover-bg);
    }

    &.max {
      font-size: var(--tg-font-size-base);
    }

    &.max {
      font-size: var(--tg-font-size-base);
    }
  }

  .ok-3 {
    grid-row-start: span 3;
  }

  .del {
    grid-row-start: span 2;
  }
}
</style>
