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
  <div class="text-tg-text-lightgrey flex items-center justify-between text-[16px]">
    <span>
      {{ label }}
    </span>
    <div class="bg-[#2f4553] shadow-tg-box-shadow text-tg-text-grey-light ml-[6px] rounded-[4px] px-[16px] py-[8px]">
      {{ hotKey }}
    </div>
  </div>
</template>

<style lang='scss' scoped></style>
