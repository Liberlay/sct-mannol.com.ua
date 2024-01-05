'use client'

import { useState } from 'react'
import { request } from 'utils/request'
import { Sort } from 'components/Sort/Sort'
import { Skeleton } from 'components/Skeleton'
import { useIsClient, useUpdateEffect } from 'usehooks-ts'
import { useParams, useSearchParams } from 'next/navigation'
import { ProductCard } from 'components/ProductCard/ProductCard'
import { ProductTypes } from 'components/ProductTypes/ProductTypes'

import AutorenewIcon from '@mui/icons-material/Autorenew'

import styles from './Products.module.scss'
import { Pagination } from '../Pagination/Pagination'

export const Products = ({ data, total }) => {
  const isClient = useIsClient()
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const sort = searchParams.get('sort') ?? '-popularity'
  const page = searchParams.get('page') ?? '1'
  const totalPages = Math.ceil(total / 20)
  const [isLoading, setIsLoading] = useState(false)
  const { category } = useParams()
  const [currPage, setCurrPage] = useState(1)
  const [products, setProducts] = useState(data)

  useUpdateEffect(() => {
    if (isClient) {
      setIsLoading(true)
      request
        .unauthorized({
          url: '/products',
          params: {
            category: category ? category : null,
            sort: sort ? sort : null,
            type: type ? type : null,
            page: currPage,
          },
        })
        .then(({ data }) => setProducts([...products, ...data]))
        .finally(() => setIsLoading(false))
    }
  }, [currPage])

  return (
    <>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.productType}>
            <ProductTypes category={category} />
          </div>
          <Sort defaultValue="-popularity" value={sort} />
        </div>
        <div className={styles.catalog}>
          {products?.map((obj) => (
            <ProductCard key={obj.urlKey} {...obj} />
          ))}
          {!products && [...Array(20)].map((_, i) => <Skeleton.ProductCard key={i} />)}
          {isLoading && (
            <div className={styles.loading}>
              <div className={styles.ldsRing}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
          {products?.length === 0 && <div className={styles.notFound}>Товарів не знайдено</div>}
        </div>
        <div className={styles.pagination}>
          {!(products.length >= total) && (
            <div className={styles.loadMore} onClick={() => setCurrPage(currPage + 1)}>
              <AutorenewIcon className={styles.icon} />
              Завантажити ще
            </div>
          )}
          <Pagination page={+page} totalPages={totalPages} />
        </div>
      </div>
    </>
  )
}
