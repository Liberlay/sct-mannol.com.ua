import { useState } from 'react'
import { Modals } from '../../Modals'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'

import styles from './Unauthorized.module.scss'

export const Unauthorized = ({ setOpen }) => {
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false)
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)

  return (
    <div className={styles.menuData}>
      <div
        className={styles.menuButton}
        onClick={() => (setIsLogInModalOpen(true), setOpen(false))}>
        <LoginIcon className={styles.menuIcon}></LoginIcon>
        Увійти
        <Modals.LogIn isOpen={isLogInModalOpen} setIsOpen={setIsLogInModalOpen} />
      </div>
      <div
        className={styles.menuButton}
        onClick={() => (setIsSignUpModalOpen(true), setOpen(false))}>
        <PersonAddAltIcon className={styles.menuIcon}></PersonAddAltIcon>
        Зареєструватися
        <Modals.SignUp isOpen={isSignUpModalOpen} setIsOpen={setIsSignUpModalOpen} />
      </div>
    </div>
  )
}
