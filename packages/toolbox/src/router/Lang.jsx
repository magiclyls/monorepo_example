import {createRoute, Outlet} from "@tanstack/react-router";
import {ContainerOutlined, DesktopOutlined} from "@ant-design/icons";
import Index from '@/view/index'
import AnimateRouter from '@/components/AnimateRouter'
import {KeepAlive} from "react-activation";
import Lang from "@/view/merchant/lang";
import ImagesLab from "@/view/merchant/images/index.jsx";
import Branch from "@/view/merchant/branch/index.jsx";

export const getRoutes = (rootRoute) => {
  const parentKey = '/mer'

  const root = createRoute({
    getParentRoute: () => rootRoute,
    label: '基础操作',
    icon: <DesktopOutlined />,
    path: parentKey,
    component: () => {
      return (
        <Index>
          <Outlet/>
        </Index>
      )
    },
  })

  root.addChildren([
    createRoute({
      getParentRoute: () => root,
      path: '/lang',
      fullPathKey: `${parentKey}/lang`,
      label: '多语言管理',
      icon: <ContainerOutlined />,
      component: () => {
        return (
          <AnimateRouter>
            <KeepAlive name={`${parentKey}/lang`}>
              <Lang />
            </KeepAlive>
          </AnimateRouter>
        )
      },
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/images',
      fullPathKey: `${parentKey}/images`,
      label: '图片管理',
      icon: <ContainerOutlined />,
      component: () => {
        return (
          <AnimateRouter>
            <KeepAlive name={`${parentKey}/images`}>
              <ImagesLab />
            </KeepAlive>
          </AnimateRouter>
        )
      },
    }),
    createRoute({
      getParentRoute: () => root,
      path: '/branch',
      fullPathKey: `${parentKey}/branch`,
      label: '分支管理',
      icon: <ContainerOutlined />,
      component: () => {
        return (
          <AnimateRouter>
            <KeepAlive name={`${parentKey}/branch`}>
              <Branch />
            </KeepAlive>
          </AnimateRouter>
        )
      },
    })
  ])

  return root
}
