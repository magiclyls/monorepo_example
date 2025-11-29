import type { ISelectOption } from '@tg/types'
import type { ComputedRef, Ref } from 'vue'
/**
 * @file useSelect.ts
 * @desc 用于 选择框，tab等组件
 */
import { ref, toRef } from 'vue'

export function useSelect<T extends ISelectOption>(data: T[] | ComputedRef<T[]> | Ref<T[]>, initValue?: any) {
  /** 选项列表 */
  const list = toRef(data)

  type ValueType = typeof list.value[0]['value']

  /** 选中的值 */
  const selected = ref<ValueType>(initValue ?? list.value[0].value)

  // value 转换为字符串
  const valueToLabel = (value: ValueType) => {
    const _cur = list.value.find(item => item.value === value)?.label
    console.error('valueToLabel', value, list.value)
    return _cur || ''
  }

  return {
    list,
    selected,
    valueToLabel,
  }
}
