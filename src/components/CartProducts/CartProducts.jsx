import Link from 'next/link'
import SimpleBar from 'simplebar-react'
import { useMediaQuery } from 'usehooks-ts'
import { useDispatch, useSelector } from 'react-redux'
import { removeProduct, changeQuantity } from 'store/slices/cartSlice'

import ClearIcon from '@mui/icons-material/Clear'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

import styles from './CartProducts.module.scss'
import NoSsr from 'components/NoSsr/NoSsr'

export const CartProducts = () => {
  const dispatch = useDispatch()
  const isMobileLayout = useMediaQuery('(max-width: 1050px)')
  const products = useSelector((state) => state.cart.products)
  const cartContent = products.map((item) => (
    <div key={item.optionKey + item.vendorCode} className={styles.wrapper}>
      <div className={styles.imageBackground}>
        <div
          className={styles.image}
          style={{
            backgroundImage: `url(/static/images/products/${item.details.image})`,
          }}></div>
      </div>
      <div className={styles.middle}>
        <Link
          href={`/catalog/${item.details.category}/${item.details.urlKey}`}
          style={{ textDecoration: 'none' }}>
          <div className={styles.title}>{item.details.title}</div>
        </Link>
        <div className={styles.bottom}>
          <div className={styles.left}>
            <div className={styles.price}>{item.details.price * item.qty} ₴</div>
            <div>{item.details.label}</div>
          </div>
          <div className={styles.quantity}>
            <ArrowBackIosIcon
              className={styles.arrowIcon}
              onClick={() =>
                dispatch(
                  changeQuantity({
                    vendorCode: item.vendorCode,
                    optionKey: item.optionKey,
                    value: -1,
                  }),
                )
              }
            />
            <div className={styles.productQuantity}>{item.qty}</div>
            <ArrowBackIosIcon
              className={styles.arrowIcon}
              onClick={() =>
                dispatch(
                  changeQuantity({
                    vendorCode: item.vendorCode,
                    optionKey: item.optionKey,
                    value: +1,
                  }),
                )
              }
            />
          </div>
        </div>
      </div>
      <ClearIcon className={styles.clearIcon} onClick={() => dispatch(removeProduct(item))} />
    </div>
  ))

  return (
    <div className={styles.products}>
      {!isMobileLayout ? (
        <SimpleBar style={{ height: '100%' }}>{cartContent}</SimpleBar>
      ) : (
        cartContent
      )}
    </div>
  )
}
