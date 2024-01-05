import { Modal } from 'antd'
import { useImmer } from 'use-immer'
import { toast } from 'react-toastify'
import { request } from 'utils/request'
import { notifyError } from 'utils/errors'
import { EditModalBase } from '../EditModalBase/EditModalBase'

export const Add = ({ isModalOpen, setIsModalOpen, requestOrders }) => {
  const [order, updateOrder] = useImmer({
    userId: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    shipping: {
      provider: null,
      method: null,
      area: null,
      city: null,
      trackingNumber: '',
    },
    products: [],
  })

  const handleOk = () => {
    request
      .authorized({
        url: `/orders`,
        method: 'post',
        data: {
          ...order,
          userId: null,
          shipping: {
            ...order.shipping,
            area: order.shipping.area.ref,
            city: order.shipping.city.ref,
            warehouse: order.shipping.warehouse.ref,
          },
          products: order?.products.map(({ vendorCode, optionKey, qty }) => ({
            vendorCode,
            optionKey,
            qty,
          })),
        },
      })
      .then(
        () => (
          requestOrders(),
          setIsModalOpen(false),
          toast('Замовлення створено'),
          updateOrder({
            userId: null,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            shipping: {
              provider: '',
              method: '',
              area: '',
              city: '',
              warehouse: '',
              address: '',
              trackingNumber: '',
            },
            products: [],
          })
        ),
      )
      .catch(notifyError)
  }
  const handleCancel = () => (
    setIsModalOpen(false),
    updateOrder({
      userId: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      shipping: {
        provider: '',
        method: '',
        area: '',
        city: '',
        warehouse: '',
        address: '',
        trackingNumber: '',
      },
      products: [],
    })
  )

  const afterClose = () =>
    updateOrder({
      userId: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      shipping: {
        provider: '',
        method: '',
        area: '',
        city: '',
        warehouse: '',
        address: '',
        trackingNumber: '',
      },
      products: [],
    })

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
      style={{ paddingTop: '50px' }}>
      <EditModalBase order={order} updateOrder={updateOrder} editEnable />
    </Modal>
  )
}
