import type { EnumLanguageKey, Language } from '@tg/types'
import { getBrandInfo } from '@tg/utils'
import { ALL_LANGUAGES, changeLanguage, getLang, LANGUAGE_MAP } from '@tg/vue-i18n'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

function toLangMap() {
  return new Map(ALL_LANGUAGES.map(l => [l.value, l]))
}

export function usePreferredLanguage() {
  const { locale } = useI18n()
  const langMap = toLangMap()
  const rawList = ref<EnumLanguageKey[]>([])
  const defaultLang = ref<EnumLanguageKey | undefined>()

  const validLangList = computed(() =>
    rawList.value.filter(v => langMap.has(LANGUAGE_MAP[v])).map(v => langMap.get(LANGUAGE_MAP[v])!),
  )

  const selectedLang = computed(() => {
    const current = langMap.get(locale.value as EnumLanguageKey)
    return current || (validLangList.value.length ? validLangList.value[0] : undefined)
  })

  // 从后台读取语言配置
  const fetcher = async () => {
    const serverLangs = (getBrandInfo('base.lang.d') as Language[]) ?? []
    const list = serverLangs.map(item => item.replace('_', '-')) as EnumLanguageKey[]
    const defaultLang = (getBrandInfo('base.default.lang')?.replace('_', '-') ?? null) as EnumLanguageKey | null
    return { list, defaultLang }
  }

  async function initLanguage(): Promise<EnumLanguageKey | null> {
    const { list, defaultLang: def } = await fetcher()
    rawList.value = Array.from(new Set(list)) as EnumLanguageKey[]
    defaultLang.value = (def ?? undefined) as EnumLanguageKey | undefined
    const lang = getLang()
    return lang
  }

  async function setLanguage(lang: EnumLanguageKey) {
    if (!langMap.has(lang))
      return
    await changeLanguage(lang)
    location.reload()
  }

  return {
    validLangList,
    selectedLang,
    initLanguage,
    setLanguage,
  }
}
