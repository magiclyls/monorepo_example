// 记录滚动相关的数据，用于Router切换时恢复滚动位置
// 提供商路由
export type DynamicProviderKeys = `${string}/casino/group/provider${string}`

// 分类路由
export type DynamicCategoryKeys = `${string}/casino/group/category${string}`

export const scrollProviderVar: Record<DynamicProviderKeys, number> = {
  '/casino/group/provider': 0,
}
export const scrollCategoryVar: Record<DynamicCategoryKeys, number> = {
  '/casino/group/category': 0,
}

/**
 * 重置提供商滚动变量的值
 */
export function resetScrollProviderVarValue() {
  for (const key in scrollProviderVar)
    scrollProviderVar[key as DynamicProviderKeys] = 0
}

/**
 * 设置提供商滚动变量的值
 * @param path 路径
 * @param value 值
 */
export function setScrollProviderVarValue(path: DynamicProviderKeys, value: number) {
  scrollProviderVar[path] = value
}

/**
 * 重置分类滚动变量的值
 */
export function resetScrollCategoryVarValue() {
  for (const key in scrollCategoryVar)
    scrollCategoryVar[key as DynamicCategoryKeys] = 0
}

/**
 * 设置分类滚动变量的值
 * @param path 路径
 * @param value 值
 */
export function setScrollCategoryVarValue(path: DynamicCategoryKeys, value: number) {
  scrollCategoryVar[path] = value
}
