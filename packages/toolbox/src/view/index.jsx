import React, {useEffect, useState} from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined
} from '@ant-design/icons';
import {useNavigate} from '@tanstack/react-router'
import {Button, Layout, Menu, theme, Image, Tabs, Dropdown, Typography, Avatar, Select, Space} from 'antd';
import { renderMenus } from '@/router';
import { useUserStore } from "@/store";
import {
  addKeyPath,
  flattenMenu,
  formatDate,
  setCurrentTimezone,
  getCountryName,
  TIME_ZONE_CONFIG, removeToken
} from "@/utils";
import { useAliveController } from 'react-activation'

const { Text } = Typography;

const { Header, Sider, Content } = Layout;

const TimeWithTimezone = () => {
  const [curDate, setCurDate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurDate(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, []);

  return (
    <Text>
      {formatDate(curDate)}
    </Text>
  );
};

const Index = ({ children }) => {
  const navigate = useNavigate()
  const userName = localStorage.getItem('username')
  const { dropScope }  = useAliveController()
  const [collapsed, setCollapsed] = useState(false);
  const {
    openKeys,
    setOpenKeys,
    openMenus,
    addOpenMenus,
    selectedKeys,
    setSelectKeys,
    removeOpenMenus
  } = useUserStore()

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onClick = ({ key }) => {
    if (key === 'logout') {
      removeToken()
      navigate({
        to: '/login'
      })
    }
  };

  const items = [
    {
      label: '退出',
      key: 'logout',
    }
  ];

  function menuOrTabClick(key) {
    const arr = flattenMenu(addKeyPath(renderMenus))
    const item = arr.find(i => i.key === key)

    setSelectKeys([key])

    if (item.keyPath && item.keyPath.length > 1) {
      setOpenKeys([item.keyPath[item.keyPath.length - 1]])
    }

    addOpenMenus([
      {
        ...(flattenMenu(renderMenus).find(i => i.key === key) || {})
      }
    ])
    navigate({ to: key })
  }



  useEffect(() => {
    console.log('Index加载')
  }, [])

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="flex flex-col h-full">
          <div className="demo-logo-vertical" />
          <div className="h-[64px] flex-center">
            <Image
              width={"70%"}
              src="xxx"
            />
          </div>
          <div className="flex-1 h-0 overflow-y-scroll">
            <Menu
              theme="dark"
              mode="inline"
              defaultOpenKeys={openKeys}
              defaultSelectedKeys={selectedKeys}
              selectedKeys={selectedKeys}
              onClick={(item) => {
                const key = item.key
                menuOrTabClick(key)
              }}
              items={renderMenus.filter(item => {
                return item.key !== '*' && item.key !== '/404' && item.key !== '/login'
              })}
            />
          </div>
        </div>
      </Sider>
      <Layout>
        <Header
          className="flex justify-between items-center"
          style={{ padding: 0, background: colorBgContainer }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div className="flex-center pr-[24px] gap-2">
            <Select
              defaultValue={getCountryName()}
              className="w-[120px]"
              options={TIME_ZONE_CONFIG}
              placeholder="切换时区"
              onChange={(value) => {
                setCurrentTimezone(value)
              }}
            />
            <TimeWithTimezone />
            <Dropdown menu={{ items, onClick }}>
              <Avatar
                style={{
                  backgroundColor: '#87d068',
                }}
              >
                {userName}
              </Avatar>
            </Dropdown>
          </div>
        </Header>
        <div className="px-[12px] pt-[12px]">
          <Tabs
            hideAdd
            onChange={menuOrTabClick}
            onEdit={(key, action) => {
              if (action === 'remove') {

                dropScope(key)
                const isActive = selectedKeys[0] === key

                if (!isActive) {
                  removeOpenMenus(key)
                  return;
                }


                if (openMenus.length === 2) {
                  menuOrTabClick('/')
                  removeOpenMenus(key)
                  return
                }

                const lastOpenMenu = openMenus[openMenus.length - 2]
                if (lastOpenMenu) {
                  const lastKey = lastOpenMenu.key
                  menuOrTabClick(lastKey)
                  removeOpenMenus(key)
                }
              }
            }}
            activeKey={selectedKeys[0]}
            type="editable-card"
            items={openMenus}
            tabBarStyle={{ marginBottom: 0 }}
          />
        </div>
        <Content
          style={{
            margin: '0 12px 12px',
            padding: 12,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: '0 8px 8px 8px',
            overflow: 'hidden',
            overflowY: 'auto',
            border: '1px solid #f0f0f0',
            borderTop: 'none',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default Index;
