import type { CustomRouter } from '~/utils/custom-router'

export function useCustomRouter() {
  const customRouter = inject<CustomRouter>('customRouter')

  if (!customRouter)
    throw new Error('没有找到 CustomRouter，使用BaseRouter 包裹当前组件')

  return customRouter
}
