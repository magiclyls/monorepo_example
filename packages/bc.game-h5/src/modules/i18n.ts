import type { App } from 'vue'
import type { Locale } from 'vue-i18n'
import { createI18n } from 'vue-i18n'

type RouteNameKey = 'zh' | 'en' | 'pt' | 'vi' | 'th' | 'hi'

interface LangConfig {
  /** 对应后端语言 */
  backend: string
  /** 对应前端语言 */
  frontend: string
}

type RouteLangToLocalLang = {
  [key in RouteNameKey]: LangConfig;
}

/** 路由语言和前后端语言映射表 */
const routeLangToLocalLang: RouteLangToLocalLang = {
  zh: {
    backend: 'zh_CN',
    frontend: 'zh-CN',
  },
  en: {
    backend: 'en_US',
    frontend: 'en-US',
  },
  pt: {
    backend: 'pt_BR',
    frontend: 'pt-BR',
  },
  vi: {
    backend: 'vi_VN',
    frontend: 'vi-VN',
  },
  th: {
    backend: 'th_TH',
    frontend: 'th-TH',
  },
  hi: {
    backend: 'hi_IN',
    frontend: 'hi-IN',
  },
}

export const i18n = createI18n({
  legacy: false,
  locale: '',
  messages: {},
})

const localesMap = Object.fromEntries(
  Object.entries(import.meta.glob('../../locales/*.yml'))
    .map(([path, loadLocale]) => [path.match(/([\w-]*)\.yml$/)?.[1], loadLocale]),
) as Record<Locale, () => Promise<{ default: Record<string, string> }>>

export const availableLocales = Object.keys(localesMap)

const loadedLanguages: string[] = []

function setI18nLanguage(lang: Locale) {
  i18n.global.locale.value = lang as any
  if (typeof document !== 'undefined')
    document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

export async function loadLanguageAsync(lang: string): Promise<Locale> {
  // 如果是相同的语言
  if (i18n.global.locale.value === lang)
    return setI18nLanguage(lang)

  // 如果已经加载过语言
  if (loadedLanguages.includes(lang))
    return setI18nLanguage(lang)

  // 如果没有加载过语言
  const messages = await localesMap[lang]()
  i18n.global.setLocaleMessage(lang, messages.default)
  loadedLanguages.push(lang)
  return setI18nLanguage(lang)
}

export function getCurrentLangInfo() {
  return i18n
}

/**
 * 获取系统语言对应的本地 路由语言
 *
 * 如果没有匹配到，返回英文
 *
 * zh-CN -> zh
 */
export function getSystemLangToRouteLang(): RouteNameKey {
  const lang = navigator.language
  for (const item in routeLangToLocalLang) {
    const map = routeLangToLocalLang[item as RouteNameKey]
    if (map.frontend === lang)
      return item as RouteNameKey
  }

  return 'en'
}

/** 获取当前url的显示语言 */
export function getCurrentRouteName(): RouteNameKey | undefined {
  const routeLang: any = window.location.pathname.split('/')[1]
  const langKeys = Object.keys(routeLangToLocalLang) as RouteNameKey[]
  if (langKeys.includes(routeLang))
    return routeLang as RouteNameKey
}

/**
 * 获取当前路由对应语言的信息（对应前后端的语言字符串）
 * @returns
 */
export function getCurrentLanguageInfo(): LangConfig {
  try {
    const _curRouteName = getCurrentRouteName()
    if (_curRouteName)
      return routeLangToLocalLang[_curRouteName]
    else
      throw new Error('没有匹配到路由语言')
  }
  catch (e) {
    console.log('getCurrentLanguageInfo 报错', e)
    return routeLangToLocalLang[getSystemLangToRouteLang()]
  }
}

/**
 * 判断是不是项目中的语言
 */
export function isProjectLang(lang: string) {
  const keys = Object.keys(routeLangToLocalLang)
  return keys.includes(lang)
}

export async function install(app: App<Element>) {
  app.use(i18n)
}
