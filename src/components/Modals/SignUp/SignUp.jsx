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

import styles from './SignUp.module.scss'

export const SignUp = ({ isOpen, setIsOpen }) => {
  const [value, setValue] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [formRef, isValid] = useFormValidation(value)

  return (
    <Modal {...{ isOpen, setIsOpen }} title={'Реєстрація'}>
      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.data}>
          <div className={styles.firstAndLastName}>
            <Input.TextFieldBordered
              type="text"
              name="firstName"
              placeholder="Ім'я"
              validation={[inputValidations.name, "Поле повинно містити ім'я"]}
              value={value.firstName}
              onInput={(event) => setValue({ ...value, firstName: event.target.value })}
              required
            />
            <Input.TextFieldBordered
              type="text"
              name="lastName"
              placeholder="Прізвище"
              validation={[inputValidations.name, 'Поле повинно містити прізвище']}
              value={value.lastName}
              onInput={(event) => setValue({ ...value, lastName: event.target.value })}
              required
            />
          </div>
          <Input.TextFieldBordered
            type="email"
            name="email"
            placeholder="Пошта"
            validation={[inputValidations.email, 'Поле повинно містити email']}
            value={value.email}
            onInput={(event) => setValue({ ...value, email: event.target.value })}
            required
          />
          <Input.TextFieldBordered
            type="tel"
            name="phone"
            placeholder="Телефон"
            validation={[inputValidations.phone, 'Поле повинно містити телефон']}
            value={value.phone}
            onInput={(event) => setValue({ ...value, phone: event.target.value })}
            required
          />
          <Input.TextFieldBordered
            type="password"
            name="password"
            placeholder="Пароль"
            validation={[
              inputValidations.password,
              'Поле повинно містити пароль від 8 до 32 символів',
            ]}
            value={value.password}
            onInput={(event) => setValue({ ...value, password: event.target.value })}
            min="8"
            required
          />
        </div>
        <Button
          type={'primary'}
          notValid={!isValid}
          text={'Зареєструватися'}
          onClick={() => {
            request
              .unauthorized({
                url: `/auth/register`,
                method: 'post',
                data: {
                  firstName: value.firstName,
                  lastName: value.lastName,
                  email: value.email,
                  phone: value.phone,
                  password: value.password,
                },
              })
              .then((data) => auth.login(data), toast('Реєстрація виконана'))
              .catch(notifyError)
          }}
        />
      </form>
    </Modal>
  )
}
