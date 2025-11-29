export function useLocalRouter() {
  const router = useRouter()
  const route = useRoute()

  /**
   * 判断是否是外部链接
   * @param path
   */
  function isExternal(path: string) {
    return /^(https?:|mailto:|tel:)/.test(path)
  }

  /**
   * 判断path已经存在query参数的情况下，（?xxx=xxx）
   * query 参数如果不包含 u 则把 u 加入
   * query 参数如果不包含 c 则把 c 加入
   */
  function addParamToQuery(path: string, key: string, value?: any) {
    const isExistKey = path.includes(`&${key}=`) || path.includes(`?${key}=`)

    if (key === 'u' && !isExistKey && value)
      return `&${key}=${value}`

    if (key === 'c' && !isExistKey && value)
      return `&${key}=${value}`

    return ''
  }

  /**
   * 路由跳转
   * @desc 如果带有http(s)前缀，则直接替换当前页面，否则使用vue-router进行跳转
   * @desc 如果path中包含了 SPORTS_PLAT_ID，则替换为当前的 SPORTS_PLAT_ID
   * @param path
   * @returns
   */
  function push(path: string) {
    if (!path)
      return

    if (isExternal(path)) {
      window.open(path, '_blank')
      return
    }

    const u = router.currentRoute.value.query.u
    const c = router.currentRoute.value.query.c

    const _path = `/${getCurrentUrlLanguage()}${path}`
    const isExistQuery = _path.includes('?')

    if (isExistQuery) {
      router.push(`${_path}${addParamToQuery(_path, 'u', u)}${addParamToQuery(_path, 'c', c)}`)
    }
    else {
      let _pathStr = ''
      if (u && c)
        _pathStr = `${_path}?u=${u}&c=${c}`
      else if (u)
        _pathStr = `${_path}?u=${u}`
      else if (c)
        _pathStr = `${_path}?c=${c}`
      else
        _pathStr = _path

      router.push(_pathStr)
    }
  }

  /**
   * 路由替换
   */
  function replace(path: string) {
    const _path = `/${getCurrentUrlLanguage()}${path}`
    router.replace(_path)
  }

  /**
   * back方法
   */
  function back() {
    // 新tab游戏返回来时back无效，直接返回首页
    if (window.history.state?.back && window.history.state?.replaced
      && route.fullPath.includes('/casino/games')
      && window.history.length === 2
    )
      router.push('/')

    else
      router.back()
  }

  return {
    ...router,
    isExternal,
    push,
    replace,
    back,
  }
}
