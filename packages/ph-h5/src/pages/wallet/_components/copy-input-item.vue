<script setup lang='ts'>
interface Props {
  label?: string
}
defineOptions({
  name: 'AppcopyIptItem',
})
const props = defineProps<Props>()
</script>

<template>
  <div class="px-[10rem] h-[40rem] flex items-center rounded-[6rem] bg-[#F6F7F8]">
    <slot name="label">
      <div class="flex items-center">
        <slot name="icon-left" />
        {{ label }}
      </div>
    </slot>
    <div class="">
      <slot name="icon-right" />
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
