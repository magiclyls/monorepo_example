/**
 * 是否是主题2
 *
 * @description 现阶段 wi6 是主题2
 */
export function isStyle2() {
  const siteList = ['wi6']

  return siteList.includes(getEnv().VITE_SITE_NAME)
}

/**
 * 是否是越南站点
 *
 * @description 现阶段 betbo,betff 是越南站点
 */
export function isVnSite() {
  const siteList = ['btb', 'btf']
  return siteList.includes(getEnv().VITE_SITE_NAME)
}

/**
 * 是否是新葡京 威尼斯
 *
 * @description 新葡京 威尼斯 合并了
 */
export function isXVSite() {
  const siteList = ['x02', 'v03']
  return siteList.includes(getEnv().VITE_SITE_NAME)
}

/**
 * 初始化主题
 *
 * 老板对主题不是模板1，模板2，模板3这样的概念，所以要符合任何情况的皮肤更改
 *
 * 后期可能是有些主题需要继承某些主题的样式，所以css需要动态加载
 */
export async function initTheme() {
  // 默认加载 styles/theme.css 这是默认的css
  await import('../styles/theme.css')

  // if (isStyle2())
  //   await import('../styles/theme-style2.css')
}

/**
 * H5下显示客服浮动按钮
 */
export function isShowServiceFloatSites() {
  const siteList = ['btf', 'btb']
  return isStyle2() || isXVSite() || siteList.includes(getEnv().VITE_SITE_NAME)
}
