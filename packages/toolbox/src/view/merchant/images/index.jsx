import React from 'react'
import DirectoryTree from "./DirectoryTree.jsx";
import DeleteImg from "./DeleteImg.jsx";
import { Tabs } from 'antd'

const { TabPane } = Tabs

export default function ImagesCom() {
  return <>
    <Tabs defaultActiveKey="convert">
      <TabPane tab="转换图片" key="convert">
        {/* 这里放“转换图片”的功能组件或内容 */}
        <DirectoryTree />
      </TabPane>
      <TabPane tab="删除图片" key="delete">
        {/* 这里放“删除图片”的功能组件或内容 */}
        <DeleteImg />
      </TabPane>
    </Tabs>
  </>
}
