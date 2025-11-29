import { reactive } from 'vue'
import type { Component } from 'vue'

export interface CustomRouteType {
  path: string
  component: Component
}

export type CustomRouteTypeShow = CustomRouteType & { show: boolean }

type PathType = CustomRouteType['path']
type ComponentType = CustomRouteType['component']

export class CustomRouter {
  routes: CustomRouteTypeShow[]
  state: { currentRoute: PathType }
  routeMap: Map<PathType, ComponentType>
  history: PathType[] = []
  query: Record<string, string> = {}
  backQuery: Record<string, string> = {}

  constructor(routes: CustomRouteType[]) {
    this.routes = routes.map((item, index) => {
      return {
        ...item,
        show: index === 0,
      }
    })

    if (!this.routes.find(route => route.path === '/'))
      throw new Error('请配置根路径 /')

    this.state = reactive({
      currentRoute: '/',
    })

    this.routeMap = new Map()
    this.history = []
    // 初始化路由映射
    routes.forEach((route) => {
      this.routeMap.set(route.path, route.component)
    })

    // 初始化缓存名称，第一个默认缓存
    if (this.routes[0].component?.name)
      this.history.push(this.routes[0].component.name)
  }

  push(path: PathType, query: Record<string, any> = {}) {
    if (this.routeMap.has(path)) {
      this.state.currentRoute = path
      this.query = query

      // 设置缓存名称
      const component = this.routeMap.get(path)
      if (component?.name)
        this.history.push(component.name)
    }
    else {
      console.error(`路由不存在 path:${path}`)
    }
  }

  back(backQuery: Record<string, any> = {}) {
    if (this.history.length > 1) {
      this.history.pop()
      this.backQuery = backQuery
      this.state.currentRoute = this.routes[this.history.length - 1].path
    }
  }

  get currentComponent() {
    return this.routeMap.get(this.state.currentRoute)
  }

  get currentPath() {
    return this.state.currentRoute
  }
}
