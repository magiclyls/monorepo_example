import { createGlobalState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useApiMemberTreeList } from './useApiMemberTreeList'

export const useAreaCode = createGlobalState(() => {
  const { data: areaCodeData } = useApiMemberTreeList('011')
  const areaSearchValue = ref('')

  const areaCodeOptions = computed(() => {
    if (areaCodeData.value && areaCodeData.value.length > 0) {
      return areaCodeData.value?.map((item) => {
        // return { label: `${item.attr} ${item.name}`, value: item.attr }
        return { label: item.attr, value: item.attr }
      })
    }

    return []
  })

  const areaCodeOptionsFiltered = computed(() => {
    return areaCodeOptions.value.filter(a => a.label.toLowerCase().includes(areaSearchValue.value))
  })

  function clearAreaSearchValue() {
    setTimeout(() => {
      areaSearchValue.value = ''
    }, 200)
  }

  return {
    areaCodeData,
    areaSearchValue,
    areaCodeOptions,
    areaCodeOptionsFiltered,
    clearAreaSearchValue,
  }
})
