<script lang="ts" setup>
import { IconUniWarningColor } from '@tg/icons'

interface Props {
  description?: string
  icon?: string
}
defineOptions({
  name: 'PhBaseFinanceEmpty',
})
const props = withDefaults(defineProps<Props>(), {
  icon: 'info',
})
</script>

<template>
  <div class="center py-[25rem] border-dashed border border-[#6D7693] text-[#6D7693] text-[14rem] font-medium rounded-[8rem]">
    <div class="flex">
      <div class="pt-[3rem] mr-[7rem]">
        <slot v-if="$slots.icon" name="icon" />
        <IconUniWarningColor v-else class="text-[14rem] " />
      </div>
      <div class="max-w-[150rem]">
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
