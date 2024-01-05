import clsx from 'clsx'
import Link from 'next/link'
import { useUpdateParams } from 'hooks/useUpdateParams'

import styles from './Pagination.module.scss'

export const Pagination = ({ page, totalPages }) => {
  const [, updateParams] = useUpdateParams()
  const firstPage = Math.max(Math.min(page - 2, totalPages - 4), 1)
  const lastPage = Math.min(firstPage + 4, totalPages)
  return (
    <div className={styles.pages}>
      {firstPage > 1 && (
        <Link className={styles.page} href={updateParams({ page: null })}>
          1
        </Link>
      )}
      {firstPage === 3 && (
        <Link className={styles.page} href={updateParams({ page: 2 })}>
          2
        </Link>
      )}
      {firstPage > 3 && (
        <Link className={styles.page} href={updateParams({ page: firstPage - 1 })}>
          ...
        </Link>
      )}
      {[...Array(Math.ceil(lastPage - firstPage + 1))].map((_, i) => (
        <Link
          key={i}
          className={clsx(styles.page, page === i + firstPage && styles.active)}
          href={updateParams({ page: i + firstPage === 1 ? null : i + firstPage })}>
          {i + firstPage}
        </Link>
      ))}
      {lastPage < totalPages - 2 && (
        <Link className={styles.page} href={updateParams({ page: lastPage + 1 })}>
          ...
        </Link>
      )}
      {lastPage === totalPages - 2 && (
        <Link className={styles.page} href={updateParams({ page: totalPages - 1 })}>
          {totalPages - 1}
        </Link>
      )}
      {lastPage < totalPages && (
        <Link className={styles.page} href={updateParams({ page: totalPages })}>
          {totalPages}
        </Link>
      )}
    </div>
  )
}
