import { request } from 'utils/request'
import { notifyError } from 'utils/errors'
import { Select, InputNumber } from 'antd'
import { useState, useEffect } from 'react'

import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import styles from './Product.module.scss'

export const Product = ({ product, i, updateOrder, editEnable }) => {
  const [editProduct, setEditProduct] = useState(false)
  const [productLabels, setProductLabels] = useState(null)

  useEffect(() => {
    if (editProduct)
      request
        .authorized({
          url: `/products/${product.details.urlKey}`,
        })
        .then((data) =>
          setProductLabels(
            data.options.map((option) => ({
              value: option.key,
              label: option.label,
              data: option,
            })),
          ),
        )
        .catch(notifyError)
  }, [editProduct])

  return product.details ? (
    <div className={styles.product}>
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
        {!editProduct ? (
          <div>{product.details.label}</div>
        ) : (
          <Select
            className={styles.select}
            value={!productLabels ? '...' : product.optionKey}
            options={productLabels ?? []}
            onChange={(_, option) =>
              updateOrder((order) => {
                order.products[i].optionKey = option.value
                order.products[i].details = {
                  ...order.products[i].details,
                  image: option.data.image,
                  label: option.data.label,
                  price: option.data.price,
                }
              })
            }
          />
        )}
        <div>
          {product.price * product.qty}
          {' ₴'}
        </div>
        <InputNumber
          className={styles.quantity}
          value={product.qty}
          addonAfter={'шт'}
          onChange={(value) =>
            updateOrder((order) => {
              order.products[i].qty = value
            })
          }
        />
        {editEnable && (
          <div className={styles.icons}>
            <EditOutlined className={styles.edit} onClick={() => setEditProduct(true)} />
            <DeleteOutlined
              className={styles.delete}
              onClick={() =>
                updateOrder((order) => {
                  order.products.splice(i, 1)
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className={styles.notFound}>Товар не знайдено</div>
  )
}
