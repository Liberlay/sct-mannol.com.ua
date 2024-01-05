import Link from 'next/link'
import { useHorizontalScroll } from 'hooks/horizontalScroll'

import styles from './RelatedProducts.module.scss'

export const RelatedProducts = ({ related }) => {
  const scrollRef = useHorizontalScroll()

  return (
    <div className={styles.container}>
      <div className={styles.relatedTitle}>Також можуть зацікавити:</div>
      <div ref={scrollRef} className={styles.wrapper}>
        {related.map((product, i) => (
          <div key={i} className={styles.productCard}>
            <div className={styles.imageWrapper}>
              <Link href={`/catalog/${product.category}/${product.urlKey}`}>
                <div
                  className={styles.image}
                  style={{
                    backgroundImage: `url(/static/images/products/${product.image})`,
                  }}></div>
              </Link>
            </div>
            <div className={styles.bottom}>
              <div className={styles.title}>{product.title}</div>
              <div className={styles.specification}>{product.specification}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
