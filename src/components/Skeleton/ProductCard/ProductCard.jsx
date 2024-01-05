import styles from './PorductCard.module.scss'

export const ProductCard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.image}>
          <div className={styles.skeletonImage}></div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.title}></div>
          <div className={styles.specification}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={styles.skeletonSpecification}></div>
            ))}
          </div>
          <div className={styles.description}>
            {[...Array(7)].map((_, i) => (
              <div key={i} className={styles.skeletonDescription}></div>
            ))}
          </div>
          <div className={styles.price}></div>
        </div>
      </div>
    </div>
  )
}
