import clsx from 'clsx'
import Link from 'next/link'
import SimpleBar from 'simplebar-react'
import { CATEGORIES } from 'utils/constants'
import { useUpdateParams } from 'hooks/useUpdateParams'

import styles from './ProductTypes.module.scss'

export const ProductTypes = ({ category }) => {
  const [searchParams, updateParams] = useUpdateParams()
  const type = searchParams.get('type')

  return (
    <SimpleBar className={styles.simplebar}>
      <div className={styles.types}>
        <Link
          className={clsx(styles.link, type === null && styles.active)}
          href={updateParams({ type: null, page: null })}>
          Всі товари
        </Link>
        {Object.entries(CATEGORIES[category]?.types ?? []).map(([key, label], i) => (
          <Link
            key={i}
            className={clsx(styles.link, type === key && styles.active)}
            href={updateParams({ type: key, page: null })}>
            {label}
          </Link>
        ))}
      </div>
    </SimpleBar>
  )
}
