'use client'

import clsx from 'clsx'
import dayjs from 'dayjs'
import { useRef } from 'react'
import { request } from 'utils/request'
import { notifyError } from 'utils/errors'
import { useState, useEffect } from 'react'
import { declension } from 'utils/declension'
import { useIntersectionObserver } from 'usehooks-ts'
import { PAYMENT, PROVIDER, STATUS } from 'utils/constants'

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import styles from './Orders.module.scss'

const Order = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false)
  const productsAmount = order.products.reduce((sum, product) => sum + product.qty, 0)

  return (
    <div className={styles.order}>
      <div className={styles.orderPreview}>
        {isOpen ? (
          <KeyboardArrowUpIcon className={styles.icon} onClick={() => setIsOpen(false)} />
        ) : (
          <KeyboardArrowDownIcon className={styles.icon} onClick={() => setIsOpen(true)} />
        )}
        <div className={styles.inner}>
          <div className={styles.orderId}>{'#' + order.id}</div>
          <div className={styles.details}>
            <div className={clsx(styles.status, order.status && styles[order.status])}>
              {STATUS[order.status]}
            </div>
            <div className={styles.date}>{dayjs(order.createdAt).format(' DD.MM.YYYY HH:mm')}</div>
            <div className={styles.productsAmount}>
              {productsAmount} {declension(['товар', 'товара', 'товарів'], productsAmount)}
            </div>
            {!isOpen && (
              <div className={styles.price}>
                {order.products.reduce((sum, product) => sum + product.price * product.qty, 0) +
                  ' грн'}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={clsx(styles.orderDetails, isOpen && styles.opened)}>
        <div className={styles.products}>
          {order.products.map((product, i) =>
            product.details ? (
              <div key={i} className={styles.product}>
                <div
                  className={styles.image}
                  style={{
                    backgroundImage: `url(/static/images/products/${product.details.image})`,
                  }}></div>
                <div className={styles.inner}>
                  <div className={styles.title}>{product.details.title}</div>
                  <div className={styles.details}>
                    <div className={styles.label}>{product.details.label}</div>
                    <div className={styles.quantity}>
                      {product.qty}
                      {' шт'}
                    </div>
                    <div className={styles.price}>
                      {product.price * product.qty}
                      {' грн'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div key={i}>Товар не знайдено</div>
            ),
          )}

          <div className={styles.totalPrice}>
            <div className={styles.title}>Усього до сплати:</div>
            <div className={styles.price}>
              {order.products.reduce((sum, product) => sum + product.price * product.qty, 0)}
              {' грн'}
            </div>
          </div>
        </div>
        <div className={styles.shipping}>
          <div className={styles.shippingInfo}>
            <div className={styles.title}>Метод оплати</div>
            <div>{PAYMENT[order.paymentMethod]}</div>
          </div>
          <div className={styles.shippingInfo}>
            <div className={styles.title}>Служба доставки</div>
            <div>{PROVIDER[order.shipping.provider]}</div>
          </div>
          <div className={styles.shippingInfo}>
            <div className={styles.title}>Область</div>
            <div>{order.shipping.area.description}</div>
          </div>
          <div className={styles.shippingInfo}>
            <div className={styles.title}>Населений пункт</div>
            <div>{order.shipping.city.description}</div>
          </div>
          {order.shipping.warehouse ? (
            <div className={styles.shippingInfo}>
              <div className={styles.title}>Відділеня</div>
              <div>{order.shipping.warehouse.description}</div>
            </div>
          ) : (
            <div className={styles.shippingInfo}>
              <div className={styles.title}>Адреса</div>
              <div>{order.shipping.address}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const Orders = () => {
  const loaderRef = useRef()
  const [orders, setOrders] = useState(null)
  const [currPage, setCurrPage] = useState(1)
  const [prevPage, setPrevPage] = useState(0)
  const [lastList, setLastList] = useState(false)
  const ordersLoading = useIntersectionObserver(loaderRef, {
    rootMargin: '250px',
  })

  useEffect(() => {
    if (ordersLoading?.isIntersecting && currPage === prevPage) {
      setCurrPage(currPage + 1)
    }
  }, [ordersLoading?.isIntersecting])

  useEffect(() => {
    if (!lastList && prevPage !== currPage) {
      request
        .authorized({
          url: '@me/orders',
          params: {
            page: currPage,
          },
        })
        .then(({ data, total }) => {
          if (currPage * 20 >= total) setLastList(true)
          setOrders([...(orders ?? []), ...data])
          setPrevPage(currPage)
        })
        .catch(notifyError)
    }
  }, [currPage])

  return (
    <div className={styles.container}>
      {!!orders?.length && (
        <>
          <div className={styles.title}>Мої замовлення</div>
          <div className={styles.orders}>
            {orders?.map((order) => (
              <Order key={order.id} order={order} />
            ))}
          </div>
        </>
      )}
      {orders?.length === 0 && (
        <div className={styles.empty}>
          <div
            className={styles.image}
            style={{ backgroundImage: 'url(/images/orders/bag-x.svg)' }}></div>
          <div>Ви ще не зробили жодного замовлення :(</div>
        </div>
      )}
      {!lastList && (
        <div className={styles.loading}>
          <div className={styles.ldsRing}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      <div ref={loaderRef}></div>
    </div>
  )
}
