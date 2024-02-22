'use client'

import Link from 'next/link'
import { useSelector } from 'react-redux'
import { redirect, usePathname } from 'next/navigation'
import { ConfigProvider, theme, Layout, Menu } from 'antd'

import {
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons'

import styles from './Sidebar.module.scss'

export const Sidebar = ({ children }) => {
  const pathname = usePathname()
  const user = useSelector((state) => state.auth.user)
  const MenuItems = [
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: <Link href="/admin/orders">Замовлення</Link>,
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: <Link href="/admin/products">Товари</Link>,
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: <Link href="/admin/users">Користувачі</Link>,
    },
  ]

  if (!user?.isAdmin) redirect('/', 'replace')

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#e3b515',
        },
      }}
    >
      <Layout className={styles.wrapper} hasSider>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: '#e3b515',
            },
          }}
        >
          <Layout.Sider className={styles.wrapperLeft} collapsible breakpoint="xl">
            <div className={styles.top}>
              <ShopOutlined
                className={styles.icon}
                style={{ fontSize: '26px', color: '#fcc917' }}
              />
              <div>Mannol store</div>
            </div>
            <Menu
              className={styles.menu}
              items={MenuItems}
              defaultSelectedKeys={[pathname.replace('/admin/', '')]}
              mode="inline"
            ></Menu>
          </Layout.Sider>
        </ConfigProvider>
        <div className={styles.wrapperRight}>{children}</div>
      </Layout>
    </ConfigProvider>
  )
}
