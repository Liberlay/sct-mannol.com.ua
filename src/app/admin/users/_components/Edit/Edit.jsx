import { useImmer } from 'use-immer'
import { toast } from 'react-toastify'
import { request } from 'utils/request'
import { notifyError } from 'utils/errors'
import { useEffect, useState } from 'react'
import { PAYMENT, PROVIDER, METHOD, STATUS } from 'utils/constants'
import { Modal, Input, Divider, Table, Popconfirm, Button, Spin } from 'antd'
import { ViewAndEdit } from '../../../orders/_components/ViewAndEdit/ViewAndEdit'

import { LoadingOutlined } from '@ant-design/icons'

import styles from './Edit.module.scss'

export const Edit = ({ isModalOpen, setIsModalOpen, userData, setUserData, requestUsers }) => {
  const [orders, setOrders] = useState(null)
  const dataSource = orders
  const [currPage, setCurrPage] = useState(1)
  const [orderId, setOrderId] = useState(null)
  const [user, updateUser] = useImmer(userData)
  const [loading, setLoading] = useState(false)
  const [totalOrders, setTotalOrders] = useState(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const columns = [
    {
      title: 'Номер',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Оплата',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (_, order) => PAYMENT[order.paymentMethod],
    },
    {
      title: 'Служба доставки',
      dataIndex: 'provider',
      key: 'provider',
      render: (_, order) => PROVIDER[order.shipping.provider],
    },
    {
      title: 'Метод доставки',
      dataIndex: 'method',
      key: 'method',
      render: (_, order) => METHOD[order.shipping.method],
    },
    {
      title: 'Місто',
      dataIndex: 'city',
      key: 'city',
      render: (_, order) => order.shipping.city,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (_, order) => STATUS[order.status],
    },
  ]

  const reset = () => {
    setIsModalOpen(false)
    updateUser(null)
    setOrders(null)
    setUserData(null)
  }

  const handleOk = () =>
    request
      .authorized({
        url: `/users/${user.id}`,
        method: 'patch',
        data: {
          ...user,
          id: undefined,
        },
      })
      .then(() => (reset(), requestUsers(), toast('Дані користувача оновлені')))
      .catch(notifyError)

  const handleCancel = () => reset()
  const afterClose = () => reset()
  const handleConfirmDelete = () => {
    request
      .authorized({
        url: `/users/${user.id}`,
        method: 'delete',
      })
      .then(() => (reset(), requestUsers(), toast('Користувача видалено')))
      .catch(notifyError)
  }

  useEffect(() => {
    updateUser(userData)
  }, [userData])

  useEffect(() => {
    isModalOpen &&
      request
        .authorized({
          url: `/orders`,
          params: {
            userId: userData.id,
            page: currPage,
          },
        })
        .then((orders) => (setOrders(orders.data), setTotalOrders(orders.total)))
        .catch(notifyError)
  }, [isModalOpen])

  return (
    <Modal
      open={isModalOpen}
      onOk={handleOk}
      okText="Оновити"
      onCancel={handleCancel}
      cancelText="Скасувати"
      afterClose={afterClose}
      width={670}
      centered={true}
      closeIcon={false}
      footer={[
        <Popconfirm
          key="delete"
          title="Видалити користувача"
          description="Ви впевнені що хочете видалити користувача?"
          okText="Так"
          onConfirm={handleConfirmDelete}
          cancelText="Ні">
          <Button danger>Видалити користувача</Button>
        </Popconfirm>,
        user?.isAdmin ? (
          <Button
            key="removeAdmin"
            danger
            onClick={() =>
              updateUser((user) => {
                user.isAdmin = false
              })
            }>
            Видалити права адміна
          </Button>
        ) : (
          <Popconfirm
            key="addAdmin"
            title="Зробити адміном"
            description="Ви впевнені що хочете зробити користувача адміном?"
            okText="Так"
            onConfirm={() =>
              updateUser((user) => {
                user.isAdmin = true
              })
            }
            cancelText="Ні">
            <Button danger>Зробити адміном</Button>
          </Popconfirm>
        ),
        <Button key="back" onClick={handleCancel}>
          Скасувати
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Оновити
        </Button>,
      ]}>
      {user ? (
        <div className={styles.wrapper}>
          <div className={styles.top}>
            <div className={styles.userId}>{user.id}</div>
          </div>
          <Divider className={styles.divider}>Користувач</Divider>
          <div className={styles.userData}>
            <Input
              className={styles.input}
              placeholder="Ім'я"
              value={user.firstName}
              onChange={(event) =>
                updateUser((user) => ({ ...user, firstName: event.target.value }))
              }
            />
            <Input
              className={styles.input}
              placeholder="Прізвище"
              value={user.lastName}
              onChange={(event) =>
                updateUser((user) => ({ ...user, lastName: event.target.value }))
              }
            />
            <Input
              className={styles.input}
              placeholder="Email"
              value={user.email}
              onChange={(event) => updateUser((user) => ({ ...user, email: event.target.value }))}
            />
            <Input
              className={styles.input}
              placeholder="Телефон"
              value={user.phone}
              onChange={(event) => updateUser((user) => ({ ...user, phone: event.target.value }))}
            />
          </div>
          <Divider className={styles.divider}>Замовлення</Divider>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey={(record) => record.id}
            onRow={(record) => ({
              onClick: () => (setIsOrderModalOpen(true), setOrderId(record.id)),
            })}
            loading={loading}
            pagination={{
              size: 'small',
              total: totalOrders,
              defaultPageSize: 20,
              showSizeChanger: false,
              onChange: (value) => (setCurrPage(value), setLoading(true)),
            }}
            size="small"
          />
          <ViewAndEdit
            isModalOpen={isOrderModalOpen}
            setIsModalOpen={setIsOrderModalOpen}
            orderId={orderId}
          />
        </div>
      ) : (
        <div className={styles.spinner}>
          <Spin indicator={<LoadingOutlined />} size="large" />
        </div>
      )}
    </Modal>
  )
}
