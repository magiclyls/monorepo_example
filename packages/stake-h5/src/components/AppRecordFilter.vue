<script lang="ts" setup>
interface Props {
  modelValue: string
}
defineOptions({
  name: 'AppRecordFilter',
})
const props = withDefaults(defineProps<Props>(), {

})

const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())

const {
  selected: stateVal,
  list: stateList,
} = useSelect([
  {
    label: t('finance_other_tab_all'),
    value: '0',
  }, {
    label: t('notify_title_success'),
    value: '1',
  }, {
    label: t('failure'),
    value: '2',
  }, {
    label: t('tickets_status_in_progress'),
    value: '3',
  },
])
const { bool: showElem, setBool: setShowElemBool } = useBoolean(false)

function selectStateChange(val: string) {
  stateVal.value = val
  emit('update:modelValue', val)
}

watch(() => props.modelValue, (newVal) => {
  stateVal.value = newVal
})

onMounted(() => {
  setShowElemBool(true)
})
</script>

<template>
  <template v-if="showElem && isMobile">
    <teleport to="#tgWithMenuRight">
      <BaseSelect
        style="--tg-base-select-popper-bg-color: var(--tg-secondary-dark);--tg-base-select-popper-style-padding-y: 11px;--tg-base-select-hover-bg-color:var(--tg-secondary-dark)"
        :model-value="stateVal" popper :options="stateList" @select="selectStateChange"
      />
    </teleport>
  </template>
</template>

<style lang="scss" scoped>
</style>

<route lang="yaml">
  </route>
