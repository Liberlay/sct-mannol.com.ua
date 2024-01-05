import clsx from 'clsx'
import { useOnClickAway } from '../../../hooks/useOnClickAway'

import styles from './Dropdown.module.scss'

export const Dropdown = ({ open, setIsMenuOpen, menuRef, children }) => {
  useOnClickAway(menuRef, open, () => setIsMenuOpen(false))

  return (
    <div className={clsx(styles.menu, open && styles.active)}>
      <div
        className={clsx(styles.wrapper, open && styles.active)}
        onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
