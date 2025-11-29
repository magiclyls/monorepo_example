import type { RoutePaths } from '../index'
import { getFinalUrl, isExternal } from '@tg/utils'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 路由跳转需要带上的query参数列表，在有这些参数的情况下，需要在跳转时带上这些参数
 */
export const ROUTER_QUERY_LIST = ['c', 'u']

export function useLocalRouter() {
  const router = useRouter()
  const curLangStr = ref('zh')

  const currentLang = computed(
    () => `/${curLangStr.value}`,
  )

  /**
   * 路由跳转
   * @desc 如果带有http(s)前缀，则直接替换当前页面，否则使用vue-router进行跳转
   * @param path
   */
  function push(path: RoutePaths) {
    if (!path)
      throw new Error('请传入path参数')

    if (isExternal(path)) {
      window.open(path, '_blank')
    }

    const _url = `${currentLang.value}${path}`
    console.log(_url)
    router.push(`${getFinalUrl(_url, ROUTER_QUERY_LIST)}`)
  }

  /**
   * 路由替换
   */
  function replace(path: string) {
    if (!path)
      throw new Error('请传入path参数')

    const _url = `${currentLang}${path}`

    router.replace(`${getFinalUrl(_url, ROUTER_QUERY_LIST)}`)
  }

  return {
    ...router,
    currentLang,
    push,
    replace,
  }
}
