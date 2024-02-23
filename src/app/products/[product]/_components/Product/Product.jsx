'use client'

import clsx from 'clsx'
import Slider from 'react-slick'
import { toast } from 'react-toastify'
import { useRef, useEffect } from 'react'
import NoSsr from 'components/NoSsr/NoSsr'
import { useIsFirstRender } from 'usehooks-ts'
import { addCartItem } from 'store/slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState, parseAsStringEnum } from 'nuqs'
import { RelatedProducts } from '../RelatedProducts/RelatedProducts'
import { addFavorite, removeFavorite } from 'store/slices/favoritesSlice'

import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'

import styles from './Product.module.scss'

export const Product = ({ product }) => {
  const sliderRef = useRef()
  const dispatch = useDispatch()
  const isFirst = useIsFirstRender()
  const user = useSelector((state) => state.auth.user)
  const [productOption, setProductOption] = useQueryState(
    'option',
    parseAsStringEnum(product.options.map((option) => option.key)).withDefault(
      product.options.find((option) => option.isPrimary).key
    )
  )
  const selectedOption = product.options.findIndex((option) => option.key === productOption)
  const favorites = useSelector((state) => state.favorites.products)
  const onChangeCartItem = (image, label, price, key) => {
    dispatch(
      addCartItem({
        vendorCode: product.vendorCode,
        details: {
          urlKey: product.urlKey,
          category: product.category,
          title: product.title,
          image: image,
          label: label,
          price: price,
        },
        optionKey: key,
        qty: 1,
      })
    )
  }

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    draggable: true,
    speed: 500,
    slidesToShow: 1,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          dots: false,
        },
      },
    ],
  }

  useEffect(() => {
    sliderRef.current.slickGoTo(selectedOption, isFirst)
  }, [selectedOption])

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapperLeft}>
          <Slider ref={sliderRef} className={styles.slider} {...settings}>
            {product.options.map((item, i) => (
              <img
                key={i}
                className={styles.image}
                src={`/static/images/products/${item.image}`}
                alt={`${product.title} ${item.label}`}
              ></img>
            ))}
          </Slider>
        </div>
        <div className={styles.wrapperRight}>
          <div className={styles.vendorCodeWrapper}>
            <div className={styles.vendorCode}>{product.vendorCode}</div>
          </div>
          <h2 className={styles.title}>{product.title}</h2>
          <div className={styles.specificationTitle}>Спеціфикації</div>
          {product.specification && (
            <div className={styles.specification}>{product.specification}</div>
          )}
          <div className={styles.priceList}>
            <div className={styles.top}>
              <div
                className={clsx(
                  styles.price,
                  !product.options[selectedOption].available && styles.notAvailable
                )}
              >
                {product.options[selectedOption].price}
                {' ₴'}
              </div>
              <NoSsr>
                {user &&
                  (!favorites.find((element) => element === product.vendorCode) ? (
                    <FavoriteBorderIcon
                      className={styles.addFavorite}
                      onClick={() => (
                        dispatch(addFavorite(product.vendorCode)),
                        toast('Товар додано до списку бажаних', {
                          toastId: `add-${product.vendorCode}`,
                        })
                      )}
                    />
                  ) : (
                    <FavoriteIcon
                      className={styles.removeFavorite}
                      onClick={() => (
                        dispatch(removeFavorite(product.vendorCode)),
                        toast('Товар видалено зі списку бажаних', {
                          toastId: `remove-${product.vendorCode}`,
                        })
                      )}
                    />
                  ))}
              </NoSsr>
              <button
                className={clsx(
                  styles.button,
                  !product.options[selectedOption].available && styles.disable
                )}
                onClick={() => {
                  onChangeCartItem(
                    product.options[selectedOption].image,
                    product.options[selectedOption].label,
                    product.options[selectedOption].price,
                    product.options[selectedOption].key
                  )
                  toast('Товар додано до кошика', { toastId: `buy-${product.vendorCode}` })
                }}
              >
                <ShoppingCartCheckoutIcon />
                Купити
              </button>
            </div>
            {!product.options[selectedOption].available && <div>Немає в наявності</div>}
            {product.options.length > 1 && (
              <div className={styles.productList}>
                {product.options.map((obj, i) => (
                  <div
                    key={i}
                    className={styles.productWrapper}
                    onClick={() => setProductOption(obj.key)}
                  >
                    <div
                      className={styles.productImage}
                      style={{
                        backgroundImage: `url(/static/images/products/${obj.image})`,
                      }}
                    ></div>
                    <div
                      className={clsx(styles.productLabel, i === selectedOption && styles.active)}
                    >
                      {obj.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.descriptionTitle}>Опис</div>
          <div className={styles.description}>{product.description}</div>
        </div>
      </div>

      <RelatedProducts related={product.related} />
    </>
  )
}
