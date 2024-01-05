import styles from './Button.module.scss'
import clsx from 'clsx'

export const Button = ({ type, notValid, text, onClick }) => {
  return (
    <div className={styles.wrapper}>
      <button className={clsx(styles[type], notValid && styles.disable)} {...{ onClick }}>
        {text}
      </button>
    </div>
  )
}
