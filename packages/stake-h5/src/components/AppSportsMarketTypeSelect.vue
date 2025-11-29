<script setup lang='ts'>
import { IconUniThreeTop, IconUniStandard } from '@tg/icons'

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

const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())
const { isZhcn } = storeToRefs(useLanguageStore())

const marketTypeText = computed(() => props.isStandard
  ? t('sports_three_options')
  : t('sports_standard'),
)
// 标准盘选项
const baseType = ref(props.modelValue)
// 三项投注选项
const threeType = ref('home')
const threeOptions = [
  { label: t('home_space_title'), value: 'home' },
]

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
  <div :class="isZhcn ? 'hidden' : 'sports-market-type-select'">
    <VTooltip placement="top" :triggers="isMobile ? [] : ['hover']">
      <BaseButton size="sm" type="text" @click="toggleMarket">
        <IconUniThreeTop v-if="isStandard" name="uni-three-top" />
        <IconUniStandard v-else name="uni-standard" />
      </BaseButton>
      <template #popper>
        <div class="tiny-menu-item-title">
          {{ marketTypeText }}
        </div>
      </template>
    </VTooltip>
    <BaseSelect
      v-model="baseType"
      :disabled="!isStandard"
      :options="baseTypeOptions"
      popper
      style="
        --tg-base-select-hover-bg-color:var(--tg-secondary-grey);
         "
      @select="onBaseTypeChange"
    />
    <!-- <BaseSelect
      v-else
      v-model="threeType"
      :options="threeOptions"
      popper
      disabled
    /> -->
  </div>
</template>

<style lang='scss' scoped>
.sports-market-type-select{
  display: flex;
}
</style>
