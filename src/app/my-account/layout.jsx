import NoSsr from 'components/NoSsr/NoSsr'
import { Sidebar } from './_components/Sidebar/Sidebar'

import styles from './layout.module.scss'

export default function MyAccountTemplate({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar></Sidebar>
      <div className={styles.wrapper}>
        <NoSsr>{children}</NoSsr>
      </div>
    </div>
  )
}
