import { createGlobalState } from '@vueuse/core'
import { useBoolean } from './useBoolean'

export const usePromoHotGate = createGlobalState(() => {
  const { bool: closeAll, setBool: setCloseAll } = useBoolean(false)
  const { bool: show, setBool: setShow } = useBoolean(false)
  return {
    closeAll,
    show,
    setShow,
    setCloseAll,
  }
})
