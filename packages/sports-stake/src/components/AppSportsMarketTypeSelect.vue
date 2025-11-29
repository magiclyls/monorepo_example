<script setup lang='ts'>
import type { ISelectOptionString } from '@tg/types'
import { SSBaseButton, SSBaseSelect } from '@tg/bccomponents'
import { IconUniStandard, IconUniThreeTop } from '@tg/icons'
import { isZhcn } from '@tg/vue-i18n'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSportsConfig } from '../../config/index'

interface Props {
  modelValue: string // 是否标准盘
  disabled?: boolean
  isStandard: boolean
  baseTypeOptions: ISelectOptionString[]
}
defineOptions({
  name: 'AppSportsMarketTypeSelect',
})
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'update:isStandard'])

const { projectName } = useSportsConfig()

const { t } = useI18n()

const marketTypeText = computed(() => props.isStandard
  ? t('三项投注')
  : t('标准'),
)
// 标准盘选项
const baseType = ref(props.modelValue)

function toggleMarket() {
  emit('update:isStandard', !props.isStandard)
}
function onBaseTypeChange(v: number) {
  emit('update:modelValue', v)
}

watch(() => props.modelValue, (a) => {
  baseType.value = a
})
</script>

<template>
  <div :class="isZhcn() ? 'hidden' : 'sports-market-type-select'">
    <VTooltip placement="top" :triggers="[]">
      <SSBaseButton size="sm" type="text" @click="toggleMarket">
        <IconUniThreeTop v-if="isStandard" />
        <IconUniStandard v-else />
      </SSBaseButton>
      <template #popper>
        <div class="tiny-menu-item-title">
          {{ marketTypeText }}
        </div>
      </template>
    </VTooltip>
    <SSBaseSelect
      v-model="baseType"
      :disabled="!isStandard"
      :options="baseTypeOptions"
      style="--ss-base-select-arrow-icon-margin-left:20rem;"
      :project-name="projectName" @change="onBaseTypeChange"
    />
  </div>
</template>

<style lang='scss' scoped>
.sports-market-type-select {
  display: flex;
}
</style>
