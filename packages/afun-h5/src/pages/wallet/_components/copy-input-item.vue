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
  <div class="px-[10px] h-[41px] flex items-center rounded-[4px] bg-[#2F4553]">
    <slot name="label">
      <div class="flex items-center text-white font-500 text-14px">
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
