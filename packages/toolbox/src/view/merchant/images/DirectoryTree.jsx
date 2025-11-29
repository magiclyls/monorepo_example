import React, { useEffect, useState } from 'react'
import { Tree, Spin, Button } from 'antd'
import { imagesList, imagesConvert } from '@/services/api.js'
import { message } from '@/utils/message.js'

export default function DirectoryTree() {
  const [treeData, setTreeData] = useState(null)
  const [selectedDir, setSelectedDir] = useState('')
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    async function fetchTree() {
      try {
        const [res, error] = await imagesList()
        if (!error) {
          setTreeData(res?.children || [])
        }
      } catch (error) {
        message.error('加载目录树失败: ' + error.message)
      } finally {
      }
    }

    fetchTree()
  }, [])

  async function handleConvert() {
    try {
      setLoading(true)
      const [res, error] = await imagesConvert({
        dir: selectedDir
      })
      if (error) {
        return
      }

      message.success("转换成功")
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  if (!treeData) return null

  return (
    <>
      <Button
        type="primary"
        disabled={!selectedDir}
        loading={loading}
        onClick={() => handleConvert()}
      >
        开始转换 {selectedDir}
      </Button>

      <Tree
        treeData={treeData}
        showIcon
        onSelect={(arg) => {
          setSelectedDir(arg[0])
        }}
      />
    </>
  )
}
