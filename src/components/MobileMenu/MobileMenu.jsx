import clsx from 'clsx'
import Link from 'next/link'
import { Modals } from '../Modals'
import { toast } from 'react-toastify'
import { auth } from '../../utils/auth'
import { useRef, useState } from 'react'
import { Search } from '../Search/Search'
import { useSelector } from 'react-redux'
import NoSsr from 'components/NoSsr/NoSsr'
import { useOnClickAway } from '../../hooks/useOnClickAway'

import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

import styles from './MobileMenu.module.scss'

export const MobileMenu = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const mobileMenuRef = useRef()
  const user = useSelector((state) => state.auth.user)
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false)
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)

  useOnClickAway(mobileMenuRef, isMobileMenuOpen, () => setIsMobileMenuOpen(false))
  return (
    <div
      ref={mobileMenuRef}
      className={clsx(styles.mobileMenuWrapper, isMobileMenuOpen && styles.open)}>
      <div className={styles.mobileMenu}>
        <div className={styles.search}>
          <Search showSearch setIsMobileMenuOpen={setIsMobileMenuOpen} />
        </div>
        <div className={styles.nav}>
          <Link
            className={styles.navItem}
            href="/catalog"
            onClick={() => setIsMobileMenuOpen(false)}>
            Каталог
            <div className={styles.linkBorder}></div>
          </Link>
          <Link
            className={styles.navItem}
            href="https://sct-online.sct-germany.de/SCTOilfinder/index.php?LE=ru&SPL=Mannol"
            target="_blank"
            onClick={() => setIsMobileMenuOpen(false)}>
            Онлайн каталог
            <div className={styles.linkBorder}></div>
          </Link>
          <Link className={styles.navItem} href="/about" onClick={() => setIsMobileMenuOpen(false)}>
            Про нас
            <div className={styles.linkBorder}></div>
          </Link>
          <Link
            className={styles.navItem}
            href="/contacts"
            onClick={() => setIsMobileMenuOpen(false)}>
            Контакти
            <div className={styles.linkBorder}></div>
          </Link>
        </div>
        <div className={styles.user}>
          <NoSsr>
            {user ? (
              <div className={styles.authorized}>
                {user.isAdmin && (
                  <Link
                    href="/admin/orders"
                    target="_blank"
                    prefetch={false}
                    className={styles.menuButton}
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <AdminPanelSettingsIcon className={styles.menuIcon} />
                    Адмін-панель
                  </Link>
                )}
                <Link
                  href="/my-account/credentials"
                  prefetch={false}
                  className={styles.menuButton}
                  onClick={() => setIsMobileMenuOpen(false)}>
                  <ManageAccountsIcon className={styles.menuIcon} />
                  {user.firstName} {user.lastName}
                </Link>
                <div
                  className={styles.menuButton}
                  onClick={() => (
                    auth.logout(), setIsMobileMenuOpen(false), toast('Вихід виконано')
                  )}>
                  <LogoutIcon className={styles.menuIcon} />
                  Вийти з аккаунта
                </div>
              </div>
            ) : (
              <div className={styles.unauthorized}>
                <div className={styles.menuButton} onClick={() => setIsLogInModalOpen(true)}>
                  <LoginIcon className={styles.menuIcon}></LoginIcon>
                  Увійти
                  <Modals.LogIn isOpen={isLogInModalOpen} setIsOpen={setIsLogInModalOpen} />
                </div>
                <div className={styles.menuButton} onClick={() => setIsSignUpModalOpen(true)}>
                  <PersonAddAltIcon className={styles.menuIcon}></PersonAddAltIcon>
                  Зареєструватися
                  <Modals.SignUp isOpen={isSignUpModalOpen} setIsOpen={setIsSignUpModalOpen} />
                </div>
              </div>
            )}
          </NoSsr>
        </div>
      </div>
    </div>
  )
}
