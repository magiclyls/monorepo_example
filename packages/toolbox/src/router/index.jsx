import AnimateRouter from '@/components/AnimateRouter'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { AliveScope, KeepAlive } from 'react-activation'
import Login from '@/view/login'
import Index from '@/view/index'
import {
  Outlet,
  createRouter,
  createRoute,
  createRootRoute,
  redirect
} from '@tanstack/react-router'
import {
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import Home from '@/view/home'
import { getRoutes as getLangRoutes } from './Lang'
import Start from "@/view/start/index.jsx";
import ChangeLog from "@/view/change-log/index.jsx";  

const RootComponent = () => {
  return (
    <AliveScope>
      <Outlet />
    </AliveScope>
  )
}

const rootRoute = createRootRoute({
  component: RootComponent,
  beforeLoad: async ({ context, location }) => {
    const isPublicPath = ['/login'].includes(location.pathname)
    const token = localStorage.getItem('token')

    if (!token && !isPublicPath) {
      // 未登录且访问的不是公开页面 -> 重定向到登录
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname, // 记录来源路径
        },
      })
    }

    if (isPublicPath && token) {
      // const search = location.search
      // const redirectUrl = new URLSearchParams(search).get('redirect')
      throw redirect({
        to: '/'
      })
    }
  },
})
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  label: '项目简介',
  icon: <PieChartOutlined />,
  path: '/',
  component: () => {
    return (
      <Index>
        <AnimateRouter>
          <KeepAlive name="/">
            <Home />
          </KeepAlive>
        </AnimateRouter>
      </Index>
    )
  },
})
const updateLog = createRoute({
  getParentRoute: () => rootRoute,
  label: '更新日志',
  icon: <UsergroupAddOutlined />,
  path: '/update-log',
  component: () => {
    return (
      <Index>
        <AnimateRouter>
          <ChangeLog />
        </AnimateRouter>
      </Index>
    )
  },
})
const startRoute = createRoute({
  getParentRoute: () => rootRoute,
  label: '管理项目',
  icon: <PieChartOutlined />,
  path: '/start',
  component: () => {
    return (
      <Index>
        <AnimateRouter>
          <Start />
        </AnimateRouter>
      </Index>
    )
  },
})
//--------------------------login-----------------------------------------
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  label: '登录',
  icon: <MailOutlined />,
  component: () => {
    return (
      <AnimateRouter>
        <KeepAlive  name="/login">
          <Login />
        </KeepAlive>
      </AnimateRouter>
    )
  },
})
//--------------------------404-----------------------------------------
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  label: '404',
  icon: <MailOutlined />,
  component: () => {
    return (
      <AnimateRouter>
        <div>404</div>
      </AnimateRouter>
    )
  },
})
export const routeTree = rootRoute.addChildren(
  [
    indexRoute,
    updateLog,
    startRoute,
    loginRoute,
    getLangRoutes(rootRoute),
    notFoundRoute
  ]
)
export const getRenderMenus = (routes, prePath) => {
  prePath = prePath || ''
  const menuList = []
  routes.forEach((route) => {
    const options = route.options
    const hasChildren = route.children && route.children.length > 0
    menuList.push({
      key: prePath + options.path,
      label: options.label,
      icon: options.icon,
      children: hasChildren ? getRenderMenus(route.children, options.path) : null,
    })
  })
  return menuList
};

export const renderMenus = getRenderMenus(routeTree.children)
const router = createRouter({
  routeTree,
})

export default router
