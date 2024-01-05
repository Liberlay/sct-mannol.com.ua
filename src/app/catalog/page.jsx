import Link from 'next/link'
import { CATEGORIES } from 'utils/constants'
import { Carousel } from 'components/Carousel/Carousel'

import styles from './page.module.scss'

export const metadata = {
  title: 'Mannol | Каталог товарів',
  description:
    '[ Каталог ] - придбати продукцію Mannol за доступною ціною. В наявності: Моторні масла, трансмісійні масла, присадки, гальмівні рідини, охолоджуючі рідини.',
}

export default function CatalogPage() {
  return (
    <>
      <div className={styles.container}>
        {Object.entries(CATEGORIES).map(([category, { image, label }], i) => (
          <Link key={i} href={`/catalog/${category}`} className={styles.link}>
            <div className={styles.wrapper}>
              <div className={styles.wrapperInner}></div>
              <img src={`/assets/images/catalog/categories/${image}`} alt={`${label}`} />
              <h3 className={styles.title}>{label}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.sliderContainer}>
        <Carousel
          className={styles.slider}
          props={{
            dots: false,
            arrows: false,
            infinite: true,
            draggable: true,
            speed: 500,
            autoplay: true,
            autoplaySpeed: 3000,
            slidesToShow: 1,
            slidesToScroll: 1,
          }}
          content={
            <>
              <img src="/assets/images/catalog/slider/Slider-1.jpg" alt="Слайдер" />
              <img src="/assets/images/catalog/slider/Slider-2.jpg" alt="Слайдер" />
              <img src="/assets/images/catalog/slider/Slider-3.jpg" alt="Слайдер" />
            </>
          }
        />
      </div>
    </>
  )
}
