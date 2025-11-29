import React, {useEffect, useMemo, useState} from "react"
import { Form, Input, Select, Button, Card, message, Space } from "antd"
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import {createBranch, getCurrentBranch, getDev} from "@/services/api.js";
import 'github-markdown-css/github-markdown-light.css'

const { Option } = Select

const mdStr = `
# 项目开发流程文档

## 1. 创建开发分支

在开始开发前，请先通过\`当前地址\`创建分支：


## 2. 开发与合并流程

- 开发完成后，将代码 **合并到 \`dev\` 分支**。
- 合并完成后，即可准备提测。

---

## 3. 提测流程

在 **SG-提测群** 提交测试申请，格式如下：

- **需求描述**：新增 Yellow Bat 场馆游戏
- **提测环境**：\`dev\`
- **JIRA 链接**：[https://jira.sh9h.com/browse/STAK-23681](https://jira.sh9h.com/browse/STAK-23681)
- **项管人员**：@EddieBsg @Rajesh1218 @guwen001
- **后端开发**：@felix7218
- **测试人员**：@maker136
- **前端开发**：@xxx

---

## 4. A01 测试环境流程

1. <span style="color:red;">⚠️测试完成需要更新A01，前端开发自己确认下次发版本是否会更新到生产（找测试和顾问确认），没问题才合并申请更新</span>
2. 将对应分支 ** <a href="https://git.sh9h.com/sg-frontend/web/TG-Frontend/-/merge_requests/new" target="_blank" rel="noopener noreferrer">提交 PR</a>** 给 **Mount** 或 **Roger** 审批。
3. 审批通过后，由审批人员将代码更新至 **A01 测试环境**。
4. 更新完成后，会通知对应的开发人员，确认代码已部署至 A01。

---

## 5. 上线流程

1. 测试或项目管理会发出 **上线需求内容**。
2. 直接将 **release** 分支合并到 **main**
3. 在Max提供的jira发版链接中填写好对应的发版内容（根据具体情况，下面是所有的项目和发版命令）
   -  前端项目
   -  stake-h5（btf，x02，win6）
   -  afun-h5 (btm)
   -  ph-h5 (btb)
   -  前端打包命令（全站）
   -  build:production:a01
   -  build:production:btb
   -  build:production:btf
   -  build:production:wi6
   -  build:production:x02
   -  build:production:btm

---

## ✅ 流程总结

1. [创建分支](http://localhost:9001/mer/branch)
2. 开发完成 → 合并到 \`dev\`
3. 提交测试申请（SG-提测群）
4. 提交 PR → Mount/Roger 审批 → 部署到 A01
5. 上线 → 将release合并到main → 更新正式环境

`

export default function BranchForm() {
  const [form] = Form.useForm();
  const [branchType, setBranchType] = useState(null)
  const [projectList, setProjectList] = useState([])
  const currentUser = localStorage.getItem("username") // 替换成当前登录用户
  const formvalues = Form.useWatch([], form)

  const branchValue = useMemo(() => {
    if (formvalues) {
      return getBranchValue(formvalues)
    }
    return ''
  }, [formvalues])

  function getBranchValue(values){
    const { project, branchType, branchName, creator } = values
    // 按顺序组装：名称-项目-功能-说明-时间
    const result = [creator, project, branchType, branchName, getCurrentDate()]
      .filter(Boolean)
      .join("_")

    return result
  }

  const getPlaceholder = () => {
    switch (branchType) {
      case "feature":
        return "请输入新功能描述"
      case "jira":
        return "请输入JIRA单号"
      case "test":
        return "测试分支"
      default:
        return "请选择分支类型"
    }
  }

  function getCurrentDate (){
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}${month}${day}`
  }

  const onFinish = async (values) => {
    if (form.getFieldValue('branch') !== 'main') {
      message.error('必须基于 main 分支创建')
      return
    }

    const [res, err] = await createBranch({
      branchValue
    })
    if (!err) {
      message.success(res)
      form.resetFields()
      init()
    }
  }

  const init = async () => {
    const [res, err] = await getCurrentBranch()
    if (!err) {
      form.setFieldsValue({
        branch: res
      })
    }
  }

  const initProject = async () => {
    const [res, error] = await getDev()
    if (!error) {
      setProjectList((res || []).map(item => {
        return {
          ...item,
          loading: false,
        }
      }))
    }
  }

  useEffect(() => {
    init()
    initProject()
  }, [])
  return (
    <div className="bg-gray-50 p-6">
      <div className="flex gap-1">
        <Card className="w-[500px] shadow-lg rounded-2xl">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* 分支名 (禁用) */}
            <Form.Item label="当前分支" name="branch">
              <Input
                placeholder="自动生成"
                disabled
                suffix={<Button size="small" type="link" onClick={() => init()}>刷新</Button>}
              />
            </Form.Item>

            {/* 项目选择 */}
            <Form.Item
              label="选择项目"
              name="project"
              rules={[{ required: true, message: "请选择项目" }]}
            >
              <Select placeholder="请选择项目">
                {
                  [
                    ...projectList,
                    {
                      key: 'new-project',
                      name: <span className="text-red-500">新增项目</span>
                    }
                  ].map(item => {
                    return <Option value={item.key}>{item.key}&nbsp;&nbsp;&nbsp;({item.name})</Option>
                  })
                }
              </Select>
            </Form.Item>

            {/* 分支类型 */}
            <Form.Item
              label="选择分支类型"
              name="branchType"
              rules={[{ required: true, message: "请选择分支类型" }]}
            >
              <Select placeholder="请选择类型" onChange={(val) => setBranchType(val)}>
                <Option value="feature">新功能(feature)</Option>
                <Option value="jira">JIRA单(jira)</Option>
                <Option value="test">测试(test)</Option>
                <Option value="conflict">解决冲突(conflict)</Option>
              </Select>
            </Form.Item>

            {/* 动态输入框 */}
            {branchType && branchType !== "test" && (
              <Form.Item
                label={branchType === "feature" ? "新功能描述" : "JIRA单号"}
                name="branchName"
                rules={[{ required: true, message: getPlaceholder() }]}
              >
                <Input placeholder={getPlaceholder()} />
              </Form.Item>
            )}

            {/* 创建者 (禁用) */}
            <Form.Item
              label="创建者"
              name="creator"
              initialValue={currentUser}
              rules={[{ required: true, message: "创建者" }]}
            >
              <Input disabled />
            </Form.Item>

            {/* 提交按钮 */}
            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                创建分支：{branchValue}
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <div className="p-6 bg-white shadow-lg rounded-2xl">
          <Card className="markdown-body">
            <Markdown rehypePlugins={[rehypeRaw]}>
              {mdStr}
            </Markdown>
          </Card>
        </div>
      </div>
    </div>
  )
}
