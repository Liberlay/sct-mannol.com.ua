import { createPortal } from 'react-dom'
import { useIsClient } from 'usehooks-ts'
import { CSSTransition } from 'react-transition-group'

import ClearIcon from '@mui/icons-material/Clear'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import styles from './Modal.module.scss'

export const Modal = ({ isOpen, setIsOpen, onClosed, back, title, children }) => {
  const isClient = useIsClient()
  const closeModal = () => (setIsOpen(false), onClosed && setTimeout(() => onClosed(false), 500))

  if (!isClient) return <></>

  return createPortal(
    <CSSTransition in={isOpen} timeout={500} classNames={styles} mountOnEnter unmountOnExit>
      <div className={styles.wrapper} onMouseDown={closeModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
          <div className={styles.top}>
            {back && <ArrowBackIcon className={styles.backIcon} onClick={() => back()} />}
            <div className={styles.title}>{title}</div>
            <ClearIcon className={styles.closeIcon} onClick={closeModal} />
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </CSSTransition>,
    document.getElementById('modals'),
  )
}
