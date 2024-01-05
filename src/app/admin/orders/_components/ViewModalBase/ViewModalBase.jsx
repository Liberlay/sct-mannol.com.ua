import { request } from 'utils/request'
import { notifyError } from 'utils/errors'
import { PROVIDER, METHOD } from 'utils/constants'
import { Button, Input, Descriptions, Divider } from 'antd'

import PersonIcon from '@mui/icons-material/Person'
import NumbersIcon from '@mui/icons-material/Numbers'
import { EditOutlined, FormOutlined, ShoppingOutlined, CheckOutlined } from '@ant-design/icons'

import styles from './ViewModalBase.module.scss'

export const ViewModalBase = ({ order, updateOrder, requestOrders, setEditEnable }) => {
  const user = [
    { label: "Ім'я", children: order.firstName },
    { label: 'Призвище', children: order.lastName },
    { label: 'Телефон', children: order.phone },
    { label: 'Email', children: order.email },
  ]
  const delivery = [
    { label: 'Служба', children: PROVIDER[order.shipping.provider] },
    { label: 'Метод', children: METHOD[order.shipping.method] },
    { label: 'Область', children: order.shipping.area?.description ?? 'Невідома область' },
    { label: 'Місто', children: order.shipping.city?.description ?? 'Невідоме місто' },
  ]

  const deliveryAddress = [
    order.shipping.method === 'post'
      ? {
          label: 'Відділеня',
          children: order.shipping.warehouse?.description ?? 'Невідоме відділеня',
        }
      : { label: 'Адреса', children: order.shipping.address },
  ]

  return (
    <div className={styles.wrapper}>
      <div className={styles.edit}>
        <div className={styles.left}>
          {order.userId && (
            <div>
              <NumbersIcon className={styles.icon} /> {order.userId}
            </div>
          )}
          <div>
            <NumbersIcon className={styles.icon} /> {order.id}
          </div>
          {order.user && (
            <div>
              <PersonIcon className={styles.icon} />
              {order.user.email}
            </div>
          )}
        </div>
        <Button
          icon={<EditOutlined />}
          onClick={() => setEditEnable(true)}
          disabled={order.status !== 'processing'}>
          Редагувати замовлення
        </Button>
      </div>
      <div className={styles.status}>
        <Input
          className={styles.input}
          placeholder="ТТН"
          value={order.shipping.trackingNumber}
          onChange={(value) =>
            updateOrder((order) => {
              order.shipping.trackingNumber = value
            })
          }
          disabled={order.status !== 'shipped'}
        />
        {order.status === 'processing' && (
          <Button
            className={styles.button}
            icon={<FormOutlined />}
            onClick={() => {
              request
                .authorized({
                  url: `/orders/${order.id}/accepted`,
                  method: 'post',
                })
                .then(
                  () =>
                    updateOrder((order) => {
                      order.status = 'accepted'
                    }),
                  requestOrders(),
                )
                .catch(notifyError)
            }}
            disabled={order.status === 'canceled'}>
            Підтвердити замовлення
          </Button>
        )}
        {order.status === 'accepted' && (
          <Button
            className={styles.button}
            icon={<ShoppingOutlined />}
            onClick={() => {
              request
                .authorized({
                  url: `/orders/${order.id}/shipped`,
                  method: 'post',
                })
                .then(
                  () =>
                    updateOrder((order) => {
                      order.status = 'shipped'
                    }),
                  requestOrders(),
                )
                .catch(notifyError)
            }}
            disabled={order.status === 'canceled'}>
            Доставити замовлення
          </Button>
        )}
        {order.status === 'shipped' && (
          <Button
            className={styles.button}
            icon={<CheckOutlined />}
            onClick={() => {
              request
                .authorized({
                  url: `/orders/${order.id}/completed`,
                  method: 'post',
                })
                .then(
                  () =>
                    updateOrder((order) => {
                      order.status = 'completed'
                    }),
                  requestOrders(),
                )
                .catch(notifyError)
            }}
            disabled={order.status === 'canceled'}>
            Завершити замовлення
          </Button>
        )}
      </div>

      <Descriptions title={'Користувач'} items={user} column={2} layout={'vertical'} />
      <Descriptions title={'Доставка'} items={delivery} column={2} layout={'vertical'} />
      <Descriptions items={deliveryAddress} layout={'vertical'} />
      <Divider className={styles.divider}>Товари</Divider>
      <div className={styles.products}>
        {order.products.map((product, i) =>
          product.details ? (
            <div key={i} className={styles.product}>
              <div className={styles.left}>
                <div
                  className={styles.image}
                  style={{
                    backgroundImage: `url(/static/images/products/${product.details.image})`,
                  }}></div>
                <div className={styles.info}>
                  <div className={styles.category_type}>
                    <div>{product.details.category}</div>
                    <div>{product.details.type}</div>
                  </div>
                  <div>{product.details.title}</div>
                </div>
              </div>
              <div className={styles.right}>
                <div>{product.details.label}</div>
                <div>
                  {product.price * product.qty}
                  {' ₴'}
                </div>
                <div>
                  {product.qty}
                  {' шт'}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.notFound}>Товар не знайдено</div>
          ),
        )}
      </div>
    </div>
  )
}
