import { Input } from '../../Input'
import { toast } from 'react-toastify'
import { useState, useRef } from 'react'
import { Modal } from '../../Modal/Modal'
import { Button } from '../../Button/Button'
import { request } from '../../../utils/request'
import { notifyError } from '../../../utils/errors'
import { useFormValidation } from '../../../hooks/formValidation'
import { inputValidations } from '../../../utils/inputValidations'

import styles from './ChangePassword.module.scss'

export const ChangePassword = ({ isOpen, setIsOpen }) => {
  const [value, setValue] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: '',
  })
  const [formRef, isValid] = useFormValidation(value)

  return (
    <Modal {...{ isOpen, setIsOpen }} title={'Зміна пароля'}>
      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.data}>
          <Input.TextFieldBordered
            type="password"
            name="password"
            placeholder="Дійсний пароль"
            value={value.currentPassword}
            onInput={(event) => setValue({ ...value, currentPassword: event.target.value })}
            min="8"
            required
          />
          <Input.TextFieldBordered
            type="password"
            placeholder="Новий пароль"
            validation={[
              inputValidations.password,
              'Поле повинно містити пароль від 8 до 32 символів',
            ]}
            value={value.newPassword}
            onInput={(event) => setValue({ ...value, newPassword: event.target.value })}
            min="8"
            required
          />
          <Input.TextFieldBordered
            type="password"
            placeholder="Підтвердити пароль"
            validation={[
              inputValidations.password,
              'Поле повинно містити пароль від 8 до 32 символів',
            ]}
            value={value.newPasswordConfirmation}
            onInput={(event) => setValue({ ...value, newPasswordConfirmation: event.target.value })}
            min="8"
            required
          />
        </div>
      </form>
      <Button
        type={'primary'}
        notValid={!isValid || value.newPasswordConfirmation !== value.newPassword}
        text={'Змінити пароль'}
        onClick={() => {
          request
            .authorized({
              url: `/@me/update_password`,
              method: 'post',
              data: {
                currentPassword: value.currentPassword,
                newPassword: value.newPassword,
              },
            })
            .then(() => (setIsOpen(false), toast('Пароль успішно змінено!')))
            .catch(notifyError)
        }}
      />
    </Modal>
  )
}
