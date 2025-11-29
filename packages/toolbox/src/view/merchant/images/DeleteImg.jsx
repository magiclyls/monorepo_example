import React, {useEffect, useRef, useState} from 'react'
import { Upload, message, Button, Image, List, Empty, Select, Input, Space } from 'antd'
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons'
import {imagesDelete, imagesList} from "@/services/api.js";

const { Dragger } = Upload

export default function ImageDropList() {
  const [treeData, setTreeData] = useState(null)
  const [dirName, setDirName] = useState(undefined)
  const [items, setItems] = useState([]) // [{ uid, name, url, baseName }]
  const seenRef = useRef(new Set()) // 记录已添加（区分大小写的 baseName）

  // 提取不带后缀的文件名（保留大小写）
  const getBaseName = (filename) => {
    const idx = filename.lastIndexOf('.')
    return idx > 0 ? filename.slice(0, idx) : filename
  }

  const handleChange = (info) => {
    const files = info.fileList.map((f) => f.originFileObj).filter(Boolean)
    if (files.length) addFiles(files)
  }

  const addFiles = (files) => {
    const next = []
    const dupNames = []

    for (const file of files) {
      const base = getBaseName(file.name)
      if (seenRef.current.has(base)) {
        dupNames.push(file.name)
        continue
      }
      seenRef.current.add(base)
      const url = URL.createObjectURL(file)
      next.push({
        uid: `${base}-${file.lastModified}-${file.size}`,
        name: file.name,
        baseName: base,
        url,
      })
    }

    if (dupNames.length) message.warning(`已忽略重复文件（同名不同后缀也算重复，区分大小写）：${dupNames.join('、')}`)
    if (next.length) setItems((prev) => [...prev, ...next])
  }

  const handleRemove = async (item) => {
    const imgName = item.baseName
    const [res, err] = await imagesDelete({file: imgName, dirName})
    if (!err) {
      message.success(`删除成功 ${imgName}`)

      setItems((prev) => {
        const target = prev.find((x) => x.uid === item.uid)
        if (target) {
          URL.revokeObjectURL(target.url)
          seenRef.current.delete(target.baseName)
        }
        return prev.filter((x) => x.uid !== item.uid)
      })
    }

  }

  const hasItems = items.length > 0

  useEffect(() => {
    async function fetchTree() {
      try {
        const [res, error] = await imagesList()
        if (!error) {
          setTreeData((res?.children || []).map(item => {
            return {
              value: item.title,
              label: item.title,
            }
          }))

        }
      } catch (error) {
        message.error('加载目录树失败: ' + error.message)
      } finally {
      }
    }

    fetchTree()
  }, [])

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Select
            value={dirName}
            className="w-[200px]"
            options={treeData}
            onChange={(value) => {
              setDirName(value)
            }}
            placeholder="选择图片文件夹"
          />
        </div>
        <Dragger
          accept="image/*"
          multiple
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleChange}
          className="rounded-2xl bg-white hover:bg-gray-50 transition shadow-sm"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{fontSize: 48}}/>
          </p>
          <p className="text-lg">拖拽图片到这里，或点击选择文件</p>
          <p className="text-gray-500">仅在本地读取文件名与预览，不会上传到服务器</p>
        </Dragger>
        {/*<div className="mt-6">*/}
        {/*  <Space.Compact style={{ width: '100%' }}>*/}
        {/*    <Input placeholder="输入图片名称" />*/}
        {/*    <Button type="primary">删除</Button>*/}
        {/*  </Space.Compact>*/}
        {/*</div>*/}
        <div className="mt-6">
          {hasItems ? (
            <List
              bordered
              dataSource={items}
              className="rounded-2xl overflow-hidden bg-white shadow-sm"
              renderItem={(item) => (
                <List.Item
                  className="flex items-center justify-between"
                  actions={[
                    <Button
                      key="delete"
                      type="text"
                      danger
                      icon={<DeleteOutlined/>}
                      onClick={() => handleRemove(item)}
                    >
                      删除
                    </Button>,
                  ]}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.url}
                      width={48}
                      height={48}
                      alt={item.name}
                      className="rounded-lg object-cover"
                      preview={{src: item.url}}
                    />
                    <div className="font-medium break-all">{item.baseName}</div>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div className="py-10 bg-white rounded-2xl shadow-sm">
              <Empty description="暂无图片，试试拖拽添加"/>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">选择删除目录</h3>
          <p className="text-gray-600">只能选择一级目录进行删除。</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800">拖入图片</h3>
          <p className="text-gray-600">将 <code
            className="bg-gray-100 px-1 rounded">public</code> 目录中的图片拖入页面，只会获取图片名称（不包含后缀），同名图片会自动去重。
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800">删除图片</h3>
          <p className="text-gray-600">点击删除按钮，将删除该名称下的所有图片。</p>
        </div>
      </div>

    </div>
  )
}
