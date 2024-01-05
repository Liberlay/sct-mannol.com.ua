'use client'

import { request } from 'utils/request'
import { notifyError } from 'utils/errors'
import { Add } from './_components/Add/Add'
import { useState, useEffect } from 'react'
import { Button, Input, Table } from 'antd'
import { ViewAndEdit } from './_components/ViewAndEdit/ViewAndEdit'
import { PAYMENT, PROVIDER, METHOD, STATUS } from 'utils/constants'

import { PlusOutlined } from '@ant-design/icons'

import styles from './Orders.module.scss'

export const Orders = () => {
  const [orders, setOrders] = useState([])
  const dataSource = orders
  const [orderId, setOrderId] = useState('')
  const [currPage, setCurrPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalOrders, setTotalOrders] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const columns = [
    {
      title: 'Номер',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: "Ім'я",
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Прізвище',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
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

  const requestOrders = () => {
    request
      .authorized({
        url: '/orders',
        params: {
          page: currPage,
        },
      })
      .then((orders) => (setOrders(orders.data), setTotalOrders(orders.total)))
      .catch(notifyError)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    requestOrders()
  }, [currPage])

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <Button icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>
          Створити замовлення
        </Button>
        <div className={styles.search}>
          <Input.Search disabled />
        </div>
      </div>
      <Table
        rowKey={(order) => order.id}
        columns={columns}
        dataSource={dataSource}
        onRow={(order) => ({ onClick: () => (setIsViewModalOpen(true), setOrderId(order.id)) })}
        loading={loading}
        pagination={{
          size: 'default',
          total: totalOrders,
          defaultPageSize: 20,
          showSizeChanger: false,
          onChange: (value) => (setCurrPage(value), setLoading(true)),
        }}
      />
      <Add
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        requestOrders={requestOrders}
      />
      <ViewAndEdit
        isModalOpen={isViewModalOpen}
        setIsModalOpen={setIsViewModalOpen}
        orderId={orderId}
        requestOrders={requestOrders}
      />
    </div>
  )
}
