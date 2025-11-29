import { Local } from './storage'

/**
 * 获取用户登录token
 * @returns {string | undefined}
 */
export function getToken() {
  return Local.get<string>('STORAGE_TOKEN_KEY')?.value
}

/**
 * 设置用户登录token
 * @param {string} token
 * @returns {void}
 */
export function setToken(token: string) {
  Local.set('STORAGE_TOKEN_KEY', token)
}

/**
 * 删除用户登录token
 * @returns {void}
 */
export function removeToken() {
  Local.remove('STORAGE_TOKEN_KEY')
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
