import React, { useState } from "react";
import { Form, Input, Button, Checkbox, ConfigProvider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {useNavigate} from "@tanstack/react-router";
import { userLogin, userRegister } from '@/services/api.js'
import { message, setToken } from '@/utils'


const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const onFinish = async (values) => {
    console.log("表单提交:", values);
    setLoading(true);
    try {
      const [data, err] = await userLogin({
        username: values.username,
        password: values.password,
      })
      if (!err && data?.token) {
        setToken(data?.token)
        localStorage.setItem('username', data?.username)
        navigate({
          to: '/'
        })
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);

      // setToken('ssdfsdfsdf')
      // navigate({
      //   to: '/'
      // })
    }
  };

  return (
    <div className="login-page flex justify-center items-center min-h-screen bg-gray-50 relative">
      {/* 背景动画 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animated-bg" />
      </div>

      {/* 登录卡片 */}
      <div className="z-10 bg-white rounded-2xl shadow-2xl p-10 w-96">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-xl font-bold text-gray-700">
            TG 前端
          </h1>
        </div>

        <Form
          name="login-form"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入账户" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="账户"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" className="mb-4">
            <Checkbox>自动登录</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
            >
              登 录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
