import Link from 'next/link'
import { cache } from 'react'
import { request } from 'utils/request'

import styles from './page.module.scss'

const getOrder = cache(async (key) => {
  return await request.unauthorized({
    url: `/orders/by-key/${key}`,
  })
})

export async function generateMetadata({ params }) {
  const { id } = await getOrder(params.key)

  return {
    title: `Замовлення ${id} | Mannol`,
  }
}

export default async function OrderSubmitPage({ params }) {
  const { id } = await getOrder(params.key)

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.image}
        style={{ backgroundImage: `url(/assets/images/checkout/checkout.svg)` }}></div>
      <div className={styles.title}>Ваше замовлення було сформовано</div>
      <div className={styles.title}>
        Номер замовлення:<div className={styles.id}>{id}</div>
      </div>
      <Link href="/" className={styles.link}>
        Повернутися на головну сторінку
      </Link>
    </div>
  )
}
