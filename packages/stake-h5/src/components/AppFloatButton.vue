<script setup lang="ts">
import { IconHeaderHome } from '@tg/icons'
import { getEnv } from '@tg/utils';

defineOptions({
  name: 'AppFloatButton',
})

const floatRef = ref<HTMLElement | null>(null)
const { width, height } = useWindowSize()
const showOriginList: string[] = [
  // 'a79163.com',
  // 'a01.168pn.com',
]
const { bool } = useBoolean(
  getEnv().DEV
  || showOriginList.includes(window.location.hostname),
)

const { x, y, style } = useDraggable(floatRef, {
  initialValue: {
    x: window.innerWidth - 108,
    y: window.innerHeight - 108,
  },
})

watchEffect(() => {
  if (x.value < 0)
    x.value = 0
  if (y.value < 0)
    y.value = 0
  if (x.value > width.value - 50)
    x.value = width.value - 50
  if (y.value > height.value - 50)
    y.value = height.value - 50
})
</script>

<template>
  <div v-if="bool" ref="floatRef" :style="style" class="parent fixed z-[99999] h-[50px] w-[50px] rounded-lg bg-red-500 p-[10px] text-white">
    <IconHeaderHome class="text-[30px]" style="color: #fff;" />

    <div class="children absolute left-0 w-full flex flex-col items-center justify-center gap-[10px] py-[10px]">
      <div class="list-parent relative h-[50px] w-[50px] flex items-center justify-center rounded-lg bg-green-500 p-[6px]">
        站点
        <AppRightButtomItem class="item-list">
          <AppChangeSite />
        </AppRightButtomItem>
      </div>
      <div class="list-parent relative h-[50px] w-[50px] flex items-center justify-center rounded-lg bg-green-500 p-[6px]">
        皮肤
        <AppRightButtomItem class="item-list">
          <AppChangeTheme />
        </AppRightButtomItem>
      </div>
      <div class="list-parent relative h-[50px] w-[50px] flex items-center justify-center rounded-lg bg-green-500 p-[6px]">
        语言
        <AppRightButtomItem class="item-list">
          <AppChangeLang />
        </AppRightButtomItem>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.parent {
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  .children {
    transition: all 0.3s;
    opacity: 0;
    bottom: 0;
    pointer-events: none;
  }

  &:hover .children {
    opacity: 1;
    bottom: 100%;
    pointer-events: auto
  }
}

.list-parent {
  .item-list {
    transition: all 0.3s;
    opacity: 0;
    pointer-events: none;
  }

  &:hover .item-list {
    opacity: 1;
    pointer-events: auto
  }
}
</style>
