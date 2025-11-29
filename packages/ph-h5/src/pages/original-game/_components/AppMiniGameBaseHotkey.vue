<script setup lang='ts'>
interface Props {
  label: string
  hotKey: string
}
defineOptions({
  name: 'AppMiniGameBaseHotkey',
})
defineProps<Props>()
</script>

<template>
  <div class="text-tg-text-lightgrey flex items-center justify-between text-[16rem]">
    <span>
      {{ label }}
    </span>
    <div class="bg-tg-secondary shadow-tg-box-shadow text-tg-text-grey-light ml-[6rem] rounded-[4rem] px-[16rem] py-[8rem]">
      {{ hotKey }}
    </div>
  </div>
</template>

<style lang='scss' scoped></style>
