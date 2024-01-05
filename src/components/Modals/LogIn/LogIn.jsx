import { useState } from 'react'
import { Input } from '../../Input'
import { toast } from 'react-toastify'
import { Modal } from '../../Modal/Modal'
import { auth } from '../../../utils/auth'
import { Button } from '../../Button/Button'
import { request } from '../../../utils/request'
import { notifyError } from '../../../utils/errors'
import { useFormValidation } from '../../../hooks/formValidation'
import { inputValidations } from '../../../utils/inputValidations'

import styles from './LogIn.module.scss'

export const LogIn = ({ isOpen, setIsOpen, onClosed }) => {
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  return (
    <Modal
      {...{ isOpen, setIsOpen, onClosed }}
      title={!isForgotPassword ? 'Вхід' : 'Відновлення паролю'}
      onClosed={setIsForgotPassword}
      back={isForgotPassword ? () => setIsForgotPassword(false) : null}>
      {!isForgotPassword ? (
        <LogInContent setIsForgotPassword={setIsForgotPassword} />
      ) : (
        <PasswordRecovery setIsOpen={setIsOpen} setIsForgotPassword={setIsForgotPassword} />
      )}
    </Modal>
  )
}

const LogInContent = ({ setIsForgotPassword }) => {
  const [value, setValue] = useState({
    login: '',
    password: '',
  })
  const [formRef, isValid] = useFormValidation(value)

  return (
    <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
      <div className={styles.data}>
        <Input.TextFieldBordered
          type="email"
          name="email"
          placeholder="Пошта або телефон"
          validation={[inputValidations.login, 'Поле повинно містити email або телефон']}
          value={value.login}
          onInput={(event) => setValue({ ...value, login: event.target.value })}
          required
        />
        <Input.TextFieldBordered
          type="password"
          name="password"
          placeholder="Пароль"
          value={value.password}
          onInput={(event) => setValue({ ...value, password: event.target.value })}
          min="8"
          required
        />
      </div>
      <div className={styles.forgotPassword}>
        <div className={styles.button} onClick={() => setIsForgotPassword(true)}>
          Забули пароль
        </div>
      </div>
      <Button
        type={'primary'}
        notValid={!isValid}
        text={'Увійти'}
        onClick={() => {
          request
            .unauthorized({
              url: `/auth/login`,
              method: 'post',
              data: {
                login: value.login,
                password: value.password,
              },
            })
            .then((data) => (auth.login(data), toast('Вхід виконано')))
            .catch(notifyError)
        }}
      />
    </form>
  )
}

const PasswordRecovery = ({ setIsOpen, setIsForgotPassword }) => {
  const [recoveryEmail, setRecoveryEmail] = useState({
    email: '',
  })
  const [recoveryFormRef, isFormValid] = useFormValidation(recoveryEmail)

  return (
    <form ref={recoveryFormRef} onSubmit={(e) => e.preventDefault()}>
      <div className={styles.data}>
        <Input.TextFieldBordered
          type="email"
          name="email"
          placeholder="Введіть пошту для відновлення паролю"
          validation={[inputValidations.email, 'Поле повинно містити email']}
          value={recoveryEmail.email}
          onInput={(event) => setRecoveryEmail({ ...recoveryEmail, email: event.target.value })}
          required
        />
      </div>
      <Button
        type={'primary'}
        notValid={!isFormValid}
        text={'Відправити'}
        onClick={() => {
          request
            .unauthorized({
              url: `/password-recovery/send`,
              method: 'post',
              params: {
                email: recoveryEmail.email,
              },
            })
            .then(
              () => (
                setIsOpen(false),
                setTimeout(() => setIsForgotPassword(false), 500),
                toast('Листа відправлено')
              ),
            )
            .catch(notifyError)
        }}
      />
    </form>
  )
}
