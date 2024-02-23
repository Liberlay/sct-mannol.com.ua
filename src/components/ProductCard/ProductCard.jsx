import clsx from 'clsx'
import Link from 'next/link'
import { useRef } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import NoSsr from 'components/NoSsr/NoSsr'
import { addCartItem } from 'store/slices/cartSlice'
import { useOnClickAway } from 'hooks/useOnClickAway'
import { useDispatch, useSelector } from 'react-redux'
import { addFavorite, removeFavorite } from 'store/slices/favoritesSlice'

import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'

import styles from './ProductCard.module.scss'

export const ProductCard = ({
  category,
  vendorCode,
  urlKey,
  specification,
  title,
  description,
  options,
}) => {
  const listRef = useRef()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const user = useSelector((state) => state.auth.user)
  const [selectedLabel, setSelectedLabel] = useState(
    options.findIndex((element) => element.isPrimary === true)
  )
  const favorites = useSelector((state) => state.favorites.products)
  useOnClickAway(listRef, isOpen, () => setIsOpen(!isOpen))
  const onChangeCartItem = (image, label, price, key) => {
    dispatch(
      addCartItem({
        vendorCode: vendorCode,
        details: {
          urlKey: urlKey,
          category: category,
          title: title,
          image: image,
          label: label,
          price: price,
        },
        optionKey: key,
        qty: 1,
      })
    )
  }
  return (
    <div className={styles.card}>
      <div className={styles.wrapper} onMouseLeave={() => setIsOpen(false)}>
        <Link
          className={styles.link}
          href={`/products/${urlKey}${
            !options[selectedLabel].isPrimary ? `?option=${options[selectedLabel].key}` : ''
          }`}
        >
          <div
            className={styles.img}
            style={{
              backgroundImage: `url(/static/images/products/${options[selectedLabel].image})`,
            }}
          >
            {!options[selectedLabel].available && (
              <div className={styles.notAvailable}>Немає в наявності</div>
            )}
          </div>
          <div className={styles.content}>
            <h2 className={styles.title}>{title}</h2>
            {specification && <h3 className={styles.specification}>{specification}</h3>}
            <div className={styles.description}>{description}</div>
          </div>
        </Link>
        <div className={styles.bottom}>
          <div
            className={clsx(styles.price, !options[selectedLabel].available && styles.notAvailable)}
          >
            {options[selectedLabel].price}
            {' ₴'}
          </div>
          <NoSsr>
            {user &&
              (!favorites.find((element) => element === vendorCode) ? (
                <FavoriteBorderIcon
                  className={styles.addFavorite}
                  onClick={() => (
                    dispatch(addFavorite(vendorCode)),
                    toast('Товар додано до списку бажаних', { toastId: `add-${vendorCode}` })
                  )}
                />
              ) : (
                <FavoriteIcon
                  className={styles.removeFavorite}
                  onClick={() => (
                    dispatch(removeFavorite(vendorCode)),
                    toast('Товар видалено зі списку бажаних', { toastId: `remove-${vendorCode}` })
                  )}
                />
              ))}
          </NoSsr>
          <button
            className={clsx(styles.button, !options[selectedLabel].available && styles.disable)}
            onClick={() => {
              onChangeCartItem(
                options[selectedLabel].image,
                options[selectedLabel].label,
                options[selectedLabel].price,
                options[selectedLabel].key
              )
              toast('Товар додано до кошика', { toastId: `buy-${vendorCode}` })
            }}
          >
            <ShoppingCartCheckoutIcon className={styles.buttonIcon} />
            Купити
          </button>
        </div>
        <div className={styles.overlay}>
          <div ref={listRef} className={styles.select}>
            {options.length === 1 ? (
              options.find((element) => element.isPrimary === true).label
            ) : (
              <div className={styles.selectWrapper}>
                <div className={styles.selected} onClick={() => setIsOpen(!isOpen)}>
                  {options[selectedLabel].label}
                  <div className={styles.labelPrice}>
                    {options[selectedLabel].price}
                    {' ₴'}
                    {isOpen === true ? (
                      <KeyboardArrowUpIcon className={styles.icon} />
                    ) : (
                      <KeyboardArrowDownIcon className={styles.icon} />
                    )}
                  </div>
                </div>
                <div className={clsx(styles.list, isOpen && styles.active)}>
                  {options.map((product, i) => (
                    <div
                      key={i}
                      className={styles.item}
                      onClick={() => (setSelectedLabel(i), setIsOpen(!isOpen))}
                    >
                      <div>{product.label}</div>
                      <div>
                        {product.price}
                        {' ₴'}
                      </div>
                      {!product.available && (
                        <div className={styles.notAvailable}>Немає в наявності</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
