<script setup lang='ts'>
import AppSportsSelect from '~/components/AppSportsSelect.vue'

defineOptions({ name: 'AppSportsFooter' })
</script>

<template>
  <div class="w-full my-[40px]">
    <div class="flex items-center justify-center">
      <div class="text-white opacity-50 text-[12px] mt-[8px] font-semibold mr-[8px] mb-[8px] tracking-[3px] uppercase">
        筛选盘口
      </div>
      <AppSportsSelect />
    </div>
    <div class="text-white text-center text-[12px] font-medium leading-[18px] mt-[16px] opacity-50">
      尽管我们已尽一切努力确保网站上显示的数据准确无误，但这些数据仅供参考，仅供参考。如有任何信息错误，我们概不负责。，我们概不负责。
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>
