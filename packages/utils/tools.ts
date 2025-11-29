import type { EnumLanguageKey } from '@tg/types'

export function getImageUrl(url: string) {
  const isAvif = document.documentElement.className.trim().split(' ').includes('avif')
  const isWebp = document.documentElement.className.trim().split(' ').includes('webp')

  if (isAvif) {
    return url.replace(/png/g, 'avif')
  }
  if (isWebp) {
    return url.replace(/png/g, 'webp')
  }
  return url
}

export function localLangToProviderLang(lang: EnumLanguageKey) {
  try {
    const values = lang.split('-')
    return values[0].toLowerCase() + values[1].toUpperCase
  }
  catch (error) {
    return lang
  }
}
export function dealLoginOrRegVal(val: string) {
  return val.replace(/[^\w@.\-+]/g, '')
}
