'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'
import NoSsr from 'components/NoSsr/NoSsr'
import { Cart } from 'components/Cart/Cart'
import { Search } from 'components/Search/Search'
import { HeaderMenu } from 'components/HeaderMenu'
import { clickOpenCart } from 'store/slices/cartSlice'
import { useSelector, useDispatch } from 'react-redux'
import { MobileMenu } from 'components/MobileMenu/MobileMenu'

import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

import styles from './Header.module.scss'

export const Header = () => {
  const dispatch = useDispatch()
  const menuRef = useRef()
  const cartRef = useRef()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const user = useSelector((state) => state.auth.user)
  const productsAmount = useSelector((state) =>
    state.cart.products.reduce((sum, product) => sum + product.qty, 0),
  )

  return (
    <header className={styles.header}>
      <div className={styles.layout}>
        <div className={styles.left}>
          <Link href="/">
            <img className={styles.logo} src="/assets/images/logos/logo.webp" alt="Mannol" />
            <img
              className={styles.mobileLogo}
              src="/assets/images/logos/M-logo.webp"
              alt="Mannol"
            />
          </Link>
          <div className={styles.nav}>
            <Link className={styles.navItem} href="/catalog">
              Каталог
            </Link>
            <Link
              className={styles.navItem}
              href="https://sct-online.sct-germany.de/SCTOilfinder/index.php?LE=ru&SPL=Mannol"
              target="_blank">
              Онлайн каталог
            </Link>
            <Link className={styles.navItem} href="/about">
              Про нас
            </Link>
            <Link className={styles.navItem} href="/contacts">
              Контакти
            </Link>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.search}>
            <Search showSearch={false} />
          </div>
          <div ref={menuRef} className={styles.userWrapper}>
            <div className={styles.user}>
              <PersonIcon className={styles.icon} onClick={() => setIsMenuOpen(!isMenuOpen)} />
            </div>
            <HeaderMenu.Dropdown menuRef={menuRef} open={isMenuOpen} setIsMenuOpen={setIsMenuOpen}>
              <NoSsr>
                {user !== null ? (
                  <HeaderMenu.Authorized setOpen={setIsMenuOpen} />
                ) : (
                  <HeaderMenu.Unauthorized setOpen={setIsMenuOpen} />
                )}
              </NoSsr>
            </HeaderMenu.Dropdown>
          </div>
          <div ref={cartRef} className={styles.cart}>
            <NoSsr>
              <div className={styles.cartIndicator}>{productsAmount}</div>
              <Cart cartRef={cartRef} />
            </NoSsr>
            <ShoppingCartIcon className={styles.icon} onClick={() => dispatch(clickOpenCart())} />
          </div>
          <div className={styles.menuIcon}>
            {isMobileMenuOpen ? (
              <CloseIcon className={styles.icon} onClick={() => setIsMobileMenuOpen(false)} />
            ) : (
              <MenuIcon className={styles.icon} onClick={() => setIsMobileMenuOpen(true)} />
            )}
          </div>
          <MobileMenu
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>
      </div>
    </header>
  )
}
