import clsx from 'clsx'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { useOnClickAway } from 'hooks/useOnClickAway'
import { useUpdateParams } from 'hooks/useUpdateParams'

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import styles from './Sort.module.scss'

export const Sort = ({ defaultValue, value }) => {
  const sortRef = useRef()
  const [, updateParams] = useUpdateParams()
  const [open, setOpen] = useState(false)
  const list = {
    '-popularity': 'Популярні',
    '-price': 'Від дорогих до дешевих',
    price: 'Від дешевих до дорогих',
  }

  useOnClickAway(sortRef, setOpen, () => setOpen(false))

  return (
    <div className={styles.sort} ref={sortRef}>
      <div className={styles.title}>Сортувати за:</div>
      <div className={styles.wrapper}>
        <div className={styles.selector} onClick={() => setOpen(!open)}>
          <div className={styles.selected}>
            {list[value]}
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </div>
          {open && (
            <div className={styles.list}>
              {Object.entries(list).map((obj, i) => (
                <Link
                  key={i}
                  className={clsx(styles.listItem, value === obj[0] && styles.active)}
                  href={updateParams({
                    sort: obj[0] !== defaultValue ? obj[0] : null,
                    page: null,
                  })}>
                  {obj[1]}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
