import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { auth } from '../../../utils/auth'
import LogoutIcon from '@mui/icons-material/Logout'

import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

import styles from './Authorized.module.scss'

export const Authorized = ({ setOpen }) => {
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false)
  const user = useSelector((state) => state.auth.user)
  return (
    <div
      className={styles.menuData}
      onClick={() => (setIsLogInModalOpen(!isLogInModalOpen), setOpen(false))}>
      {user.isAdmin && (
        <Link href="/admin/orders" target="_blank" className={styles.menuButton} prefetch="false">
          <AdminPanelSettingsIcon className={styles.menuIcon} />
          Адмін-панель
        </Link>
      )}
      <Link className={styles.menuButton} href="/my-account/credentials" prefetch="false">
        <ManageAccountsIcon className={styles.menuIcon} />
        {user.firstName} {user.lastName}
      </Link>
      <div className={styles.menuButton} onClick={() => (auth.logout(), toast('Вихід виконано'))}>
        <LogoutIcon className={styles.menuIcon} />
        Вийти з аккаунта
      </div>
    </div>
  )
}
