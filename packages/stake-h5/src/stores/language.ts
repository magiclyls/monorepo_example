import { acceptHMRUpdate, defineStore } from 'pinia'
import type { EnumLanguageKeys } from '@tg/types'
import type { EnumCurrencyKey } from '@tg/types'
import { getBrandInfo } from '@tg/utils'
import { TIMEZONEABBR } from '@tg/types'
import { ALL_LANGUAGES, changeLanguage as changeLang, getLang, LANGUAGE_MAP } from '@tg/vue-i18n'

/** 语言对应配置 */
export const languageConfig: Record<EnumLanguageKeys, {
  /** 默认货币 */
  currency: EnumCurrencyKey
}> = {
  'zh-CN': {
    currency: 'CNY',
  },
  'pt-BR': {
    currency: 'BRL',
  },
  'vi-VN': {
    currency: 'KVND',
  },
  'th-TH': {
    currency: 'THB',
  },
  'hi-IN': {
    currency: 'INR',
  },
  'en-US': {
    currency: 'USDT',
  },
  'in-ID': {
    currency: 'IDR',
  },
  'ko-KR': {
    currency: 'KRW',
  },
  'ja-JP': {
    currency: 'JPY',
  },
  'tl-PH': {
    currency: 'PHP',
  },
  'aa-AA': {
    currency: 'CNY',
  },
}


function toLangMap() {
  return new Map(ALL_LANGUAGES.map(l => [l.value, l]))
}

export const useLanguageStore = defineStore('language', () => {
  const router = useRouter()
  const { closeLeftSidebar } = useLeftSidebar()
  const brandConfig = ref(globalInitMap.allBrandInfo)
  const AllLanguages = ref(ALL_LANGUAGES)
  /** 当前选择的语言（项目里已有工具：从 localStorage / 路径 等推断） */
  const userLanguage = ref(getLang())

  const langMap = toLangMap()
  const rawList = ref<EnumLanguageKeys[]>([])

  const validLangList = computed(() => {
    const serverLangList = brandConfig.value?.base?.lang?.d ?? []
    return serverLangList.filter(v => langMap.has(LANGUAGE_MAP[v])).map(v => langMap.get(LANGUAGE_MAP[v])!)
  })

  const langTimeOffset = computed(() => AllLanguages.value.find(a => a.value === userLanguage.value)!.offset)
  const currentLangZone = computed(() => AllLanguages.value.find(a => a.value === userLanguage.value)!.zone)
  const isZhcn = computed(() => userLanguage.value === 'zh-CN')
  const isPtbr = computed(() => userLanguage.value === 'pt-BR')

  const changeUrl = (lang: EnumLanguageKeys) => {
    const currentUrl = getCurrentUrlLanguage()
    window.langChoosed = lang as any
    const _fullPath = router.currentRoute.value.fullPath.replace(
      `/${currentUrl}`,
      getLocalUrlToUrlLang(lang),
    )
    closeLeftSidebar()
    setTimeout(() => {
      location.href = `${location.origin}/${_fullPath}`
    }, 500)
  }

  async function changeLanguage(lang: EnumLanguageKeys) {
    if (!langMap.has(lang))
      return
    await changeLang(lang)
    changeUrl(lang)
  }

  return {
    AllLanguages,
    userLanguage,
    langTimeOffset,
    currentLangZone,
    validLangList,
    isZhcn,
    isPtbr,
    changeLanguage,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLanguageStore, import.meta.hot))
