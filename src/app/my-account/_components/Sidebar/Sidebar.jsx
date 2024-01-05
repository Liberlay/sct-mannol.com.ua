'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { useIsClient } from 'usehooks-ts'
import { useSelector } from 'react-redux'
import NoSsr from 'components/NoSsr/NoSsr'
import { redirect } from 'next/navigation'
import { usePathname } from 'next/navigation'

import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import ChecklistIcon from '@mui/icons-material/Checklist'

import styles from './Sidebar.module.scss'

export const Sidebar = () => {
  const pathname = usePathname()
  const isClient = useIsClient()
  const user = useSelector((state) => state.auth.user)

  if (isClient && !user) redirect('/', 'replace')

  return (
    <div className={styles.wrapper}>
      <div className={styles.user}>
        <div className={styles.iconContainer}>
          <PersonIcon className={styles.icon} />
        </div>
        <NoSsr>{user?.email}</NoSsr>
      </div>
      <div className={styles.menu}>
        <Link
          href="/my-account/credentials"
          className={clsx(
            styles.menuElement,
            pathname === '/my-account/credentials' && styles.active,
          )}>
          <PersonIcon className={styles.menuIcon} />
          Зміна данних
        </Link>
        <Link
          href="/my-account/favorites"
          className={clsx(
            styles.menuElement,
            pathname === '/my-account/favorites' && styles.active,
          )}>
          <BookmarkIcon className={styles.menuIcon} />
          Список бажаного
        </Link>
        <Link
          href="/my-account/orders"
          className={clsx(styles.menuElement, pathname === '/my-account/orders' && styles.active)}>
          <ChecklistIcon className={styles.menuIcon} />
          Мої замовлення
        </Link>
        <div
          className={styles.menuElement}
          onClick={() => (auth.logout(), toast('Вихід виконано'))}>
          <LogoutIcon className={styles.menuIcon} />
          Вихід
        </div>
      </div>
    </div>
  )
}
