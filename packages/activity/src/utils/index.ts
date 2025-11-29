import { inject } from 'vue'
import { ActivityLocaleSymbol } from '../../config'

export function useLocale() {
  const local = inject<any>(ActivityLocaleSymbol)
  const $$t = (key: string, params?: Record<string, unknown>) => {
    const msg = local[key]
    console.log(local, msg)
    if (!msg)
      return key

    return msg.replace(/\{(\w+)\}/g, (_: string, k: string) => {
      return params?.[k] != null ? String(params[k]) : `{${k}}`
    })
  }

  return {
    $$t,
  }
}
