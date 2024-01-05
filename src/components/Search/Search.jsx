import clsx from 'clsx'
import Link from 'next/link'
import { debounce } from 'lodash-es'
import SimpleBar from 'simplebar-react'
import { useRouter } from 'next/navigation'
import { request } from '../../utils/request'
import { useUpdateEffect } from 'usehooks-ts'
import { notifyError } from '../../utils/errors'
import { useOnClickAway } from '../../hooks/useOnClickAway'
import { useState, useRef, useCallback, useEffect } from 'react'

import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'

import styles from './Search.module.scss'

export const Search = ({ showSearch, setIsMobileMenuOpen }) => {
  const [productSearch, setProductSearch] = useState([])
  const [isSearchVisible, setIsSearchVisible] = useState(showSearch)
  const inputRef = useRef()
  const searchRef = useRef()
  const router = useRouter()
  const [value, setValue] = useState('')

  const onClickClear = () => {
    setValue('')
    inputRef.current.focus()
  }

  useOnClickAway(searchRef, isSearchVisible && !showSearch, () => setIsSearchVisible(false))

  useUpdateEffect(() => {
    if (value) {
      updateSearchProduct(value)
    }
  }, [value])

  useEffect(() => {
    if (isSearchVisible && !showSearch) {
      const inputTimeout = setTimeout(() => inputRef.current.focus(), 500)
      return () => clearTimeout(inputTimeout)
    }
  }, [isSearchVisible])

  const updateSearchProduct = useCallback(
    debounce((value) => {
      request
        .unauthorized({
          url: `/products/suggest/${value}`,
        })
        .then((data) => setProductSearch(data))
        .catch(notifyError)
    }, 1000),
    [],
  )

  return (
    <div
      ref={searchRef}
      className={clsx(styles.search, isSearchVisible && styles.active, value && styles.hasValue)}>
      <div className={styles.wrapper}>
        <div className={styles.iconWrapper} onClick={() => setIsSearchVisible(!isSearchVisible)}>
          <SearchIcon className={styles.icon} />
        </div>
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            className={styles.input}
            value={value}
            onInput={(event) => setValue(event.target.value)}
            onKeyDown={(event) =>
              event.key === 'Enter' &&
              (router.push(`/search/${value}`), showSearch && setIsMobileMenuOpen(false))
            }
            tabIndex="-1"
          />
          {value && <ClearIcon className={styles.clearIcon} onClick={() => onClickClear()} />}
        </div>
      </div>
      <div className={clsx(styles.tips, isSearchVisible && value && styles.visible)}>
        <SimpleBar style={{ maxHeight: 200, overflowX: 'hidden' }}>
          <Link href={`/search/${value}`} prefetch={false} className={styles.link}>
            <div className={styles.unknownTip}>Шукати "{value}"</div>
          </Link>
          {productSearch.map((product, i) =>
            typeof product === 'string' ? (
              <div
                key={i}
                className={styles.tip}
                onClick={() => (setValue(product + ' '), inputRef.current.focus())}>
                <div className={styles.title}>{product}</div>
              </div>
            ) : (
              <Link
                key={i}
                href={`/catalog/${product.category}/${product.urlKey}`}
                className={styles.link}>
                <div className={styles.tip} onClick={() => setIsSearchVisible(false)}>
                  <div className={styles.imageWrapper}>
                    <div
                      className={styles.image}
                      style={{
                        backgroundImage: `url(/static/images/products/${product.image})`,
                      }}></div>
                  </div>
                  <div className={styles.title}>{product.title}</div>
                </div>
              </Link>
            ),
          )}
        </SimpleBar>
      </div>
    </div>
  )
}
