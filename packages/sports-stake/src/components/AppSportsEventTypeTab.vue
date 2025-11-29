<script setup lang='ts'>
import { SSAppImage, SSBaseSelect } from '@tg/bccomponents'
import { useSportsConfig } from '../../config/index'

interface Props {
  list: any[]
}
defineOptions({
  name: 'AppSportsEventTypeTab',
})
defineProps<Props>()
const emit = defineEmits(['change'])
const currentTab = defineModel({ type: Number, required: true })
const { projectName } = useSportsConfig()
</script>

<template>
  <SSBaseSelect
    v-model="currentTab" :options="list" :project-name="projectName"
    style="--ss-base-select-background-color:transparent;--ss-base-select-border-color:transparent;--ss-base-select-padding:0;"
    @change="$emit('change')"
  >
    <template #label="{ data }">
      <div class="select-label" style="--ss-sport-image-error-icon-size:18rem;">
        <SSAppImage
          width="18rem" height="18rem"
          :url="data?.icon" is-cloud
        />
        <span class="ml-[8rem]">{{ data?.label }}</span>
      </div>
    </template>
  </SSBaseSelect>
</template>

<style lang='scss' scoped>
.select-label {
  font-size: 18rem;
  font-weight: 600;
  color: var(--ss-spt-event-type-tab-color1);
  display: flex;
  align-items: center;
  line-height: 25rem;
}
</style>
