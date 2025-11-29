<script setup lang="ts">
import { IconKeyboardDelete, IconKeyboardDeleteCh, IconKeyboardHide } from '@tg/icons'

defineOptions({ name: 'SSBaseNumericKeypad' })
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
    <div @click.stop="emit('keyDelete')">
      <IconKeyboardDelete style="color: var(--ss-spt-base-numeric-keypad-color1);" />
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
    <div class="del" style="font-size: 20rem" @click.stop="emit('keyDelete')">
      <IconKeyboardDeleteCh style="color: var(--ss-spt-base-numeric-keypad-color1);" />
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
    <div style="font-size: 20rem" @click.stop="emit('keyHide')">
      <IconKeyboardHide style="color: var(--ss-spt-base-numeric-keypad-color1);" />
    </div>
  </div>
</template>

<style>
:root {
  --ss-numeric-keypad-bg: #fff;
  --ss-numeric-keypad-hover-bg: #f23038;
  --ss-spt-base-numeric-keypad-color1: #0d2245;
  --ss-spt-base-numeric-keypad-color2: #fff;
}
</style>

<style lang="scss" scoped>
.base-numeric-keypad {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-row-gap: 1rem;
  grid-column-gap: 1rem;
  font-size: 18rem;
  font-weight: 600;
  color: var(--ss-spt-base-numeric-keypad-color1);
  user-select: none;

  &.ch {
    grid-row-gap: 5rem;
    grid-column-gap: 4rem;

    > div {
      border-radius: 6rem;
    }
  }

  > div {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--ss-numeric-keypad-bg);
    text-align: center;
    cursor: pointer;

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: var(--ss-numeric-keypad-hover-bg);
        color: var(--ss-spt-base-numeric-keypad-color2);
      }
    }

    &.max {
      font-size: 14rem;
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
