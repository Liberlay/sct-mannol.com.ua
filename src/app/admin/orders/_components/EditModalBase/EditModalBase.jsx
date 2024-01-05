import { debounce } from 'lodash-es'
import { request } from 'utils/request'
import { notifyError } from 'utils/errors'
import { Product } from '../Product/Product'
import { useState, useCallback, useEffect } from 'react'
import { PAYMENT, PROVIDER, METHOD } from 'utils/constants'
import { Input, Divider, Select, AutoComplete } from 'antd'

import styles from './EditModalBase.module.scss'

export const EditModalBase = ({ order, updateOrder, requestOrders, editEnable }) => {
  const [areas, setAreas] = useState(null)
  const [cities, setCities] = useState(null)
  const [warehouses, setWarehouses] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [products, setProducts] = useState(null)
  const updateSearchValue = useCallback(
    debounce((value) => {
      setSearchValue(value)
    }, 1000),
    [],
  )

  useEffect(() => {
    request
      .authorized({
        url: '/post/novaposhta/areas',
      })
      .then((data) =>
        setAreas(data.map((area) => ({ value: area.ref, label: area.description, data: area }))),
      )
      .catch(notifyError)
  }, [])

  useEffect(() => {
    setCities(null)
    if (order.shipping.area) {
      request
        .authorized({
          url: `/post/novaposhta/areas/${order.shipping.area.ref}/cities`,
        })
        .then((data) =>
          setCities(data.map((city) => ({ value: city.ref, label: city.description, data: city }))),
        )
        .catch(notifyError)
    }
  }, [order.shipping.area])

  useEffect(() => {
    setWarehouses(null)
    if (order.shipping.city) {
      request
        .authorized({
          url: `/post/novaposhta/areas/${order.shipping.area.ref}/cities/${order.shipping.city.ref}/warehouses`,
        })
        .then((data) =>
          setWarehouses(
            data.map((warehouse) => ({
              value: warehouse.ref,
              label: warehouse.description,
              data: warehouse,
            })),
          ),
        )
        .catch(notifyError)
    }
  }, [order.shipping.city])

  useEffect(() => {
    request
      .authorized({
        url: '/products',
        params: {
          search: searchValue ? searchValue : null,
        },
      })
      .then(({ data }) => setProducts(data))
      .catch(notifyError)
  }, [searchValue])

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <div className={styles.left}>
          {order.userId && <div>{order.userId}</div>}
          {order.id && <div>{order.id}</div>}
        </div>
      </div>
      <Divider className={styles.divider}>Замовник</Divider>
      <div className={styles.user}>
        <div className={styles.row}>
          <Input
            placeholder={"Ім'я"}
            value={order.firstName}
            onChange={(event) =>
              updateOrder((order) => {
                order.firstName = event.target.value
              })
            }
          />
          <Input
            placeholder={'Призвище'}
            value={order.lastName}
            onChange={(event) =>
              updateOrder((order) => {
                order.lastName = event.target.value
              })
            }
          />
        </div>
        <div className={styles.row}>
          <Input
            placeholder={'Телефон'}
            value={order.phone}
            onChange={(event) =>
              updateOrder((order) => {
                order.phone = event.target.value
              })
            }
          />
          <Input
            placeholder={'Email'}
            value={order.email}
            onChange={(event) =>
              updateOrder((order) => {
                order.email = event.target.value
              })
            }
          />
        </div>
        <Select
          defaultValue={'default'}
          value={PAYMENT[order.paymentMethod]}
          options={[
            { value: 'default', label: 'Метод оплати', disabled: true },
            ...Object.entries(PAYMENT).map(([value, label]) => ({ value, label })),
          ]}
          onChange={(value) =>
            updateOrder((order) => {
              order.paymentMethod = value
            })
          }
        />
      </div>
      <Divider className={styles.divider}>Доставка</Divider>
      <div className={styles.delivery}>
        <div className={styles.row}>
          <Select
            className={styles.select}
            defaultValue="default"
            value={PROVIDER[order.shipping.provider]}
            options={[
              { value: 'default', label: 'Служба доставки', disabled: true },
              ...Object.entries(PROVIDER).map(([value, label]) => ({ value, label })),
            ]}
            onChange={(value) =>
              updateOrder((order) => {
                order.shipping.provider = value
              })
            }
          />
          <Select
            className={styles.select}
            defaultValue="default"
            value={METHOD[order.shipping.method]}
            options={[
              { value: 'default', label: 'Метод доставки', disabled: true },
              ...Object.entries(METHOD).map(([value, label]) => ({ value, label })),
            ]}
            onChange={(value) =>
              updateOrder((order) => {
                order.shipping.method = value
                if (order.shipping.method === 'post') {
                  delete order.shipping.address
                } else {
                  delete order.shipping.warehouse
                }
              })
            }
          />
        </div>
        <div className={styles.row}>
          <Select
            className={styles.select}
            value={!areas ? 'Завантаження...' : order.shipping.area?.ref ?? 'default'}
            options={[{ value: 'default', label: 'Область', disabled: true }, ...(areas ?? [])]}
            onChange={(_, option) =>
              updateOrder((order) => {
                order.shipping.area = option.data
                order.shipping.city = null
              })
            }
            showSearch={true}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            loading={!areas}
          />
          <Select
            className={styles.select}
            value={
              !order.shipping.area
                ? 'default'
                : !cities
                ? 'Завантаження...'
                : order.shipping.city?.ref ?? 'default'
            }
            options={[{ value: 'default', label: 'Місто', disabled: true }, ...(cities ?? [])]}
            onChange={(_, option) =>
              updateOrder((order) => {
                order.shipping.city = option.data
                order.shipping.warehouse = null
              })
            }
            showSearch={true}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            loading={order.shipping.area && !cities}
          />
        </div>
        {order.shipping.method === 'post' && (
          <Select
            className={styles.select}
            value={
              !order.shipping.city
                ? 'default'
                : !warehouses
                ? 'Завантаження...'
                : order.shipping.warehouse?.ref ?? 'default'
            }
            options={[
              { value: 'default', label: 'Відділеня', disabled: true },
              ...(warehouses ?? []),
            ]}
            onChange={(_, option) =>
              updateOrder((order) => {
                order.shipping.warehouse = option.data
              })
            }
            showSearch={true}
            filterOption={(input, option) =>
              option.label.toLowerCase().includes(input.toLowerCase())
            }
            loading={order.shipping.city && !warehouses}
          />
        )}
        {order.shipping.method === 'courier' && (
          <Input
            placeholder={'Адреса'}
            value={order.shipping.address}
            onChange={(event) =>
              updateOrder((order) => {
                order.shipping.address = event.target.value
              })
            }
          />
        )}
      </div>
      <Divider className={styles.divider}>Товари</Divider>
      <div className={styles.products}>
        <AutoComplete
          value={inputValue}
          options={products?.map((product) => ({
            value: product.vendorCode,
            label: product.title,
            product: product,
          }))}
          onSearch={(value) => (setInputValue(value), updateSearchValue(value))}
          onChange={(_, option) => {
            if (option.product)
              updateOrder((order) => {
                const primaryOption = option.product.options.find(
                  (element) => element.isPrimary === true,
                )
                order.products = [
                  ...order.products,
                  {
                    details: {
                      urlKey: option.product.urlKey,
                      image: primaryOption.image,
                      title: option.product.title,
                      category: option.product.category,
                      type: option.product.type,
                      label: primaryOption.label,
                      price: primaryOption.price,
                      available: primaryOption.available,
                    },
                    optionKey: primaryOption.key,
                    price: primaryOption.price,
                    qty: 1,
                    vendorCode: option.product.vendorCode,
                  },
                ]
              })
            setInputValue('')
          }}>
          <Input.Search placeholder="Додати товар" />
        </AutoComplete>
        {order.products.map((product, i) => (
          <Product
            key={product.vendorCode + i}
            product={product}
            i={i}
            updateOrder={updateOrder}
            editEnable={editEnable}
          />
        ))}
      </div>
    </div>
  )
}
