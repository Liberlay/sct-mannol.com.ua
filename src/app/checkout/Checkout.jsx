'use client'

import { useImmer } from 'use-immer'
import { request } from 'utils/request'
import { Input } from 'components/Input'
import { PAYMENT } from 'utils/constants'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import NoSsr from 'components/NoSsr/NoSsr'
import { notifyError } from 'utils/errors'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from 'components/Button/Button'
import { clearCart } from 'store/slices/cartSlice'
import { useFormValidation } from 'hooks/formValidation'
import { inputValidations } from 'utils/inputValidations'
import { cartProductsRefresh } from 'utils/cartProductsRefresh'
import { CartProducts } from 'components/CartProducts/CartProducts'

import StoreIcon from '@mui/icons-material/Store'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

import styles from './Checkout.module.scss'

export const Checkout = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const products = useSelector((state) =>
    state.cart.products.map(({ vendorCode, optionKey, qty }) => ({ vendorCode, optionKey, qty })),
  )
  const totalAmount = useSelector((state) =>
    state.cart.products.reduce(
      (totalPrice, product) => totalPrice + product.details.price * product.qty,
      0,
    ),
  )
  const [value, updateValue] = useImmer({
    firstName: user ? user.firstName : '',
    lastName: user ? user.lastName : '',
    email: user ? user.email : '',
    phone: user ? user.phone : '',
    paymentMethod: '',
    shipping: {
      provider: null,
      method: null,
      area: null,
      city: null,
      warehouse: null,
      address: '',
    },
  })
  const [areas, setAreas] = useState(null)
  const [cities, setCities] = useState(null)
  const [warehouses, setWarehouses] = useState(null)
  const [formRef, isValid] = useFormValidation(value)

  useEffect(() => {
    cartProductsRefresh(products, dispatch)
  }, [])

  useEffect(() => {
    request
      .unauthorized({
        url: '/post/novaposhta/areas',
      })
      .then((data) => setAreas(data.map((data) => ({ key: data.ref, text: data.description }))))
      .catch(notifyError)
  }, [])

  useEffect(() => {
    setCities(null)
    if (value.shipping.area) {
      request
        .unauthorized({
          url: `/post/novaposhta/areas/${value.shipping.area}/cities`,
        })
        .then((data) =>
          setCities(
            data.map((city) => ({
              key: city.ref,
              text: `${city.settlementTypeDescription} ${city.description}`,
            })),
          ),
        )
        .catch(notifyError)
    }
  }, [value.shipping.area])

  useEffect(() => {
    setWarehouses(null)
    if (value.shipping.city) {
      request
        .unauthorized({
          url: `/post/novaposhta/areas/${value.shipping.area}/cities/${value.shipping.city}/warehouses`,
        })
        .then((data) =>
          setWarehouses(
            data.map((warehouse) => ({ key: warehouse.ref, text: warehouse.description })),
          ),
        )
        .catch(notifyError)
    }
  }, [value.shipping.city])

  return (
    <div className={styles.wrapper}>
      <NoSsr>
        <div className={styles.wrapperLeft}>
          <div className={styles.headTitle}>Оформлення замовлення</div>
          <div className={styles.title}>Контактні дані</div>
          <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.inputSection}>
              <Input.TextField
                className={styles.input}
                type="text"
                name="firstName"
                title="Ім'я"
                validation={[inputValidations.name, "Поле повинно містити ім'я"]}
                value={value.firstName}
                onInput={(event) => updateValue({ ...value, firstName: event.target.value })}
                required
              />
              <Input.TextField
                className={styles.input}
                type="text"
                name="lastName"
                title="Прізвище"
                validation={[inputValidations.name, 'Поле повинно містити прізвище']}
                value={value.lastName}
                onInput={(event) => updateValue({ ...value, lastName: event.target.value })}
                required
              />
              <Input.TextField
                className={styles.input}
                type="email"
                name="email"
                title="Ел.пошта"
                validation={[inputValidations.email, 'Поле повинно містити email']}
                value={value.email}
                onInput={(event) => updateValue({ ...value, email: event.target.value })}
                required
              />
              <Input.TextField
                className={styles.input}
                type="tel"
                name="phone"
                title="Телефон"
                validation={[inputValidations.phone, 'Поле повинно містити телефон']}
                value={value.phone}
                onInput={(event) => updateValue({ ...value, phone: event.target.value })}
                required
              />
            </div>
            <Input.Select
              title="Метод оплати"
              def="Оберіть метод оплати..."
              options={[
                { key: 'cash', icon: <LocalAtmIcon />, text: 'Готівкою' },
                { key: 'card', icon: <CreditCardIcon />, text: 'Банківською карткою' },
              ]}
              value={value.paymentMethod}
              onChange={(key) =>
                updateValue((value) => {
                  value.paymentMethod = key
                })
              }
              required
            />
            {value.paymentMethod && (
              <Input.Select
                title="Служба доставки"
                def="Оберіть спосіб доставки..."
                options={[
                  {
                    key: 'novaposhta',
                    icon: <img src="/assets/images/logos/nova_poshta_logo.webp" alt="Нова Пошта" />,
                    text: 'Нова Пошта',
                  },
                ]}
                value={value.shipping.provider}
                onChange={(key) =>
                  updateValue((value) => {
                    value.shipping.provider = key
                  })
                }
                required
              />
            )}
            {value.shipping.provider && (
              <Input.Select
                title="Метод доставки"
                def="Оберіть метод доставки..."
                options={[
                  { key: 'post', icon: <StoreIcon />, text: 'Доставка у відділення' },
                  { key: 'courier', icon: <LocalShippingIcon />, text: 'Адресна доставка' },
                ]}
                value={value.shipping.method}
                onChange={(key) =>
                  updateValue((value) => {
                    value.shipping.method = key
                    if (key === 'post') {
                      delete value.shipping.address
                      value.shipping.warehouse = ''
                    } else {
                      delete value.shipping.warehouse
                      value.shipping.address = ''
                    }
                  })
                }
                required
              />
            )}
            {value.shipping.method && (
              <Input.Select
                title="Регіон доставки"
                def="Оберіть регіон доставки..."
                options={areas ?? []}
                value={value.shipping.area}
                onChange={(key) =>
                  updateValue((value) => {
                    value.shipping.area = key
                    value.shipping.city = null
                    value.shipping.warehouse = null
                  })
                }
                inputIsVisible={true}
                loading={!areas}
                required
              />
            )}
            {value.shipping.area && (
              <Input.Select
                title="Населений пункт"
                def="Оберіть населений пункт..."
                options={cities ?? []}
                value={value.shipping.city}
                onChange={(key) =>
                  updateValue((value) => {
                    value.shipping.city = key
                    value.shipping.warehouse = null
                  })
                }
                inputIsVisible={true}
                loading={!cities}
                required
              />
            )}
            {value.shipping.method === 'post' && value.shipping.city && (
              <Input.Select
                title="Почтове відділення"
                def="Оберіть почтове відділення..."
                options={warehouses ?? []}
                value={value.shipping.warehouse}
                onChange={(key) =>
                  updateValue((value) => {
                    value.shipping.warehouse = key
                  })
                }
                inputIsVisible={true}
                loading={!warehouses}
                required
              />
            )}
            {value.shipping.method === 'courier' && value.shipping.city && (
              <Input.TextField
                type="text"
                title="Адреса доставки"
                name="adress"
                value={value.shipping.address}
                onInput={(event) =>
                  updateValue((value) => {
                    value.shipping.address = event.target.value
                  })
                }
                required
              />
            )}
          </form>
        </div>
        <div className={styles.wrapperRight}>
          <div className={styles.title}>Ваше замовлення</div>
          <div className={styles.cartProducts}>
            <CartProducts />
          </div>
          <div className={styles.bottom}>
            <div className={styles.payment}>
              Спосіб оплати:
              <div>{PAYMENT[value.paymentMethod]}</div>
            </div>
            <div className={styles.totalPrice}>
              <div className={styles.text}>До сплати:</div>
              <div className={styles.text}>{totalAmount} ₴</div>
            </div>
            <Button
              type={'wide'}
              width={'100%'}
              color={'#fcc917'}
              notValid={!isValid}
              text={'Оформити замовлення'}
              onClick={() => {
                request[user ? 'authorized' : 'unauthorized']({
                  url: '/orders/checkout',
                  method: 'post',
                  data: { ...value, products },
                })
                  .then(({ key }) => (router.push(`/orders/${key}`), dispatch(clearCart())))
                  .catch(notifyError)
              }}
            />
          </div>
        </div>
      </NoSsr>
    </div>
  )
}
