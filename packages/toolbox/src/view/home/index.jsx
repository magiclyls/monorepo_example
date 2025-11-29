import { getHomeMd } from '@/services/api.js'
import {useEffect, useState} from "react";
import { CheckCircleFilled, CloseCircleFilled, SaveFilled } from '@ant-design/icons';
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { Tabs } from 'antd';
import 'github-markdown-css/github-markdown-light.css'

const Home = () => {
  const [md, setMd] = useState('')
  const [disMd, setDisMd] = useState('')
  const [tabValue, setTabValue] = useState('1')

  const [mapList, setMapList] = useState([
    {
      key: '1',
      label: '项目开发规范说明文档',
      icon: <CheckCircleFilled />,
    },
    {
      key: '2',
      label: '禁用的',
      icon: <CloseCircleFilled />,
    },
    {
      key: '3',
      label: '子项目如何使用多语言',
      icon: <SaveFilled />,
    }
  ])

  const init = async () => {
    const [res, error] = await getHomeMd()
    if (!error) {
      console.log("🚀 ~ init ~ res: ", res);
      setMd(res?.readmeMd || '')
      setDisMd(res?.disableMd || '')
    }
  }

  useEffect(() => {
    init()
  }, [])
  return (
    <div className="markdown-body">
      <Tabs
        items={mapList}
        onChange={(key) => {
          setTabValue(key)
        }}
      />

      {

        tabValue === '1' &&
          <Markdown rehypePlugins={[rehypeRaw]}>
            {md}
          </Markdown>
      }

      {
        tabValue === '2' &&
          <Markdown rehypePlugins={[rehypeRaw]}>
            {disMd}
          </Markdown>
      }

      {
        tabValue === '3' && (
          <div>
            <p>
              子项目暴露 自己的 ConfigProvider 组件，
            </p>

            <p>主项目传入对应的 local="zhCN"</p>

            <p dangerouslySetInnerHTML={{ __html: "子项目使用const { $$t } = useLocal()" }}></p>

            <p>子项目如果独立打包，只需要在自己项目的外层使用ConfigProvider就好了</p>
          </div>
        )
      }

    </div>
  );
}
export default Home;
