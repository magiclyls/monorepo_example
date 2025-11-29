<script lang="ts" setup>
import { IconUniWarningColor } from '@tg/icons'

interface Props {
  description?: string
  icon?: string
}
defineOptions({
  name: 'AfunBaseFinanceEmpty',
})
const props = withDefaults(defineProps<Props>(), {
  icon: 'info',
})
</script>

<template>
  <div class="center py-[25px] border-dashed border-2 border-[#B1BAD3] text-[#B1BAD3] text-[14px] font-[600] rounded-[6px]">
    <div class="flex">
      <div class="pt-[3px] mr-[7px]">
        <slot v-if="$slots.icon" name="icon" />
        <IconUniWarningColor v-else class="text-[14px] " />
      </div>
      <div class="max-w-[150px]">
        <slot v-if="$slots.description" name="description" />
        <p v-else>
          {{ description }}
        </p>
      </div>
      <slot v-if="$slots.default" />
    </div>
  </div>
</template>

<style></style>

<style lang="scss" scoped>
</style>
