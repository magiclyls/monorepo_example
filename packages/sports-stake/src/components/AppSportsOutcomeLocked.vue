<script setup lang='ts'>
import { IconUniLock } from '@tg/icons'

defineOptions({
  name: 'AppSportsOutcomeLocked',
})
withDefaults(defineProps<{ size?: 'none' | 'normal' }>(), {
  size: 'normal',
})
</script>

<template>
  <div class="outcome-locked" :class="[size]">
    <div class="icon">
      <IconUniLock />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.outcome-locked {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--ss-spt-outcome-locked-bg1);
  pointer-events: none;
  border-radius: 4rem;
  user-select: none;
  -webkit-user-select: none;
  .icon {
    font-size: 14rem;
    width: 100%;
    min-height: 21rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
    color: var(--ss-spt-outcome-locked-color1);
  }
  &.normal {
    padding: 7rem 10.5rem;
    .icon {
      padding: 16rem 0;
    }
  }
  &.none {
    padding: 0;
    .icon {
      padding: 0;
    }
  }
}
</style>
