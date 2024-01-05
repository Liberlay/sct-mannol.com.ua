import Link from 'next/link'
import { CATEGORIES } from '../../utils/constants'

import styles from './Footer.module.scss'

export const Footer = () => {
  const footerLinks = [
    'Моторні масла для легкових автомобілів',
    'Моторні масла для грузового та автобусного парку',
    'Масла для мототехніки',
    'Індустріальні масла',
    'Автомобільні технічні рідини',
    'Антифріз',
    'Трансмісійні масла та рідини',
    'Присадки',
    'Засоби для догляду за автомобілем',
    'Лампочки',
    'Фільтри',
    'Щітки склоомивача',
  ]
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.company}>
          <Link href="/" className={styles.logoWrapper}>
            <img className={styles.logo} src="/assets/images/logos/logo.webp" alt="Mannol" />
          </Link>
          <div className={styles.info}>
            <p>
              ТОВ Оптимум-Ойл
              <br />
              вул. Успенська 39/1
              <br />
              65000 Одеса, Україна
            </p>
            <div className={styles.contacts}>
              <a href="mailto:mannoldefedersct@gmail.com" target="_blank">
                mannoldefedersct@gmail.com
              </a>
              <a href="tel:+380678464646">+38 067 846 46 46</a>
              <a href="tel:+380638464646 ">+38 063 846 46 46</a>
            </div>
          </div>
        </div>
        <div className={styles.links}>
          {Object.entries(CATEGORIES).map(([category, { label }], i) => (
            <div className={styles.linkWrapper} key={i}>
              <Link className={styles.link} href={`/catalog/${category}`}>
                {label}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.bottom}>@ 2023 ТОВ Оптимум-Ойл</div>
    </footer>
  )
}
