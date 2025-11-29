import type { EnumLanguageKey } from '@tg/types'

/**
 * 多语言映射
 *
 * key可能是任何情况（后端，本地浏览器，url地址栏，本地存储），value对应的是前端的多语言文件
 */
export const LANGUAGE_MAP: Record<string, EnumLanguageKey> = {
  // 中文
  'zh-CN': 'zh-CN',
  'zh_CN': 'zh-CN',
  'zh': 'zh-CN',
  // 英文
  'en-US': 'en-US',
  'en_US': 'en-US',
  'en': 'en-US',
  // 菲律宾语言
  'tl-PH': 'tl-PH',
  'tl_PH': 'tl-PH',
  'tl': 'tl-PH',
  // 越南
  'vi-VN': 'vi-VN',
  'vi_VN': 'vi-VN',
  'vi': 'vi-VN',
  // 葡萄语
  'pt-BR': 'pt-BR',
  'pt_BR': 'pt-BR',
  'pt': 'pt-BR',
  // 泰语
  'th-TH': 'th-TH',
  'th_TH': 'th-TH',
  'th': 'th-TH',
  // 印地
  'hi-IN': 'hi-IN',
  'hi_IN': 'hi-IN',
  'hi': 'hi-IN',
  // 印尼
  'in-ID': 'in-ID',
  'in_ID': 'in-ID',
  'in': 'in-ID',
  'id-ID': 'in-ID',
  // 韩语
  'ko-KR': 'ko-KR',
  'ko_KR': 'ko-KR',
  'ko': 'ko-KR',
  // 日语
  'ja-JP': 'ja-JP',
  'ja_JP': 'ja-JP',
  'ja': 'ja-JP',
}

/**
 * 前端和后端语言的映射
 */
export const LANGUAGE_BACKEND_MAP: Partial<Record<EnumLanguageKey, string>> = {
  'zh-CN': 'zh_CN',
  'en-US': 'en_US',
  'tl-PH': 'tl_PH',
  'vi-VN': 'vi_VN',
  'pt-BR': 'pt_BR',
  'th-TH': 'th_TH',
  'hi-IN': 'hi_IN',
  'in-ID': 'in_ID',
  'ko-KR': 'ko_KR',
  'ja-JP': 'ja_JP',
}

/**
 * 获取当前浏览器的语言
 * @return {string}
 */
export function getLangFromBrowser() {
  return navigator.language
}

/**
 * 获取本地存储的语言
 * @return {string}
 */
export function getLangFromStorage(): EnumLanguageKey | null {
  return localStorage.getItem('LANGUAGE_VUE_I18N_KEY_VITE') as EnumLanguageKey | null
}

/**
 * 将用户选择的多语言存在本地
 * @param lang {EnumLanguageKey}
 * @param {bool}
 */
export function setLangToLocalStorage(lang: EnumLanguageKey) {
  localStorage.setItem('LANGUAGE_VUE_I18N_KEY_VITE', lang)
}
