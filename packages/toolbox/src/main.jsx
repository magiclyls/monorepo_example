import { createRoot } from 'react-dom/client'
import { useEffect } from 'react'
import { message as antdMessage, ConfigProvider } from 'antd'
import './index.css'
import zhCN from "antd/locale/zh_CN";
import { setMessageApi } from './utils/message'
import '@ant-design/v5-patch-for-react-19';

import {
  RouterProvider,
} from '@tanstack/react-router'
import router from '@/router'

const rootElement = document.getElementById('root')

function App() {
  const [messageApi, contextHolder] = antdMessage.useMessage()

  useEffect(() => {
    setMessageApi(messageApi)
  }, [messageApi])

  return <>
    {contextHolder}
    <ConfigProvider componentSize="large" locale={zhCN}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </>
}

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(<App />)
}
