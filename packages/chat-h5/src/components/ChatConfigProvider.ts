import type { PropType } from 'vue-demi'
import { defineComponent, inject, provide, reactive } from 'vue'
import { ChatLocaleSymbol, ChatProjectNameSymbol, type ConfigProviderContext, configSymbol } from '../config'

export function useLocale() {
  const local = inject<any>(ChatLocaleSymbol)
  const $$t = (key: string, params?: Record<string, unknown>) => {
    const msg = local[key]
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
export function useProjectName() {
  const projectName = inject<string>(ChatProjectNameSymbol) || 'ph-h5'
  return projectName
}

export const ChatConfigProvider = defineComponent({
  name: 'ChatConfigProvider',
  props: {
    locale: {
      type: Object as PropType<ConfigProviderContext['locale']>,
      required: true,
    },
    projectName: {
      type: Object as PropType<ConfigProviderContext['projectName']>,
      required: true,
    },
    kefuUrl: {
      type: String as PropType<ConfigProviderContext['kefuUrl']>,
      required: true,
    },
    url: {
      type: String as PropType<ConfigProviderContext['url']>,
      required: true,
    },
    userName: {
      type: String as PropType<ConfigProviderContext['userName']>,
      required: true,
    },
    lang: {
      type: String as PropType<ConfigProviderContext['lang']>,
      required: true,
    },
    sign: {
      type: String as PropType<ConfigProviderContext['sign']>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const reactiveProps = reactive(props)

    provide(ChatLocaleSymbol, props.locale)
    provide(configSymbol, reactiveProps)
    provide(ChatProjectNameSymbol, props.projectName)

    return () => slots.default?.()
  },
})
