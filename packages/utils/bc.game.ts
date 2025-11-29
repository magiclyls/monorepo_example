import type { EnumCurrencyKey } from '@tg/types'
import { getEnv, getFlutterAppToken, isExternal, isFlutterApp } from './main'
import { Local, STORAGE_TOKEN_KEY } from './storage'

/**
 * 判断是不是虚拟货币
 * @param {EnumCurrencyKey} currency
 */
export function isVirtualCurrency(currency: EnumCurrencyKey) {
  const virtualList: EnumCurrencyKey[] = [
    'USDT',
    'BTC',
    'ETH',
    'BNB',
    'LTC',
    'DOGE',
    'BCH',
    'XRP',
    'EOS',
    'TRX',
    'USDC',
    'APE',
    'BUSD',
    'CRO',
    'DAI',
    'LINK',
    'SAND',
    'SHIB',
    'UNI',
    'MATIC',
  ]
  return virtualList.includes(currency)
}

/**
 * 添加或更新 URL 参数的方法
 * @param {string} key 参数名
 * @param {string} value 参数值
 */
export function addUrlParam(key: string, value: string) {
  // 获取当前的 URL
  const currentUrl = new URL(window.location.href)

  // 更新或添加参数
  currentUrl.searchParams.set(key, value)

  // 使用 history API 更新 URL（不刷新页面）
  window.history.replaceState(null, '', currentUrl.toString())
}

/**
 * 获取完整的服务器图片地址
 * @param url
 */
export function getImgUrl(url: string) {
  if (isExternal(url))
    return url

  const { VITE_CASINO_IMG_CLOUD_URL } = getEnv()
  const _url = `${url.startsWith('/') ? '' : '/'}${url}`
  return `${VITE_CASINO_IMG_CLOUD_URL}${_url}`
}

/**
 * 获取用户登录token
 * @returns {string | undefined}
 */
export function getToken() {
  if (isFlutterApp())
    return getFlutterAppToken()

  return Local.get<string>(STORAGE_TOKEN_KEY)?.value
}

/**
 * 设置用户登录token
 * @param {string} token
 * @returns {void}
 */
export function setToken(token: string) {
  Local.set(STORAGE_TOKEN_KEY, token)
}

/**
 * 删除用户登录token
 * @returns {void}
 */
export function removeToken() {
  Local.remove(STORAGE_TOKEN_KEY)
}

/**
 * 根据跳转的url转换成最终跳转的url，比如c参数和u参数在任何跳转都要添加到参数后面
 * @param {string} path
 * @returns {string}
 */
export function getFinalUrl(path: string, extendsQueryList: string[]) {
  if (!path)
    return ''

  /** 跳转前的URL query参数 */
  const curUrlQuery = new URL(location.href).searchParams
  curUrlQuery.forEach((value, key) => {
    if (!extendsQueryList.includes(key))
      curUrlQuery.delete(key)
  })

  const _url = new URL(`${location.origin}${path}`)

  extendsQueryList.forEach((key) => {
    if (_url.searchParams.has(key))
      curUrlQuery.delete(key)
  })

  const _query = new URLSearchParams([..._url.searchParams.entries(), ...curUrlQuery.entries()])
  const _pathname = _url.pathname

  return `${_pathname}?${_query.toString()}`
}
