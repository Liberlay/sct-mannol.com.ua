import dayjs from 'dayjs'
import { useState } from 'react'
import { useImmer } from 'use-immer'
import { toast } from 'react-toastify'
import { request } from 'utils/request'
import { notifyError } from 'utils/errors'
import { Modal, Button, Spin } from 'antd'
import { useUpdateEffect } from 'usehooks-ts'
import { ViewModalBase } from '../ViewModalBase/ViewModalBase'
import { EditModalBase } from '../EditModalBase/EditModalBase'

import { LoadingOutlined } from '@ant-design/icons'
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder'

import styles from './ViewAndEdit.module.scss'

export const ViewAndEdit = ({ isModalOpen, setIsModalOpen, orderId, requestOrders }) => {
  const [order, updateOrder] = useImmer(null)
  const [editEnable, setEditEnable] = useState(false)
  const handleOk = () => {
    request
      .authorized({
        url: `/orders/${orderId}`,
        method: 'patch',
        data: {
          ...order,
          user: undefined,
          id: undefined,
          key: undefined,
          status: undefined,
          shipping: {
            ...order.shipping,
            area: order.shipping.area.ref,
            city: order.shipping.city.ref,
            warehouse: order.shipping.warehouse?.ref,
          },
          products: order?.products.map(({ vendorCode, optionKey, qty }) => ({
            vendorCode,
            optionKey,
            qty,
          })),
        },
      })
      .then(() => {
        requestOrders()
        setEditEnable(false)
        setIsModalOpen(false)
        updateOrder(null)
        toast('Замовлення змінено')
      })
      .catch(notifyError)
  }

  const handleCancel = () => (updateOrder(null), setEditEnable(false), setIsModalOpen(false))

  const afterClose = () => (updateOrder(null), setEditEnable(false))

  const orderCancel = () => {
    request
      .authorized({
        url: `/orders/${orderId}/canceled`,
        method: 'post',
      })
      .then(() => {
        updateOrder((order) => {
          order.status = 'canceled'
        })
        requestOrders()
      })
      .catch(notifyError)
  }

  useUpdateEffect(() => {
    if (isModalOpen)
      request
        .authorized({
          url: `/orders/${orderId}`,
        })
        .then((data) => updateOrder(data))
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
        <div className={styles.footer}>
          <div className={styles.left}>
            <QueryBuilderIcon className={styles.icon} />
            <div>{dayjs(order?.createdAt).format('DD.MM.YYYY HH:MM')}</div>
          </div>
          <div className={styles.right}>
            <Button
              key="cancel"
              danger
              onClick={orderCancel}
              disabled={order?.status === 'completed' || order?.status === 'canceled'}>
              Скасувати замовлення
            </Button>

            <Button key="back" onClick={handleCancel}>
              Скасувати
            </Button>

            <Button key="submit" type="primary" onClick={handleOk}>
              Оновити
            </Button>
          </div>
        </div>,
      ]}>
      {order ? (
        !editEnable ? (
          <ViewModalBase
            order={order}
            updateOrder={updateOrder}
            requestOrders={requestOrders}
            editEnable={editEnable}
            setEditEnable={setEditEnable}
          />
        ) : (
          <EditModalBase
            order={order}
            updateOrder={updateOrder}
            requestOrders={requestOrders}
            editEnable={editEnable}
            setEditEnable={setEditEnable}
          />
        )
      ) : (
        <div className={styles.spinner}>
          <Spin indicator={<LoadingOutlined />} size="large" />
        </div>
      )}
    </Modal>
  )
}
