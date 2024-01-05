'use client'

import { request } from 'utils/request'
import { useSelector } from 'react-redux'
import { notifyError } from 'utils/errors'
import { useState, useRef, useEffect } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'
import { ProductCard } from 'components/ProductCard/ProductCard'

import styles from './Favorites.module.scss'

export const Favorites = () => {
  const loaderRef = useRef()
  const [products, setProducts] = useState([])
  const [currPage, setCurrPage] = useState(1)
  const [prevPage, setPrevPage] = useState(0)
  const [lastList, setLastList] = useState(false)
  const favorites = useSelector((state) => state.favorites.products)
  const productsLoading = useIntersectionObserver(loaderRef, {
    rootMargin: '1px',
  })
  const filteredProducts = products.filter((product) => favorites.includes(product.vendorCode))

  useEffect(() => {
    if (!lastList && prevPage !== currPage) {
      request
        .authorized({
          url: '/products',
          params: {
            vendorCodes: favorites.slice((currPage - 1) * 20, currPage * 20).join(),
          },
        })
        .then(({ data }) => {
          if (currPage * 20 >= favorites.length) setLastList(true)

          setProducts([...products, ...data])
          setPrevPage(currPage)
        })
        .catch(notifyError)
    }
  }, [currPage])

  useEffect(() => {
    if (productsLoading?.isIntersecting && currPage === prevPage) {
      setCurrPage(currPage + 1)
    }
  }, [productsLoading?.isIntersecting])

  if (!filteredProducts?.length)
    return (
      <div className={styles.empty}>
        <div
          className={styles.image}
          style={{ backgroundImage: 'url(/images/favorites/bookmark-x.svg)' }}></div>
        <div className={styles.title}>Список бажаного порожній :(</div>
      </div>
    )

  return (
    <div className={styles.container}>
      <div className={styles.title}>Список бажаного</div>
      <div className={styles.wrapper}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.vendorCode} {...product} />
        ))}
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
    </div>
  )
}
