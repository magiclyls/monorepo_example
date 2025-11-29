import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Card } from "antd";
import { getChangeLog, addLog } from "@/services/api.js";
import { message } from '@/utils'

export default function LogManager() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // 获取日志
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const [data, err] = await getChangeLog({
        page,
        limit
      });
      if (err) {  
        message.error("获取日志失败");
        return;
      }
      setLogs(data?.changeLogs || []);
      setTotal(data?.total || 0);
    } catch (err) {
      message.error("获取日志失败");
    }
    setLoading(false);
  };

  // 提交表单
  const onFinish = async (values) => {
    const params = {
      projectInfo: {
        name: values.project,
      },
      action: values.action,
      message: values.message,
    }
    try {
      const [data, err] = await addLog({
        log: params
      });
      if (err) {
        message.error("日志添加失败");
        return;
      }
      message.success("日志添加成功！");
      form.resetFields();
      setIsModalOpen(false);
      fetchLogs();
    } catch (err) {
      message.error("提交日志出错");
    }
  };

  const columns = [
    { title: "项目", dataIndex: ["projectInfo", "name"], key: "project" },
    { title: "操作", dataIndex: "action", key: "action" },
    { 
      title: "内容", 
      dataIndex: "message", 
      key: "message",
      render: (t) => {
        return <div className="whitespace-pre-wrap">{t}</div>
      }
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (t) => new Date(t).toLocaleString(),
    },
  ];

  useEffect(() => {
    fetchLogs();
  }, [page, limit]);

  return (
    <div className="p-3 space-y-6">
      <Card className="shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">日志列表</h2>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            添加日志
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={logs}
          rowKey="_id"
          loading={loading}
          pagination={{ 
            current: page,
            pageSize: limit,
            total,
            onChange: (page, pageSize) => {
              setPage(page);
            }
          }}
        />
      </Card>

      {/* 添加日志弹窗 */}
      <Modal
        title="添加日志"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            label="项目名称"
            name="project"
            rules={[{ required: true, message: "请输入项目名称" }]}
          >
            <Input placeholder="例如：sports-stake" />
          </Form.Item>
          <Form.Item
            label="操作"
            name="action"
            rules={[{ required: true, message: "请输入操作类型" }]}
          >
            <Input placeholder="例如：构建" />
          </Form.Item>
          <Form.Item
            label="内容"
            name="message"
            rules={[{ required: true, message: "请输入日志内容" }]}
          >
            <Input.TextArea placeholder="例如：sports-stake 引用了 lottery-h5" />
          </Form.Item>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
