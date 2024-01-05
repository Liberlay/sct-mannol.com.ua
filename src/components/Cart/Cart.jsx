import clsx from 'clsx'
import Link from 'next/link'
import { useEffect } from 'react'
import { Button } from 'components/Button/Button'
import { useOnClickAway } from 'hooks/useOnClickAway'
import { useDispatch, useSelector } from 'react-redux'
import { clickCloseCart } from 'store/slices/cartSlice'
import { cartProductsRefresh } from 'utils/cartProductsRefresh'
import { CartProducts } from 'components/CartProducts/CartProducts'

import styles from './Cart.module.scss'

export const Cart = ({ cartRef }) => {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.cart.products)
  const openCart = useSelector((state) => state.cart.isVisible)
  const totalAmount = useSelector((state) =>
    state.cart.products.reduce(
      (totalPrice, product) => totalPrice + product.details.price * product.qty,
      0,
    ),
  )

  useOnClickAway(cartRef, openCart, () => dispatch(clickCloseCart()))

  useEffect(() => {
    openCart && cartProductsRefresh(products, dispatch)
  }, [openCart])

  return (
    <div className={clsx(styles.wrapper, openCart && styles.visible)}>
      {products.length === 0 ? (
        <div className={styles.emptyCart}>
          <div
            className={styles.emptyCartImg}
            style={{ backgroundImage: `url(/assets/images/cart/empty_cart.svg)` }}></div>
          <div className={styles.emptyCartTitle}>Ваш кошик наразі порожній :(</div>
        </div>
      ) : (
        <div className={styles.cart}>
          <div className={styles.title}>Кошик:</div>
          <div className={styles.productsWrapper}>
            <CartProducts />
          </div>
          <div className={styles.totalAmount}>Усього: ₴ {totalAmount}</div>
          <Link href="/checkout">
            <Button type={'wide'} text={'Замовити'} onClick={() => dispatch(clickCloseCart())} />
          </Link>
        </div>
      )}
    </div>
  )
}
