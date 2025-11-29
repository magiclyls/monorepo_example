<script setup lang='ts'>
import { SSBaseSkeleton } from '@tg/bccomponents'

defineOptions({
  name: 'AppSportsOutrightsInfoSkeleton',
})
withDefaults(defineProps<{ num: number }>(), {
  num: 1,
})
</script>

<template>
  <div class="wrapper">
    <div v-for="i, ii in num" :key="i" class="box-outer">
      <div v-if="ii > 0" class="line" />
      <div class="box">
        <div class="left">
          <SSBaseSkeleton animated="ani-opacity" width="50rem" height="18rem" />
          <SSBaseSkeleton animated="ani-opacity" width="100rem" height="18rem" />
        </div>
        <div class="right">
          <SSBaseSkeleton animated="ani-opacity" width="20rem" height="16rem" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.wrapper {
  display: flex;
  flex-direction: column;
}
.line {
  width: 100%;
  height: 1rem;
  background-color: var(--ss-secondaryAccordion-show-more-border-color);
}
.box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14rem 20rem;
  .left {
    display: flex;
    flex-direction: column;
    > *:not(:last-child) {
      margin-bottom: 4rem;
    }
  }
}
</style>
